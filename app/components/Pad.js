var React = require('react');
var ReactDOM = require('react-dom');
var CSSTransitionGroup = require('react-addons-css-transition-group');

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
var LocalStorageMixin = require('react-localstorage');

var firebaseRef;
var activeNoteRef;
var authData;
var usersNotes = [];
var base;
    // require('../../node_modules/codemirror/mode/markdown/markdown.js')
    // require('../../node_modules/codemirror/mode/gfm/gfm.js');
    // require('../../node_modules/codemirror/addon/display/placeholder.js');

var Pad = React.createClass({
  mixins: [LocalStorageMixin],
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
      sidebarOpen: false,
      code: "",
      placeholder: "Write something..."
    };
  },
  
  componentWillMount: function() {
    console.log(this.props.localStorage);
    if (this.props.localStorage == false){
      console.log('logged in');
      firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/");
      base = Rebase.createClass('https://scrtchpd.firebaseio.com/');

      // All notes
      authData = firebaseRef.getAuth();
      var userNotesRef = firebaseRef.child("/users/" + authData.uid + "/notes").limitToLast(15);
      // this.bindAsArray(userNotesRef, "userNotes");
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
      // this.bindAsArray(query, 'userNoteKeys');  
    } else {
      console.log('logged out');
      this.setState({
        placeholder: "Write something, even though you're not logged in."
      })      
    }
  },
  componentWillReceiveProps: function(){
    if (this.props.writerFocused == true) {
      console.log('focused');
      this.refs['pad-writer'].focus();
    }
  },
  focusWriter: function(){
    this.refs['pad-writer'].focus();
  },
  updateCode: function(newCode) {
    this.props.updateCode(newCode);
  },
  onFocusChange: function(focused){
    this.props.onFocusChange(focused);
    console.log('focus change from Pad.js');
  },
  render: function() {
      
      var options = {
        lineNumbers: false,
        lineWrapping: true,
        autofocus: true,
        extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"},
        placeholder: this.state.placeholder,
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
        return (
          <div>
          <p onClick={this.focusWriter}>Focus!</p>
            <div className="main-content-container">
              <section className="writer">
                <div className="note-dates">
                  {created_at}
                </div>
                <Writer ref="pad-writer" value={this.props.code} options={options} onChange={this.updateCode} testUpdate={this.testUpdate} placeholder={this.state.placeholder} focused={this.props.writerFocused} onFocusChange={this.onFocusChange} focus={this.props.focused}/>
                <p className="character-count">{this.state.code.length} characters</p>
              </section>
            </div>
          </div>
        );

      
  }
    
});

module.exports = Pad;