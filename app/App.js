/** @jsx React.DOM */

var React = require('react');
var SearchBar = require('./SearchBar.js');
var NoteList = require('./NoteList.js');

var Codemirror = require('react-codemirror');

var App = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      code: "Write something",
      counter: 0,
      query:'',
      notes: [],
      filteredData: [
      
      ]
    };
  },
  
  componentWillMount: function() {
    firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/notes");
    this.bindAsArray(firebaseRef, "notes");
  },

  componentDidMount: function() {

  },

  doSearch:function(queryText){
    console.log(queryText)
    //get query result
    var queryResult=[];
    this.state.notes.forEach(function(item){
      if(item.note.toLowerCase().indexOf(queryText)!=-1)
      queryResult.push(item);
    });
    
    this.setState({
      query:queryText,
      filteredData: queryResult
    })
  },

  searchHandler: function(key, searchKey) {
    var queryResult=[];
    this.state.notes.forEach(function(person){
      if(person.note.toLowerCase().indexOf(key)!=-1)
      queryResult.push(person);
    });
    this.setState({
      notes: queryResult,
    });
  },

  updateCode: function(newCode) {
    if (this.state.code != "Write something"){ 
      /* On update, set the state of Codemirror to the newly typed text. Also save the new text to Firebase */
      var firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/notes");
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
      console.log(testRef);
    }
    
  },
  handleNoteAreaUpdate: function(item, notes){
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
    })
    this.bindAsObject(newNoteRef, "item");
    this.setState({
      code: "Write something!",
    });
    console.log(this.state.emptyNote)
    
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
              <SearchBar searchHandler={this.searchHandler} query={this.state.query} doSearch={this.doSearch} />
              <div className="notes">
                <NoteList notes={this.state.filteredData} results={this.state.results} updateNoteArea={this.handleNoteAreaUpdate} onChange={this.onUpdate} />
              </div>
            </div>
            <section className="writer">
              <Codemirror value={this.state.code} options={options} onChange={this.updateCode} />
            </section>
            <div className="border">
              <ul>
                <li className="clear"><a className="call-modal" onClick={this.clearText}><span>&times;</span></a></li>
                <li className="character-count"><span onClick={this.onClick}>{this.state.code.length}</span></li>
                <li><a onClick={this.newNote}>New note</a></li>
              </ul>
            </div>
          </div>
      );
  }
    
});

module.exports = App;