var React = require('react');

var NotFound = React.createClass({

  getInitialState: function(){
    return {
    
    };
  },
  
  render: function() {    
    return (
	      <div>
		      <h1>Page Not Found</h1>
	      </div>
	    );
	  }
});

module.exports = NotFound;