var React = require('react');
var firebaseUtils = require('../utils/firebaseUtils');
var Pad = require('./Pad.js');
var SearchBar = require('./SearchBar.js');
var NoteList = require('./NoteList.js');
var Router = require('react-router');
var Link = require('react-router').Link
var fbutil = require('firebase-util');

var fuzzy = require('fuzzy');
var Codemirror = require('react-codemirror');
    // require('../../node_modules/codemirror/mode/markdown/markdown.js')
    // require('../../node_modules/codemirror/mode/gfm/gfm.js');
    // require('../../node_modules/codemirror/addon/display/placeholder.js');

var App = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      loggedIn: firebaseUtils.isLoggedIn()
    }
  },

  handleLogout: function(loggedIn){
    this.setState({
      loggedIn: loggedIn
    });
  },

  componentWillMount: function() {
    firebaseUtils.onChange = this.handleLogout;
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
      var loginOrOut;
      var register;
      if(this.state.loggedIn){
        loginOrOut = <li><Link to="logout" className="navbar-brand">Logout</Link></li>;
        register = null
      } else {
        loginOrOut = <li><Link to="login" className="navbar-brand">Login</Link></li>;
        register = <li><Link to="register" className="navbar-brand"> Register </Link></li>;
      }
      return (
          <div>
            <li><Link to="/">Home</Link></li>
            
            {register}
            
            {loginOrOut}
            {this.props.children}
          </div>
      );
  }
    
});

module.exports = App;