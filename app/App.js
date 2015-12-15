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
      notes: [],
      displayedNotes: []
    };
  },
  componentDidMount: function() {
    /* Grab the DB from firebase. Set the results as an array of notes. Why isn't firebaseRef accessible from other functions? */
    firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/notes");
    this.bindAsArray(firebaseRef, "notes");
  },

  searchHandler: function(key, searchKey) {
    var results = this.state.notes.filter(function (element) {
      var note = element.note;
      return note.toLowerCase().indexOf(key.toLowerCase()) > -1; 
    });
    this.setState({
      displayedNotes: results
    });
  },

  updateCode: function(newCode) {
    /* On update, set the state of Codemirror to the newly typed text. Also save the new text to Firebase */
    var firebaseRef = Rebase.createClass("https://scrtchpd.firebaseio.com/notes");
      /* Why does this only work if defined above? Shouldn't it pull in vars from other functions? */
    var testRef = firebaseRef.child(this.state.item['.key']); 
    /* This code sets the text of Codemirror */
    this.setState({
        code: newCode
    });
    testRef.update({
      "note": this.state.code,
      "updated_at": Firebase.ServerValue.TIMESTAMP
    });
    var note = this.state.item['.key'];
    console.log(this.state.displayedNotes);
  },
  handleNoteAreaUpdate: function(item){
    /* This takes the actived note, and sets the state of Codemirror that that note's full text. */
    this.setState({
      code: item.note,
      item: item
    });
  },
  newNote: function(){
    console.log('new');
    var newNoteRef = this.firebaseRefs.notes.push({
      "note": "Write something!",
      "created_at": Firebase.ServerValue.TIMESTAMP,
      "updated_at": Firebase.ServerValue.TIMESTAMP
    });
    this.bindAsObject(newNoteRef, "emptyNote");
    this.setState({code: newNoteRef.toString()});
    this.unbind("emptyNote");
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
                <NoteList notes={this.state.displayedNotes} updateNoteArea={this.handleNoteAreaUpdate} />
              </div>
            </div>
            <section className="writer">
              <Codemirror value={this.state.code} options={options} />
            </section>
          </div>
      );
  }
    
});
    
module.exports = App;