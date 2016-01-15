var React = require('react');
var TimeAgo = require('react-timeago');
var classNames = require('classnames');
var Rebase = require('re-base');
var firebaseRef;
var base;
var Note = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function(){
    return {
      isHovering: ''
    }
  },
  componentWillMount: function() {
    firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/");
    // var ref = firebaseRef.child('notes/' + this.props.noteKey['.key']);
    // this.bindAsArray(ref, 'key'); 
    base = Rebase.createClass('https://scrtchpd.firebaseio.com/');
    base.syncState('notes/' + this.props.noteKey['.key'], {
      context: this,
      state: 'key',
      asArray: true,
    });
    console.log(this.props.noteKey['.key']);
  },
	activateNote: function(item) { 
    /* This takes the clicked note, and displays it's full content in the main text window */
    console.log('full note:' + item);
    // this.props.updateNoteArea(item, this.state.usersNotesList);
    this.setState({
      isActive: true
    })
  },
    // GOOD: set this.state.isHovering to true on mouse over
  handleMouseOver: function() {
    this.setState({ isHovering: true });
  },

  // GOOD: set this.state.isHovering to false on mouse leave
  handleMouseOut: function() {
    this.setState({ isHovering: false });
  },

  // GOOD: toggle this.state.isActive on click
  handleClick: function() {
    var active = !this.state.isActive;
    this.setState({ isActive: active });
  },
  handleDeleteNote: function(item) {
    var onComplete = function(error) {
      if (error) {
        console.log('Synchronization failed');
      } else {
        console.log('Synchronization succeeded');
      }
    };
    firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/");
    console.log('delete', item);
    note = firebaseRef.child('/notes/' + item.key);
    userNoteKey = firebaseRef.child('users/' + this.props.auth.uid + '/notes/' + item.key)
    console.log(note.toString());
    console.log(userNoteKey.toString());
    note.remove(onComplete);
    userNoteKey.remove(onComplete);
  },
	render: function() {
		/* Take the full note and cut it down to 50 characters */
		
		return (
			<li onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        {this.state.key}
        
      </li>
		)
	}
});

module.exports = Note;