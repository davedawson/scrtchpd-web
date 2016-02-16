var React = require('react');
var ReactDOM = require('react-dom');

var UnauthenticatedSidebar = React.createClass({
  /* Search form. This component lives at the top of the Archive component above the notes list, */
  getInitialState: function() {
      return {
      };
  },
  componentDidMount: function(){
    
  },
  
  render: function() {
    return (
      <div>
        <p>Unauthenticated users get this</p>
      </div>
    )
  }
});

module.exports = UnauthenticatedSidebar;