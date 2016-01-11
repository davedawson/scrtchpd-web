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
  
  render: function() {    
    return (
      <ul className="notes-list" >      
        {this.props.notes.map(function(item, i) {          
          var btnClass = classNames({
            'btn': true,
            'btn-pressed': this.state.isPressed,
            'btn-over': !this.state.isPressed && this.state.isHovered
          });
          return (
            <Note noteData={item} noteDigit={i}  className={btnClass} />
          );
        }, this)}

      </ul>
    );
  }
});

module.exports = NoteList;