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
    // base.bindToState('notes/' + this.props.noteKey['.key'], {
    //   context: this,
    //   state: 'note',
    //   asArray: true
    // });
    base.listenTo('notes/' + this.props.noteKey['.key'], {
      context: this,
      asArray: false,
      then(noteData){
        this.setState({
          note: noteData.note,
          updated_at: noteData.updated_at
        })
      }
    });

    console.log(this.props.noteKey['.key']);
  },
	activateNote: function(item) { 
    /* This takes the clicked note, and displays it's full content in the main text window */
    // console.log('full note:' + item);
    // this.props.updateNoteArea(item, this.state.usersNotesList);
    this.setState({
      isActive: true
    })
    this.props.onClickedNote(this.state.note, this.props.noteKey['.key']);
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
    var note = firebaseRef.child('/notes/' + this.props.noteKey['.key']);
    var userNoteKey = firebaseRef.child('users/' + this.props.auth.uid + '/notes/' + this.props.noteKey['.key'])
    // console.log(note.toString());
    // console.log(userNoteKey.toString());
    note.remove(onComplete);
    userNoteKey.remove(onComplete);
  },
	render: function() {
		/* Take the full note and cut it down to 50 characters */
		
		return (
			<li onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} onClick={this.activateNote}>
        
      <p><strong><TimeAgo date={this.state.updated_at} /></strong>{this.state.note}</p>
        { this.state.isHovering ? <a className="delete-link" onClick={this.handleDeleteNote}>delete</a> : null }
      </li>
		)
	}
});

module.exports = Note;