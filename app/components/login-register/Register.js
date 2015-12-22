var React = require('react');
var firebaseUtils = require('../../utils/firebaseUtils');
var Router = require('react-router');

var Register = React.createClass({
  mixins: [ Router.Navigation ],
  handleSubmit: function(e){
    e.preventDefault();
    var email = this.refs.email.getDOMNode().value;
    var pw = this.refs.pw.getDOMNode().value;
    var firstName = this.refs.firstName.getDOMNode().value;
    var lastName = this.refs.lastName.getDOMNode().value;
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
      }
    }.bind(this));
  },
  render: function(){
    return (
      <div className="col-sm-6 col-sm-offset-3">
      <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label> Email </label>
            <input className="form-control" ref="email" placeholder="Email"/>
          </div>
          <div className="form-group">
            <label> First Name </label>
            <input className="form-control" ref="firstName" placeholder="First Name"/>
          </div>
          <div className="form-group">
            <label> Last Name </label>
            <input className="form-control" ref="lastName" placeholder="Last Name"/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input ref="pw" type="password" className="form-control" placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    )
  }
});

module.exports = Register;