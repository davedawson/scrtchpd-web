var React = require('react');
var firebaseUtils = require('../../utils/firebaseUtils');

var Logout = React.createClass({
  componentDidMount: function () {
    firebaseUtils.logout();
  },

  render: function () {
    return (
    	<div class="account-page">
	    	<div class="form-wrap">
		    	<p>You are now logged out</p>;
	    	</div>
    	</div>
    	)
  }
});

module.exports = Logout;