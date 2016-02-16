var React = require('react');
var ReactDOM = require('react-dom');
var CSSTransitionGroup = require('react-addons-css-transition-group');

var SearchBar = require('./SearchBar.js');
var NoteList = require('./NoteList.js');
var Writer = require('./Writer.js');
var Router = require('react-router');
var Link = require('react-router').Link
var classNames = require('classnames');
var UnauthenticatedSidebar = require('./UnauthenticatedSidebar.js');
var RegisteredPad = require('./RegisteredPad.js');
var LoginForm = require('./Login.js');

var fuzzy = require('fuzzy');
var moment = require('moment');
var Rebase = require('re-base');
var Codemirror = require('react-codemirror');
var firebaseRef;
var activeNoteRef;
var authData;
var usersNotes = [];
var base;
var usersNotesListTest = new Object();
// User specific notes
var usersNotesKeys = []
var usersNotesList = []
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
    };
  },
  
  componentWillMount: function() {
    firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/");
    base = Rebase.createClass('https://scrtchpd.firebaseio.com/');
    // All notes
    var allNotesRef = firebaseRef.child("/notes/").limitToLast(15);
    this.bindAsArray(allNotesRef, "notes");
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

  findUserNotesAndLoop: function(uid) {
    // Grab the user's notes keys and loop through them
    var ref = firebaseRef.child('users/' + uid + '/notes');
    var query = ref.orderByChild('date_updated');
    this.bindAsArray(query, 'userNoteKeys');  
  },
  expandSidebar: function(){
    this.setState({
      sidebarOpen: !this.state.sidebarOpen
    });
    // ReactDOM.getInputDOMNode(this.refs.searchInput).focus(); 
  },

  logInUser: function(){
    firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/");
    authData = firebaseRef.getAuth();
    if (authData) {
      this.setState({
        authData: authData
      });  
      this.findUserNotesAndLoop(authData.uid);
    }
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
      var LoggedIn = authData;
      var pad;
      var sidebar;
      // <SearchBar searchHandler={this.searchHandler} query={this.state.query} doSearch={this.doSearch} focus={this.state.sidebarOpen ? focus : null} />
      if (LoggedIn) {
        console.log('logged in'); 
        // One pad component. If logged in, send option for user info, else send option for local storage.
        pad = <RegisteredPad />;
        sidebar = <div className="notes">
                    <NoteList noteKeys={this.state.filteredData ? this.state.filteredData : this.state.userNoteKeys} auth={this.state.authData} handleNoteAreaUpdate={this.placeClickedNote} activeNoteKey={this.state.activeNoteKey ? this.state.activeNoteKey : null} />
                  </div>;
      } else {
        sidebar = <LoginForm logInUser={this.logInUser} />;
        console.log('not logged in');
        pad = <RegisteredPad localStorage={true} />;
      }
      // if(this.state.uid) {
        return (
          <div>
            <div className="pad-container">
              <div className={sidebarClass}>
                <div className="sidebar-wrap">
                  {sidebar}
                  
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

module.exports = Pad;