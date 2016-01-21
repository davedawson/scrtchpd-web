var React = require('react');
var TimeAgo = require('react-timeago');
var Rebase = require('re-base');
var classNames = require('classnames');
var Note = require('./Note.js');

var NoteList = React.createClass({
  /* This compenent contains the list of individual notes */
  
  getInitialState: function(){
    return {
    
    };
  },
  componentDidMount: function() {
    
  },
  onClickedNote: function(item, noteKey){
    // console.log(item);
    this.props.handleNoteAreaUpdate(item, noteKey);
    this.setState({
      activeNote: noteKey
    });
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
      <ul className="notes-list" >      
        {this.props.noteKeys.map(function(item, i) {   
          if (this.state.activeNote == item['.key']) {
             var activeNote = true;
          }       
          var btnClass = classNames({
            'btn': true,
            'btn-pressed': this.state.isPressed,
            'btn-over': !this.state.isPressed && this.state.isHovered,
            'active-note': activeNote
          });
          // console.log(item);
          return (
            <Note noteKey={item} noteDigit={i}  className={btnClass} auth={this.props.auth} activeNote={activeNote ? activeNote : null } onClickedNote={this.onClickedNote} removeFromList={this.removeFromList}  />
          );
        }, this)}

      </ul>
    );
  }
});

module.exports = NoteList;