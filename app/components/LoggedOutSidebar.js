var React = require('react');
var LoginForm = require('./Login.js');
var RegisterForm = require('./Register.js');
var firebaseRef;

var loggedOutSidebar = React.createClass({
	getInitialState: function(){
		return {
			loginForm: true
		}
	}, 
	handleLoginRegisterClick: function(){
		this.setState({
			loginForm: !this.state.loginForm
		});
	},

  logInUser: function(){
    this.props.logInUser();
  },

	render: function() {
		if (this.state.loginForm) {
			var form = <LoginForm logInUser={this.logInUser} handleRegisterClick={this.handleLoginRegisterClick} />
		} else {
			var form = <RegisterForm logInUser={this.logInUser} handleLoginClick={this.handleLoginRegisterClick} />
		}
		return (
			<div>
				{form}
			</div>
		)
	}
});

module.exports = loggedOutSidebar