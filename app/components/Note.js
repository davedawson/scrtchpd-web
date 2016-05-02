var React = require('react');
var TimeAgo = require('react-timeago');
var classNames = require('classnames');
var Rebase = require('re-base');
var moment = require('moment');
var firebaseRef;
var base;
var LazyLoad = require('react-lazyload');

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

    // console.log(this.props.noteKey['.key']);
  },
	activateNote: function(item) { 
    /* This takes the clicked note, and displays it's full content in the main text window */
    // console.log('full note:' + item);
    // this.props.updateNoteArea(item, this.state.usersNotesList);
    this.props.onClickedNote(this.state.note, this.props.noteKey['.key']);
    // Reset active tabs, then set this to active
    // this.setState({
    //   isActive: true
    // })
    
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
    // Add a confirm dialog
    if (confirm('Are you sure you want to permanently delete this note?')) { 
      firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/");
      console.log('delete', item);
      var note = firebaseRef.child('/notes/' + this.props.noteKey['.key']);
      var userNoteKey = firebaseRef.child('users/' + this.props.auth.uid + '/notes/' + this.props.noteKey['.key'])
      // console.log(note.toString());
      // console.log(userNoteKey.toString());
      note.remove(onComplete);
      userNoteKey.remove(onComplete);
      this.props.removeFromList(this.props.noteKey['.key']);
    }

    
  },
	render: function() {
		/* Take the full note and cut it down to 50 characters */
		var deleteClass = classNames({
      'delete-link': true,
      'exposed': this.state.isHovering
    });
    var activeClass = classNames({
      'note': true,
      'active-note': this.props.activeNote,
    });
    var date = moment(this.state.updated_at).endOf('day').fromNow();

		return (
        <li className={activeClass} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
    			<div onClick={this.activateNote}>
            <p><strong>{this.state.updated_at}</strong><span className="note-preview">{this.state.note}</span></p>
          </div>
          <a className={deleteClass} onClick={this.handleDeleteNote}><span className="vertical-text">delete</span></a>
        </li>
		)
	}
});

module.exports = Note;