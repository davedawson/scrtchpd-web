/** @jsx React.DOM */
var React = require('react');
var SearchBar = require('./SearchBar.js');
var NoteList = require('./NoteList.js');

var Codemirror = require('react-codemirror');

var App = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      text: "",
      code: "Write something",
      counter: 0,
    };
  },
  
  componentWillMount: function() {

  },

  componentDidMount: function() {

  },

  searchHandler: function(key, searchKey) {
    console.log(this.state.notes);
    var results = this.state.notes.filter(function (element) {
      var note = element.note;
      return note.toLowerCase().indexOf(key.toLowerCase()) > -1; 
    });
    this.setState({
      displayedNotes: results
    });
  },

  updateCode: function(newCode) {
    if (this.state.code != "Write something"){
      /* On update, set the state of Codemirror to the newly typed text. Also save the new text to Firebase */
      var childRef = firebaseRef.child(this.state.item['.key']); 
      /* This code sets the text of Codemirror */
      this.setState({
          code: newCode
      });
      childRef.update({
        "note": this.state.code,
        "updated_at": Firebase.ServerValue.TIMESTAMP
      });
      var note = this.state.item['.key'];
      console.log(this.state.displayedNotes);
    }
    
  },
  handleNoteAreaUpdate: function(item, notes){
    /* This takes the actived note, and sets the state of Codemirror that that note's full text. */
    this.setState({
      code: item.note,
      item: item,
      notes: notes
    });
  },
  newNote: function(){
    console.log('new');
    var newNoteRef = this.firebaseRefs.notes.push({
      "note": "Write something!",
      "created_at": Firebase.ServerValue.TIMESTAMP,
      "updated_at": Firebase.ServerValue.TIMESTAMP
    })
    this.bindAsObject(newNoteRef, "emptyNote");
    this.setState({code: newNoteRef.toString()});
    this.unbind("emptyNote");
  },
  onUpdate: function(val){
      this.setState({
          data: val
      });
      console.log('updated from App')
  },
  render: function() {
      var options = {
        mode: {
          name: "gfm",
          highlightFormatting: true
        },
        lineNumbers: false,
        lineWrapping: true,
        autofocus: true,
        extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"},
      };
      return (
          <div>
            <div className="archive">
              <SearchBar searchHandler={this.searchHandler}/>
              <div className="notes">
                <NoteList updateNoteArea={this.handleNoteAreaUpdate} onChange={this.onUpdate} />
              </div>
            </div>
            <section className="writer">
              <Codemirror value={this.state.code} options={options} onChange={this.updateCode} />
            </section>
          </div>
      );
  }
    
});
    
module.exports = App;