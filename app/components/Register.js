var React = require('react');
var firebaseUtils = require('../utils/firebaseUtils');
var ReactRouter = require('react-router');
var Link = require('react-router').Link
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
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
      <ReactCSSTransitionGroup transitionName="login-register-form" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
        <div className="form-wrap">
          <h1>Register, and back back to work</h1>
            <Formsy.Form onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
              <div className="form-group">
                <Input className="form-control" ref="email" placeholder="Email" name="email" validations="isEmail" validationError="Please use a valid email." required/>
              </div>
              <div className="form-group">
                <Input className="form-control" ref="firstName" placeholder="First Name" name="first-name" validations="isExisty" validationError="Your first name is required." required/>
              </div>
              <div className="form-group">
                <Input className="form-control" ref="lastName" placeholder="Last Name" name="last-name" validations="isExisty" validationError="Your last name is required." required/>
              </div>
              <div className="form-group">
                <Input className="form-control" ref="pw" placeholder="Password" name="password" validations="isExisty" validationError="A password with at least 6 characters is required." required/>
              </div>
              <button type="submit" className="btn btn-primary">Create Account</button>
            </Formsy.Form>
            <p>Already have an account? <strong className="login-register" onClick={this.handleLoginClick}> Log in</strong>.</p>
          </div>
        </ReactCSSTransitionGroup>
      </div>
    )
  },
  handleLoginClick: function(){
    console.log('test');
    this.props.handleLoginClick();
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
        // this.history.pushState(null, '/pad');
        this.setState({
          loggedIn: "loggedIn"
        });

      }
      this.props.logInUser();
    }.bind(this));
  }
});

module.exports = Register;