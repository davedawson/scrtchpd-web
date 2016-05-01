var React = require('react');
var firebaseUtils = require('../../utils/firebaseUtils');
var ReactRouter = require('react-router');
var Link = require('react-router').Link
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;
var Formsy = require('formsy-react');
var Input = require('./Input.js');

var Register = React.createClass({
  mixins: [History],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      canSubmit: false
    }
  },
  render: function(){
    return (
      <div className="register-page account-page">
      <div className="form-wrap">
        <h1>Register</h1>

          <Formsy.Form onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
            <div className="form-group">
              <Input name="email" validations="isEmail" validationError="This is not a valid email" required/>
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
            <button type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>Create Account</button>


  

          </Formsy.Form>
          <form onSubmit={this.handleSubmit}>
            
          </form>
        </div>
      </div>
    )
  },
  enableButton: function() {
    this.setState({
      canSubmit: true
    });
  },
  disableButton: function() {
    this.setState({
      canSubmit: false
    });
  },
  submit: function(model) {
    // someDep.saveEmail(model.email);
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