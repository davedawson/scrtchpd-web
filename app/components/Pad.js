var React = require('react');
var ReactDOM = require('react-dom');
var SearchBar = require('./SearchBar.js');
var NoteList = require('./NoteList.js');
var Router = require('react-router');
var Link = require('react-router').Link
var classNames = require('classnames');

var fuzzy = require('fuzzy');
var Rebase = require('re-base');
var Codemirror = require('react-codemirror');
var firebaseRef;
var activeNoteRef;
var base;
    // require('../../node_modules/codemirror/mode/markdown/markdown.js')
    // require('../../node_modules/codemirror/mode/gfm/gfm.js');
    // require('../../node_modules/codemirror/addon/display/placeholder.js');

var Pad = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {

    return {
      code: "Write something",
      counter: 0,
      query:'',
      notes: [],
      listItems: [],
      userNotesTest: [],
      userNotesKeys: [],
      userNoteKeys: [],
      usersNotesList: new Object(),
      codePlaceholder: "Write something!",
      sidebarOpen: true
    };
  },

  componentWillMount: function() {
    firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/");
    base = Rebase.createClass('https://scrtchpd.firebaseio.com/');
    // All notes
    var allNotesRef = firebaseRef.child("/notes/").limitToLast(15);
    this.bindAsArray(allNotesRef, "notes");
    var authData = firebaseRef.getAuth();
    var userNotesRef = firebaseRef.child("/users/" + authData.uid + "/notes").limitToLast(15);
    /* var userNotesRef = new Firebase("https://scrtchpd.firebaseio.com/users/" + authData.uid + "/notes"); */
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
    var userNotesTest = []
    var allNotesTest = []
    this.setState({
      usersNotesListTest: []
    })
    // Grab the user's notes keys and loop through them

    // base.syncState('notes/', {
    //   context: this,
    //   asArray: true,
    //   then(notesData){
    //     notesData.forEach((note) => {
    //       console.log(note);
    //     });

    //     // this.setState({total});
    //   }
    // });]
    // base.syncState('users/' + authData.uid + '/notes', {
    //   context: this,
    //   state: 'userNoteKeys',
    //   asArray: true,
    // });
    var ref = firebaseRef.child('users/' + authData.uid + '/notes');
    var query = ref.orderByChild('date_updated');
    this.bindAsArray(query, 'userNoteKeys'); 

    // firebaseRef.child('notes').orderByChild('date_updated').on("child_added", function(noteSnapshot) {
    //   allNotesTest.push(noteSnapshot);
    //   console.log(allNotesTest);
    // });
    // this.setState({
    //   allNotesTest: allNotesTest
    // });
    // firebaseRef.child('users/' + authData.uid + '/notes').orderByChild('date_updated').on("child_added", function(noteKeySnapshot) {
    //     // var ref = firebaseRef.child('notes/' + noteKeySnapshot.key());
    //     // this.bindAsObject(ref, noteKeySnapshot.key()); 
    //     var ref = firebaseRef.child('users/' + authData.uid + '/notes');
    //     var query = ref.orderByChild('date_updated');
    //     this.bindAsArray(query, "notes");

    // }.bind(this)); 
    firebaseRef.child('users/' + authData.uid + '/notes').orderByChild('date_updated').on("child_added", function(noteKeySnapshot) {
      // console.log(noteKeySnapshot.key());
      // Take each key and add it to an array  - TODO: I think this is unnecessary, but is helpful to have for testing. Remove. 
      // var notesRefTest = this.state.userNotesTest;
      // base.listenTo('notes/' + noteKeySnapshot.key(), {
      //   context: this,
      //   state: noteKeySnapshot.key(),
      //   asArray: false,
      //   then: function(notesData) {
      //     // usersNotesList.push(keyObject);
      //     console.log(notesData);
      //     usersNotesList.push(notesData);
      //   }
      // });
      // this.setState({
      //   usersNotesList: usersNotesList
      // });


      // ref = firebaseRef.child('notes/' + noteKeySnapshot.key());
      // For each note key, go and fetch the Note record with the same key
      // var noteObject = this.bindAsObject(ref, noteKeySnapshot.key()); 
      // addToItemList(noteObject);

      // usersNotesList.push(keyObject);
      // this.setState({
      //   usersNotesList: usersNotesList
      // });

      // base.syncState('notes/' + noteKeySnapshot.key(), {
      //   context: this,
      //   state: noteKeySnapshot.key(),
      //   asArray: false,
      //   then(notesData){
      //     userNotesTest.push(notesData);
      //     // this.setState({total});
      //   }
      // });
      // this.setState({
      //   userNotesTest: userNotesTest
      // });

      // Original way of doing thing. Not working well: 
      
      usersNotesKeys.push(noteKeySnapshot.key());
      // For each note key, go and fetch the Note record with the same key
      // this.bindAsObject(ref, noteKeySnapshot.key()); 
      firebaseRef.child('notes/' + noteKeySnapshot.key()).once("value", function(noteSnapshot) {
        // Add that full note object to an array + the parent key
        var data = noteSnapshot.val();
        usersNotesList.push({
            'created_at': data.created_at, 
            'updated_at': data.updated_at,
            'note':       data.note,
            'key':        noteKeySnapshot.key()
        });
      });

      this.setState({
        listItems: usersNotesKeys,
        usersNotesList: usersNotesList
      });
    
      
    }.bind(this));    
    

/*    firebaseRef.child('users/' + authData.uid + '/notes').on('child_changed', function(noteKeySnapshot, prevChildKey) {
    // code to handle child data changes.
      console.log('something changed!');
      console.log(noteKeySnapshot.key().toString());
      // Look through the current note list and find the matching key and update that key with the new content.
      // if this.usersNotesList[i]  
      console.log(noteSnapshot);
      firebaseRef.child('notes/' + noteKeySnapshot.key()).once("value", function(noteSnapshot) {
        // console.log(noteSnapshot.val());
        // Add that full note object to an array
        // IMPORTANT: This needs to UPDATE an entry in the array, does Push do that? Or is there 
        // a different function for that?
        // usersNotesList.push(noteSnapshot.val());
        for (var i in noteSnapshot) {
           if (projects[i].data.note == "Write somethi21ng") {
              console.log('found it')
              break; //Stop this loop, we found it!
           }
         }
      });
    });
*/

    this.setState({
      listItems: usersNotesKeys,
      usersNotesList: usersNotesList
    });

    // base.syncState('notes', {
    //   context: this,
    //   state: 'notesTEst',
    //   asArray: true
    // });



  },

  componentDidMount: function() {
    // console.log(this.state.listItems);
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
    var list2 = this.state.usersNotesList;
    var results = fuzzy.filter(queryText, list2, options)
    // console.log(results);
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
      // var firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/notes");
      /* Why does this only work if defined above? Shouldn't it pull in vars from other functions? */
      var testRef = firebaseRef.child('/notes/' + this.state.activeNoteKey); 
      /* This code sets the text of Codemirror */
      testRef.update({
        "note": this.state.code,
        "updated_at": Firebase.ServerValue.TIMESTAMP
      });

      // var noteKey = this.state.item['key']
      // userNoteKey = firebaseRef.child('users/' + this.state.authData.uid + '/' + this.state.item['.key']);
      // userNoteKey.update({
      //   noteKey : false
      // });
      // console.log(userNoteKey.toString());
      // console.log(testRef);
      console.log('Updating existing note');

      // firebaseRef.child('notes/' + this.state.item['key']).on('value', function(noteSnapshot, prevChildKey) {
      // // code to handle child data changes.
      //   // Look through the current note list and find the matching key and update that key with the new content.

      //   var data = noteSnapshot.val();
      //   updatedItem = {
      //       'created_at': data.created_at, 
      //       'updated_at': data.updated_at,
      //       'note':       data.note,
      //       'key':        noteSnapshot.key()
      //       };
      //       // console.log(updatedItem);
      //   this.setState({
      //     item: updatedItem
      //   });
      // }.bind(this));
    }
    if (this.state.code != "Write something"){ 
      /* On update, set the state of Codemirror to the newly typed text. Also save the new text to Firebase */
      
      
    }
    
  },
  handleNoteAreaUpdate: function(clickedNote, clickedNoteKey){
    /* This takes the actived note, and sets the state of Codemirror that that note's full text. */
    // console.log(clickedNote, clickedNoteKey);
    
    // this.setState({
    //   // item2: clickedNote['.key'],
    //   // NOTE: Not sure why this is spitting out an error. Doesn't seem to actually cause any issues. TODO.
    //   // item: clickedNote,
    //   code: clickedNote[1]
    // });
    
  // this.updatedCode(clickedNote);
  },
  placeClickedNote: function(clickedNote, clickedNoteKey) {
    // If there's already an active note, remove the binding before creating a new one. 
    if (activeNoteRef){
      base.removeBinding(activeNoteRef);  
    }
    
    console.log(clickedNoteKey);
    activeNoteRef = base.syncState('notes/' + clickedNoteKey, {
      context: this,
      state: 'item',
      asArray: true,
    });
    this.setState({
      code: clickedNote[1],
      activeNoteKey: clickedNoteKey
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
      var newNoteKey = newNoteRef.key();
      var userNotesRef = new Firebase("https://scrtchpd.firebaseio.com/users/" + this.state.authData.uid + "/notes");
      var newNoteUserRef = userNotesRef.child(newNoteKey).set(true);
      /* var newNoteUserRef = userNotesRef.push({"user": true, "test3": false, "test4": "testing"}); */
      this.unbind("emptyNote");
      this.unbind("item");

  },
  expandSidebar: function(){
    this.setState({
      sidebarOpen: !this.state.sidebarOpen
    });
    ReactDOM.getInputDOMNode(this.refs.searchInput).focus(); 
  },
  render: function() {
    console.log(this.state.listItems);
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
      var loginOrOut;
      var register;
      if(this.state.authData){
        loginOrOut = <li><Link to="logout" className="navbar-brand">Logout</Link></li>;
        register = null
      } else {
        loginOrOut = <li><Link to="login" className="navbar-brand">Login</Link></li>;
        register = <li><Link to="register" className="navbar-brand"> Register </Link></li>;
      }
      var sidebarClass = classNames({
        'sidebar': true,
        'open': this.state.sidebarOpen
      });
      return (
          <div>
            <div className="buttons">
              <div className="menu-button main-button" onClick={this.expandSidebar}>
                Menu
              </div>
              <div className="new-note-button main-button" onClick={this.placeNewNote}>
                New note
              </div>
            </div>
            <div className="pad-container">
              <div className={sidebarClass}>

                  <SearchBar searchHandler={this.searchHandler} query={this.state.query} doSearch={this.doSearch} focus={this.state.sidebarOpen ? focus : null} />
                  <div className="notes">
                    <NoteList notes={this.state.filteredData ? this.state.filteredData : this.state.usersNotesList} noteKeys={this.state.userNoteKeys} results={this.state.results} updateNoteArea={this.handleNoteAreaUpdate} onChange={this.onUpdate} userNotes={this.state.userNotes} auth={this.state.authData} handleNoteAreaUpdate={this.placeClickedNote} />
                  </div>
                  {register}
                  {loginOrOut}
                  <li><Link to="pad">Pad</Link></li>
                </div>
              
              <section className="writer">
                <Codemirror value={this.state.code} options={options} onChange={this.updateCode} placeholder="testing placeholder" />
                <li className="character-count"><span onClick={this.onClick}></span></li>
                <li className="clear"><a className="call-modal" onClick={this.clearText}><span>&times;</span></a></li>
              </section>
              </div>
          </div>
      );
  }
    
});

module.exports = Pad;