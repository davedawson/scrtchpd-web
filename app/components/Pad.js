/** @jsx React.DOM */

var React = require('react');
var SearchBar = require('./SearchBar.js');
var NoteList = require('./NoteList.js');
var Router = require('react-router');
var Link = require('react-router').Link

var fuzzy = require('fuzzy');
var Codemirror = require('react-codemirror');
    require('../../node_modules/codemirror/mode/markdown/markdown.js')
    require('../../node_modules/codemirror/mode/gfm/gfm.js');
    require('../../node_modules/codemirror/addon/display/placeholder.js');

var Pad = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {

    return {
      code: "Write something",
      counter: 0,
      query:'',
      notes: [],
      codePlaceholder: "Write something!",
    };
  },

  componentWillMount: function() {
    firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/notes");
    this.bindAsArray(firebaseRef, "notes");
    var notesRef = new Firebase("https://scrtchpd.firebaseio.com/notes");
    var authData = notesRef.getAuth();
    console.log(authData.uid);


    var userNotesRef = notesRef.child("user").child(authData.uid);
    console.log('Notes:');
    console.log(userNotesRef);
    this.bindAsArray(userNotesRef, "userNotes");
    this.setState({
      authData: authData
    });

    var ref = new Firebase("https://scrtchpd.firebaseio.com/");

    ref.child("users/" + authData.uid + "/notes").on('child_added', function(snapshot) {
      // for each group, fetch the name and print it
      var noteKey = snapshot.key();
      console.log('noteKey');
      ref.child("notes/" + noteKey + "/note").once('value', function(snapshot) {
        console.log("Note: " + snapshot.val());
      });
    });

    
  },

  componentDidMount: function() {

  },

  doSearch:function(queryText){
    console.log(queryText)
    //get query result
    var queryResult=[]; 
    var options = {
      pre: '<strong>',
      post: '</strong>',
      extract: function(el) { return el.note; }
    };
    var list = ['baconing', 'narwhal', 'a mighty bear canoe'];
    var list2 = this.state.notes;
    var results = fuzzy.filter(queryText, list2, options)
    console.log(results);
    /* var matches = results.map(function(el) { return el; });
    console.log(matches);
    */
    /* Traverse this tree: https://www.dropbox.com/s/4j4d8poh6e0r36a/Screenshot%202015-12-17%2015.34.14.png?dl=0 */
    results.forEach(function(item){
      queryResult.push(item.original);
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

    console.log('typing');
    this.setState({
        code: newCode
    });
    if (this.state.code != "Write something" && this.state.item == null) {
      /* this.state.item.note != "Write something!" && this.state.item.key == null  */
      console.log('Not default note');
      /* Create a new note */
      this.createNewNote(this.state.code);
      console.log('Sending to createNewNote');
    } else if (this.state.item){
      /* If an item exists, update that item */
      var firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/notes");
      /* Why does this only work if defined above? Shouldn't it pull in vars from other functions? */
      var testRef = firebaseRef.child(this.state.item['.key']); 
      /* This code sets the text of Codemirror */
      testRef.update({
        "note": this.state.code,
        "updated_at": Firebase.ServerValue.TIMESTAMP
      });
      console.log(testRef);
      console.log('Updating existing note');
    }
    if (this.state.code != "Write something"){ 
      /* On update, set the state of Codemirror to the newly typed text. Also save the new text to Firebase */
      
      
    }
    
  },
  handleNoteAreaUpdate: function(clickedNote, notes){
    /* This takes the actived note, and sets the state of Codemirror that that note's full text. */
    this.setState({
      code: clickedNote.note,
      item: clickedNote
    });
  },
  placeNewNote: function(){
    console.log('New Note, creating now');
      
      var newNoteRef = this.firebaseRefs.notes.push({
        "note": "Write something!",
        "created_at": Firebase.ServerValue.TIMESTAMP,
        "updated_at": Firebase.ServerValue.TIMESTAMP
      })
      this.bindAsObject(newNoteRef, "item");
      this.setState({
        code: "Write something! NEW NOTE",
      });
      this.unbind("item");

  },
  newNote: function(){
    /*
    if (this.state.item) {
      console.log('already a note');
    } else {
    var newNoteRef = this.firebaseRefs.notes.push({
      "note": "Write something!",
      "created_at": Firebase.ServerValue.TIMESTAMP,
      "updated_at": Firebase.ServerValue.TIMESTAMP
    })
    this.bindAsObject(newNoteRef, "item");
    this.setState({
      code: "Write something!",
    });
    }
    */
    if (this.state.item) {
      console.log('already a note. Do nothing.');
    } else {
      console.log('New Note, creating now');
      var newNoteRef = this.firebaseRefs.notes.push({
        "note": "Write something!",
        "created_at": Firebase.ServerValue.TIMESTAMP,
        "updated_at": Firebase.ServerValue.TIMESTAMP
      })
      this.bindAsObject(newNoteRef, "item");
      this.setState({
        code: "Write something!",
      });
    }

    /* this.unbind("emptyNote"); */
  },
  handleNewNote: function(item){
    if (this.state.item) {
      console.log('A note already exists as Item. Do nothing.');
    } else {
      console.log('Ready to create a new note. Sending to createNewNote');
      this.createNewNote(item);
    }
  },
  createNewNote: function(item){
    console.log('Creating a new note');
      var newNoteRef = this.firebaseRefs.notes.push({
        "note": this.state.code,
        "created_at": Firebase.ServerValue.TIMESTAMP,
        "updated_at": Firebase.ServerValue.TIMESTAMP
      });
      this.bindAsObject(newNoteRef, "emptyNote");
      this.bindAsObject(newNoteRef, "item");
      this.setState({code: this.code });
      newNoteKey = newNoteRef.key();
      console.log(this.state.authData.uid);
      var userNotesRef = new Firebase("https://scrtchpd.firebaseio.com/users/" + this.state.authData.uid + "/notes");
      var newNoteUserRef = userNotesRef.child(newNoteKey).set(true);
      this.unbind("emptyNote");
      this.unbind("item");

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
        placeholder: "TESTING placeholder"
      };
      
      return (
          <div>
            <div className="archive">
              <SearchBar searchHandler={this.searchHandler} query={this.state.query} doSearch={this.doSearch} />
              <div className="notes">
                <NoteList notes={this.state.filteredData ? this.state.filteredData : this.state.notes} results={this.state.results} updateNoteArea={this.handleNoteAreaUpdate} onChange={this.onUpdate} />
              </div>
            </div>
            <section className="writer">
              <Codemirror value={this.state.code} options={options} onChange={this.updateCode} placeholder="testing placeholder" />
            </section>
            <div className="border">
              <ul>
                <li className="clear"><a className="call-modal" onClick={this.clearText}><span>&times;</span></a></li>
                <li className="character-count"><span onClick={this.onClick}></span></li>
                <li><a onClick={this.placeNewNote}>New note</a></li>
              </ul>
            </div>
          </div>
      );
  }
    
});

module.exports = Pad;