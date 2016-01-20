var React = require('react');
var firebaseUtils = require('../../utils/firebaseUtils');
var ReactRouter = require('react-router');
var Link = require('react-router').Link
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;

var Register = React.createClass({
  mixins: [History],
  contextTypes: {
    router: React.PropTypes.func
  },
  render: function(){
    return (
      <div className="register-page account-page">
      <div className="form-wrap">
        <h1>Register</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input className="form-control" ref="email" placeholder="Email"/>
            </div>
            <div className="form-group">
              <input className="form-control" ref="firstName" placeholder="First Name"/>
            </div>
            <div className="form-group">
              <input className="form-control" ref="lastName" placeholder="Last Name"/>
            </div>
            <div className="form-group">
              <input ref="pw" type="password" className="form-control" placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-primary">Create Account</button>
          </form>
        </div>
      </div>
    )
  },
  handleSubmit: function(e){
    e.preventDefault();
    var email = this.refs.email.value;
    var pw = this.refs.pw.value;
    var firstName = this.refs.firstName.value;
    var lastName = this.refs.lastName.value;
    firebaseUtils.createUser({
      email: email,
      firstName: firstName, 
      lastName: lastName, 
      password: pw
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        this.history.pushState(null, '/pad');
      }
    }.bind(this));
  }
});

module.exports = Register;