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

  activateNote: function(item) { 
    /* This takes the clicked note, and displays it's full content in the main text window */
    console.log('full note:' + item);
    this.props.updateNoteArea(item);
    // this.setState({
    //   isActive: true
    // })
  },
  
  render: function() {    
    return (
      <ul className="notes-list" >      
        {this.props.noteKeys.map(function(item, i) {          
          var btnClass = classNames({
            'btn': true,
            'btn-pressed': this.state.isPressed,
            'btn-over': !this.state.isPressed && this.state.isHovered
          });
          // console.log(item);
          return (
            <Note noteKey={item} noteDigit={i}  className={btnClass} auth={this.props.auth} onClick={this.activateNote.bind(this, item)}  />
          );
        }, this)}

      </ul>
    );
  }
});

module.exports = NoteList;