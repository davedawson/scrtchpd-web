var React = require('react');
var ReactDOM = require('react-dom');
var CSSTransitionGroup = require('react-addons-css-transition-group');

var SearchBar = require('./SearchBar.js');
var NoteList = require('./NoteList.js');
var Writer = require('./Writer.js');
var Router = require('react-router');
var Link = require('react-router').Link
var classNames = require('classnames');
var Pad = require('./Pad.js');
var LoginForm = require('./Login.js');
var RegisterForm = require('./Register.js');
var firebaseUtils = require('../utils/firebaseUtils');
var fuzzy = require('fuzzy');
var moment = require('moment');
var Rebase = require('re-base');
var Codemirror = require('react-codemirror');
var Modal = require('react-modal');
var Basic = require('./Basic.js');
var LoggedOutSidebar = require('./LoggedOutSidebar.js');
var key = require('keymaster');
var firebaseRef;
var activeNoteRef;
var authData;
var usersNotes = [];
var base;
var item;
var usersNotesListTest = new Object();
// User specific notes
var usersNotesKeys = []
var usersNotesList = []
    // require('../../node_modules/codemirror/mode/markdown/markdown.js')
    // require('../../node_modules/codemirror/mode/gfm/gfm.js');
    // require('../../node_modules/codemirror/addon/display/placeholder.js');
key.filter = function(event){
  var tagName = (event.target || event.srcElement).tagName;
  key.setScope(/^(INPUT|TEXTAREA|SELECT)$/.test(tagName) ? 'input' : 'other');
  return true;
}
const customStyles = {

  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(0,0,0, 0.88)'
  },
  content : {
    position                   : 'absolute',
    top                        : '40px',
    left                       : '40px',
    right                      : '40px',
    bottom                     : '40px',
    border                     : 'none',
    background                 : 'transparent',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '0',
    outline                    : 'none',
    padding                    : '20px'
 
  }

};
var Wrapper = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      // code: null,
      counter: 0,
      query:'',
      // notes: [],
      // item: new Object(),
      // listItems: [],
      userNoteKeys: [],
      // usersNotesList: new Object(),
      codePlaceholder: "Write something!",
      emptyNote: true,
      sidebarOpen: true,
      modalIsOpen: false,
      writerFocused: true
      // authData: null
    };
  },
  
  componentWillMount: function() {
    firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/");
    base = Rebase.createClass('https://scrtchpd.firebaseio.com/');
    // All notes
    // I think we can do without this:
    // var allNotesRef = firebaseRef.child("/notes/").limitToLast(15);
    // this.bindAsArray(allNotesRef, "notes");
    authData = firebaseRef.getAuth();
    console.log('data', authData);
    if (authData) {
      this.setState({
        authData: authData
      });  

      // Grab the user's notes keys and loop through them
      // var ref = firebaseRef.child('users/' + authData.uid + '/notes');
      // var query = ref.orderByChild('date_updated');
      // this.bindAsArray(query, 'userNoteKeys');  
      this.findUserNotesAndLoop(authData.uid);
    } else {
      this.setState({
        sidebarOpen: true
      });
    }
  },

  componentDidMount: function() {
    // key('a', function(){ alert('you pressed a!') });
    console.log('modal' + this.state.modalIsOpen);
    key('⌘+f, ctrl+f', this.openModal.bind(this));
    key.filter = function(event){
        var tagName = (event.target || event.srcElement).tagName;
        key.setScope(/^(INPUT|TEXTAREA|SELECT)$/.test(tagName) ? 'input' : 'other');
        return true;
    }
  },

  componentWillUnmount: function() {
    this.unbind("userNoteKeys");
    base.removeBinding(allNotesRef);
    base.removeBinding(query);
  },

  findUserNotesAndLoop: function(uid) {
    // Grab the user's notes keys and loop through them
    var ref = firebaseRef.child('users/' + uid + '/notes');
    var query = ref.orderByChild('date_updated');
    this.bindAsArray(query, 'userNoteKeys');  
  },

  openModal: function() {
    this.setState({modalIsOpen: true});
    document.getElementById('search-notes-field').focus();
  },
 
  closeModal: function() {
    
    // setTimeout(function(){
      this.setState({modalIsOpen: false});
    // }.bind(this),500);
    
  },
  
  expandSidebar: function(){
    this.setState({
      sidebarOpen: !this.state.sidebarOpen
    });
    // ReactDOM.getInputDOMNode(this.refs.searchInput).focus(); 
  },

  logInUser: function(){
    // firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/");
    authData = firebaseRef.getAuth();
    console.log(authData);
    if (authData) {
      this.setState({
        authData: authData
      });  
      this.findUserNotesAndLoop(authData.uid);
    }
  },
  logOutUser: function(){
    console.log('log out');
    // Log a user out, and clear user info from state
    firebaseUtils.logout()
    this.unbind("userNoteKeys");
    // base.removeBinding(activeNoteRef);
    // base.removeBinding(item);
    // this.setState({
    //   authData: null,
    //   code: null,
    //   item: null,
    //   userNoteKeys: [],
    // });
    this.replaceState(this.getInitialState())
    
    // base.removeBinding(query);
  },
  createNewNote: function(item){
    // TODO: This should be combined with this.placeNewNote. This function creates a new note once the 
    // user starts typing in an empty note (like when they first load the app). And this.placeNewNote
    // creates a new note when the New Note button is clicked.
    console.log('Creating a new note');
      // Create a new note object, with the first character typed. 
      var newNotePath;
      function setNewNoteKey(newNotePath){
        this.setState({
          code: this.state.code,
          activeNoteKey: newNotePath
        });
      }
      var newNoteRef = firebaseRef.child('notes').push({
        "note": this.state.code,
        "created_at": Firebase.ServerValue.TIMESTAMP,
        "updated_at": Firebase.ServerValue.TIMESTAMP,
        "user_id": this.state.authData.uid
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
        activeNoteKey: newNoteRef.toString().substr(newNoteRef.toString().lastIndexOf('/') + 1),
        emptyNote: false
      });
      var newNoteKey = newNoteRef.key();
      var userNotesRef = new Firebase("https://scrtchpd.firebaseio.com/users/" + this.state.authData.uid + "/notes");
      var newNoteUserRef = userNotesRef.child(newNoteKey).set(true);
      /* var newNoteUserRef = userNotesRef.push({"user": true, "test3": false, "test4": "testing"}); */
      // this.unbind("emptyNote");
      // this.unbind("item");

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
      activeNoteKey: clickedNoteKey, 
      writerFocused: true,
      emptyNote: false
    });
  },

  updateCode: function(newCode) {
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
      console.log('Updating existing note');
      var noteData = this.state.item;
      noteData.note = newCode;
      this.setState({
        item: noteData
      });
    }
    if (this.state.code != "Write something"){ 
      /* On update, set the state of Codemirror to the newly typed text. Also save the new text to Firebase */      
    }
  },

  placeNewNote: function(){
    var newNotePath;
    
    console.log('New Note, creating now');
    console.log(firebaseRef.child('notes'));
      var newNoteRef = firebaseRef.child('notes').push({
        "note": this.state.code,
        "created_at": Firebase.ServerValue.TIMESTAMP,
        "updated_at": Firebase.ServerValue.TIMESTAMP,
        "user_id": this.state.authData.uid
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
      item = base.syncState('/notes/' + newNoteKey, {
        context: this,
        state: 'item',
        asArray: false
      });

      this.setState({
        code: "",
        activeNoteKey: newNoteKey,
        writerFocused: true
      });
      var userNotesRef = new Firebase("https://scrtchpd.firebaseio.com/users/" + this.state.authData.uid + "/notes");
      var newNoteUserRef = userNotesRef.child(newNoteKey).set(true);
  },
  onFocusChange: function(focused){
    console.log('focus change from Writer.js');
    this.setState({
      writerFocused: focused
    });

    // If the active note is empty when unfocused, remove it. This prevents a long list of empty notes.
    // Need to get key from the note that was just active, we want to remove that note, not the newly activated note.
    console.log(this.state.code);
    if (this.state.code === ""){
      // var note = firebaseRef.child('/notes/' + this.state.activeNoteKey);
      // var userNoteKey = firebaseRef.child('users/' + this.state.authData.uid + '/notes/' + this.state.activeNoteKey)
      // console.log(note.toString());
      // console.log(userNoteKey.toString());
      // note.remove(onComplete);
      // userNoteKey.remove(onComplete);
    } else {
      // var note = firebaseRef.child('/notes/' + this.state.activeNoteKey);
      // var userNoteKey = firebaseRef.child('users/' + this.state.auth.uid + '/notes/' + this.state.activeNoteKey)
      // console.log(note.toString());
      // console.log(userNoteKey.toString());
      // note.remove(onComplete);
      // userNoteKey.remove(onComplete);
    }
  },
  removeDeletedNoteDataFromPad: function(noteKeyToDelete){
    console.log(noteKeyToDelete, 'testing clear note pad');
    if (noteKeyToDelete == this.state.activeNoteKey) {
      this.setState({
        code: "",
        activeNoteKey: null,
        item: null,
        emptyNote: true
      })
    }
  },
  changeWriterFocus: function(state){
    console.log('focus', state);
    this.setState({
      writerFocused: state
    })
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
        // loginOrOut = <li className="logout-link sidebar-bottom-link"><Link to="logout" className="navbar-brand">Log out</Link></li>;
        loginOrOut = <li className="logout-link sidebar-bottom-link"><p className="navbar-brand" onClick={this.logOutUser}>Log out</p></li>;
        register = null
        var sidebarBottomLinks = <div className="sidebar-bottom-links">{emailAddress} {loginOrOut}</div>
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
      var LoggedIn = authData;
      var pad;
      var sidebar;
      var newNoteButton;
      var loginForm;
      var registerForm;

      if(!this.state.emptyNote){
        newNoteButton = <div className="new-note-button main-button" onClick={this.placeNewNote}>
                    <img src="app/img/plus.svg" alt="Create a new note" />
                  </div>;
      }
      // <SearchBar searchHandler={this.searchHandler} query={this.state.query} doSearch={this.doSearch} focus={this.state.sidebarOpen ? focus : null} />
      if (this.state.authData) {
        console.log('logged in'); 
        // One pad component. If logged in, send option for user info, else send option for local storage.
        pad = <Pad refs="pad" localStorage={false} code={this.state.code} updateCode={this.updateCode} writerFocused={this.state.writerFocused} onFocusChange={this.onFocusChange} focusWriter={this.focusWriter} />;
        sidebar = <div className="notes">
                    <NoteList noteKeys={this.state.filteredData ? this.state.filteredData : this.state.userNoteKeys} auth={this.state.authData} handleNoteAreaUpdate={this.placeClickedNote} activeNoteKey={this.state.activeNoteKey ? this.state.activeNoteKey : null} noteList={this.state.notes} removeDeletedNoteDataFromPad={this.removeDeletedNoteDataFromPad}  />
                  </div>;
      } else {

        sidebar = <LoggedOutSidebar logInUser={this.logInUser} />;
        // <div><LoginForm logInUser={this.logInUser} /> <RegisterForm logInUser={this.logInUser} /></div>
        pad = <Pad refs="pad" localStorage={true} writerFocused={this.state.writerFocused} updateCode={this.updateCode} onFocusChange={this.onFocusChange} focusWriter={this.focusWriter} />;
      }
      // if(this.state.uid) {
        return (
          <div>
            <Modal 
            className="search-modal"
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles} >
              <div className="modal-search-wrap">
                <Basic noteList={this.state.notes} placeClickedNote={this.placeClickedNote} closeModal={this.closeModal} />
              </div>
          </Modal>
            <div className="pad-container">
              <div className={sidebarClass}>
                <div className="sidebar-wrap">
                  {sidebar}
                </div>
                {sidebarBottomLinks}
              </div>
              <div className="main-content-container">
                <div className="buttons">
                  <div className="menu-button main-button" onClick={this.expandSidebar}>
                    <span><img src="app/img/hamburger.svg" alt="Menu" /></span>
                  </div>
                  {newNoteButton}
                </div>
                
                <section className="writer">
                  <div className="note-dates">
                    {created_at}
                    
                  </div>
                  {pad}
                  
                </section>
              </div>
            </div>
          </div>
        );
      // } else {
        return (
          <div>
            <UnauthenticatedSidebar />
          </div>
        )
      // }
      
  }
    
});

module.exports = Wrapper;