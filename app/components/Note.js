var React = require('react');
var TimeAgo = require('react-timeago');
var classNames = require('classnames');
var Note = React.createClass({
  getInitialState: function(){
    return {
      isHovering: ''
    }
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
		var note = this.props.noteData.note.substring(0,50);
		return (
			<li onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        <p onClick={this.activateNote.bind(this, this.props.noteData)} key={this.props.noteDigit}><strong><TimeAgo date={this.props.noteData.updated_at} /></strong>{note} {this.props.noteData['.key']}</p>
        { this.state.isHovering ? <a className="delete-link" onClick={this.handleDeleteNote.bind(this, this.props.noteData)}>delete</a> : null }
        
      </li>
		)
	}
});

module.exports = Note;