var React = require('react');
var CSSTransitionGroup = require('react-addons-css-transition-group');

var TimeAgo = require('react-timeago');
var Rebase = require('re-base');
var classNames = require('classnames');
var Note = require('./Note.js');
var Basic = require('./Basic.js');

var NoteList = React.createClass({
  /* This compenent contains the list of individual notes */
  
  getInitialState: function(){
    return {
      activeNote: this.props.activeNoteKey
    };
  },
  componentDidMount: function() {
    
  },
  componentDidUpdate: function() {
    // if (this.props.activeNoteKey) {
    //   this.setActiveNoteKey(this.props.activeNoteKey);
    //   // console.log(this.props.activeNoteKey);
    // }
  },
  setActiveNoteKey: function(){
    // console.log(this.props.activeNoteKey);
    // this.setState({
    //   activeNote: this.props.activeNoteKey
    // });
  },
  onClickedNote: function(item, noteKey){
    // console.log(item);
    this.props.handleNoteAreaUpdate(item, noteKey);

    this.setState({
      activeNote: noteKey
    });
    // Reset all tabs
  },
  activateNote: function(item) { 
    /* This takes the clicked note, and displays it's full content in the main text window */
    console.log('full note:' + item.toString());
    // this.props.updateNoteArea(item);
    // this.setState({
    //   isActive: true
    // })
  },
  removeFromList: function(noteKeyToDelete) {
    console.log(noteKeyToDelete);

  },  
  
  render: function() {    
    return (
      <div>
        <Basic />
        <CSSTransitionGroup 
          className="notes-list" 
          component="ul" 
          transitionName="order" 
          transitionEnterTimeout={300} 
          transitionLeaveTimeout={300}
        >      
          {this.props.noteKeys.map(function(item, i) {   
            if (this.props.activeNoteKey == item['.key']) {
               var activeNote = true;
            }       
            // console.log('activeNote', activeNote);
            var btnClass = classNames({
              'btn': true,
              'btn-pressed': this.state.isPressed,
              'btn-over': !this.state.isPressed && this.state.isHovered,
              'active-note': activeNote
            });
            // console.log(item);
            return (
              <Note noteKey={item} noteDigit={i} className={btnClass} auth={this.props.auth} activeNote={activeNote ? activeNote : null } onClickedNote={this.onClickedNote} removeFromList={this.removeFromList}  />
            );
          }, this)}

        </CSSTransitionGroup>
      </div>
    );
  }
});

module.exports = NoteList;