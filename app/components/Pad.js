var React = require('react');
var ReactDOM = require('react-dom');
var SearchBar = require('./SearchBar.js');
var NoteList = require('./NoteList.js');
var Writer = require('./Writer.js');
var Router = require('react-router');
var Link = require('react-router').Link
var classNames = require('classnames');

var fuzzy = require('fuzzy');
var moment = require('moment');
var Rebase = require('re-base');
var Codemirror = require('react-codemirror');
var firebaseRef;
var activeNoteRef;
var authData;
var usersNotes = [];
var base;
    // require('../../node_modules/codemirror/mode/markdown/markdown.js')
    // require('../../node_modules/codemirror/mode/gfm/gfm.js');
    // require('../../node_modules/codemirror/addon/display/placeholder.js');

var Pad = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {

    return {
      // code: "Write something",
      counter: 0,
      query:'',
      notes: [],
      // item: new Object(),
      listItems: [],
      userNoteKeys: [],
      usersNotesList: new Object(),
      codePlaceholder: "Write something!",
      sidebarOpen: false,
      code: ""
    };
  },
  
  componentWillMount: function() {
    firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/");
    base = Rebase.createClass('https://scrtchpd.firebaseio.com/');

    // All notes
    var allNotesRef = firebaseRef.child("/notes/").limitToLast(15);
    this.bindAsArray(allNotesRef, "notes");
    authData = firebaseRef.getAuth();

    var userNotesRef = firebaseRef.child("/users/" + authData.uid + "/notes").limitToLast(15);
    
    this.bindAsArray(userNotesRef, "userNotes");
    this.setState({
      authData: authData
    });
    var addToItemList = function(note) {
      console.log('note:', note);
    };
    var usersNotesListTest = new Object();
    // User specific notes
    var usersNotesKeys = []
    var usersNotesList = []

    // Grab the user's notes keys and loop through them
    var ref = firebaseRef.child('users/' + authData.uid + '/notes');
    var query = ref.orderByChild('date_updated');
    console.log('results', query, ref);
    // var reverseResults = query.reverse();
    this.bindAsArray(query, 'userNoteKeys');  
    this.indexSearchData();
  },

  indexSearchData: function(){ 
    // Run this when the app loads, hold on to all of this data for when there's a search

    firebaseRef.child('users/' + authData.uid + '/notes').orderByChild('date_updated').on("child_added", function(noteKeySnapshot) {
      // usersNotes.push(noteKeySnapshot.key());
      // For each note key, go and fetch the Note record with the same key
      // this.bindAsObject(ref, noteKeySnapshot.key()); 
      // console.log('snapshot', noteKeySnapshot.key());
      firebaseRef.child('notes/' + noteKeySnapshot.key()).once("value", function(noteSnapshot) {
        // Add that full note object to an array + the parent key
        var data = noteSnapshot.val();
        // console.log('data', data);
        usersNotes.push({
            'note':       data.note,
            'key': noteKeySnapshot.key()
        });
        // console.log('usersNotes', usersNotes);
      });
    });
    this.setState({
      indexedSearchData: usersNotes
    });
  },

  doSearch:function(queryText){
    console.log('queryText', queryText)

    //get query result
    var queryResult=[]; 
    var options = {
      pre: '<strong>',
      post: '</strong>',
      extract: function(el) { return el.note; }
    };
    // Filter the indexed list with the query test   
    var results = fuzzy.filter(queryText, this.state.indexedSearchData, options)
    console.log(results, queryResult);
    /* Traverse this tree: https://www.dropbox.com/s/4j4d8poh6e0r36a/Screenshot%202015-12-17%2015.34.14.png?dl=0 */
    results.forEach(function(item){
      queryResult.push(item.original.key);
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
      console.log('Not default note');
      /* Create a new note */
      this.createNewNote(this.state.code);
      console.log('Sending to createNewNote');
    } else if (this.state.item){

      
      /* If an item exists, update that item */
      // var activeNoteRef = firebaseRef.child('/notes/' + this.state.activeNoteKey); 
      // // Update FB with this new text
      // // TODO: THIS is wrong. It should not create a new reference every time it updates. That's crazy.
      // activeNoteRef.update({
      //   "note": this.state.code,
      //   "updated_at": Firebase.ServerValue.TIMESTAMP
      // });
      console.log('Updating existing note');
      var noteData = this.state.item;
      noteData.note = newCode;
      this.setState({
        // item.note: 'test'
        item: noteData
      });
      console.log(this.state.item.note);
    }
    if (this.state.code != "Write something"){ 
      /* On update, set the state of Codemirror to the newly typed text. Also save the new text to Firebase */      
    }
    
  },
  placeClickedNote: function(clickedNote, clickedNoteKey) {
    // If there's already an active note, remove the binding before creating a new one. 
    if (activeNoteRef){
      base.removeBinding(activeNoteRef);  
    }
    
    // activeNoteRef = base.fetch('notes/' + clickedNoteKey, {
    //   context: this,
    //   asArray: false,
    //   then(noteData){
    //     this.setState({
    //       code: noteData.note,
    //       item: noteData
    //     })    
    //   }
    // });
    activeNoteRef = base.syncState('notes/' + clickedNoteKey, {
      context: this,
      state: 'item',
      asArray: false
    });
    base.fetch('notes/' + clickedNoteKey, {
      context: this,
      asArray: false,
      then(noteData){
        this.setState({
          code: noteData.note
        })
      }
    });
    this.setState({
      activeNoteKey: clickedNoteKey
    });
  },
  placeNewNote: function(){
    var newNotePath;
    console.log('New Note, creating now');
      var newNoteRef = this.firebaseRefs.notes.push({
        "note": this.state.code,
        "created_at": Firebase.ServerValue.TIMESTAMP,
        "updated_at": Firebase.ServerValue.TIMESTAMP
      }, 
        function() { 
          var newNoteString = newNoteRef.toString();
          newNotePath = newNoteString.substr(newNoteString.lastIndexOf('/') + 1);
          console.log(newNotePath);
          console.log('callback completed');          
          // setNewNoteKey(newNotePath)
        }
      );
      var newNoteKey = newNoteRef.toString().substr(newNoteRef.toString().lastIndexOf('/') + 1)
      // Set this new note as the active note, set it as true, and replace the code content with the note text.
      // console.log(newNoteCreatedRef);
      // this.bindAsObject(newNoteCreatedRef, "item");
      base.syncState('/notes/' + newNoteKey, {
        context: this,
        state: 'item',
        asArray: false
      });

      this.setState({
        code: "",
        activeNoteKey: newNoteKey
      });

      ;
      var userNotesRef = new Firebase("https://scrtchpd.firebaseio.com/users/" + this.state.authData.uid + "/notes");
      var newNoteUserRef = userNotesRef.child(newNoteKey).set(true);



      // Need to return this new note key, and set this.state.activeNoteKey with it. 
      // That is how UpdateNote gets it's location

      // this.bindAsObject(newNoteRef, "item");
      // this.setState({
      //   // code: "Write something! NEW NOTE",
      // });
      // this.unbind("item");

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
      // Create a new note object, with the first character typed. 
      var newNotePath;
      function setNewNoteKey(newNotePath){
        this.setState({
          code: this.state.code,
          activeNoteKey: newNotePath
        });
      }
      var newNoteRef = this.firebaseRefs.notes.push({
        "note": this.state.code,
        "created_at": Firebase.ServerValue.TIMESTAMP,
        "updated_at": Firebase.ServerValue.TIMESTAMP
      }, 
        function() { 
          var newNoteString = newNoteRef.toString();
          newNotePath = newNoteString.substr(newNoteString.lastIndexOf('/') + 1);
          console.log(newNotePath);
          console.log('callback completed');          
          // setNewNoteKey(newNotePath)
        }
      );
      
      // This binds as an object, which allows to be updated from FB.
      // This is only a one-way binding. Needs to be 2 way.

      // this.bindAsObject(newNoteRef, "item");
      base.syncState('/notes/' + newNoteRef.toString().substr(newNoteRef.toString().lastIndexOf('/') + 1), {
        context: this,
        state: 'item',
        asArray: false
      });
      console.log('newnote', newNoteRef.toString());
      this.setState({
        code: this.state.code,
        activeNoteKey: newNoteRef.toString().substr(newNoteRef.toString().lastIndexOf('/') + 1)
      });
      var newNoteKey = newNoteRef.key();
      var userNotesRef = new Firebase("https://scrtchpd.firebaseio.com/users/" + this.state.authData.uid + "/notes");
      var newNoteUserRef = userNotesRef.child(newNoteKey).set(true);
      /* var newNoteUserRef = userNotesRef.push({"user": true, "test3": false, "test4": "testing"}); */
      // this.unbind("emptyNote");
      // this.unbind("item");

  },
  expandSidebar: function(){
    this.setState({
      sidebarOpen: !this.state.sidebarOpen
    });
    ReactDOM.getInputDOMNode(this.refs.searchInput).focus(); 
  },
  testUpdate: function(){
    console.log('test update');
  },
  render: function() {
    
      var options = {
        lineNumbers: false,
        lineWrapping: true,
        autofocus: true,
        extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"},
        placeholder: "Write something...",
        mode: {
          name: "gfm",
          highlightFormatting: true
        }

      };
      var loginOrOut;
      var register;
      var emailAddress;
      if(this.state.authData){
        emailAddress = <li className="user-email sidebar-bottom-link">{this.state.authData.password.email}</li>;
        loginOrOut = <li className="logout-link sidebar-bottom-link"><Link to="logout" className="navbar-brand">Log out</Link></li>;
        register = null
      } else {
        loginOrOut = <li><Link to="login" className="navbar-brand">Log in</Link></li>;
        register = <li><Link to="register" className="navbar-brand"> Register </Link></li>;
      }
      var sidebarClass = classNames({
        'sidebar': true,
        'open': this.state.sidebarOpen
      });
      var created_at;
      var updated_at;
      if (this.state.item) {
        var created = moment(this.state.item.created_at).format('MMMM Do YYYY');
        created_at = <p>Created on: {created}</p>
        updated_at = <p>Last updated at: {this.state.item.updated_at}</p>
      }

      // <SearchBar searchHandler={this.searchHandler} query={this.state.query} doSearch={this.doSearch} focus={this.state.sidebarOpen ? focus : null} />
      return (
          <div>
            <div className="pad-container">
              <div className={sidebarClass}>
                <div className="sidebar-wrap">
                  
                  <div className="notes">
                    <NoteList noteKeys={this.state.filteredData ? this.state.filteredData : this.state.userNoteKeys} auth={this.state.authData} handleNoteAreaUpdate={this.placeClickedNote} activeNoteKey={this.state.activeNoteKey ? this.state.activeNoteKey : null} />
                  </div>
                </div>
                <div className="sidebar-bottom-links">
                  {register}
                  {emailAddress}
                  {loginOrOut}
                </div>
              </div>
              <div className="main-content-container">
                <div className="buttons">
                  <div className="menu-button main-button" onClick={this.expandSidebar}>
                    <span><img src="app/img/hamburger.svg" alt="Menu" /></span>
                  </div>
                  <div className="new-note-button main-button" onClick={this.placeNewNote}>
                    <img src="app/img/plus.svg" alt="Create a new note" />
                  </div>
                </div>
                
                <section className="writer">
                  <div className="note-dates">
                    {created_at}
                    
                  </div>
                  <Writer value={this.state.code} options={options} onChange={this.updateCode} testUpdate={this.testUpdate} />
                  <p className="character-count">{this.state.code.length} characters</p>
                </section>
              </div>
            </div>
          </div>
      );
  }
    
});

module.exports = Pad;