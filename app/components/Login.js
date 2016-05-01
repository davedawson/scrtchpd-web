var React = require('react');
var ReactRouter = require('react-router');
var Link = require('react-router').Link
var forge = "https://scrtchpd.firebaseio.com";
var ref = new Firebase(forge);
var firebaseUtils = require('../utils/firebaseUtils');
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Formsy = require('formsy-react');
var Input = require('./Input.js');

var cachedUser = null;
var Login = React.createClass({
  mixins: [History],
  statics: {
    attemptedTransition: null
  },
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function(){
    return {
      error: false
    }
  },

  handleRegisterClick: function(){
    console.log('test');
    this.props.handleRegisterClick();

  },

  render: function(){
    var errors = this.state.error ? <p> Error on Login </p> : '';
    return (
      <div className="login-page account-page">
        <ReactCSSTransitionGroup transitionName="form" transitionAppear={true} transitionAppearTimeout={300} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          <div className="form-wrap">
            <h1>Log In and Get Writing</h1>
            <Formsy.Form onValidSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
              <div className="form-group">
                <Input className="form-control" ref="email" type="email" placeholder="Email" name="email" validations="isEmail" validationError="Please use a valid email." required/>
              </div>
              <div className="form-group">
                <Input className="form-control" ref="pw" type="password" placeholder="Password" name="password" validations="minLength:6" validationError="A password with at least 6 characters is required." required/>
              </div>
              <button type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>Log in</button>
              {errors}
            </Formsy.Form>
            <p>Don&#39;t have an account? <strong className="login-register" onClick={this.handleRegisterClick}> Register</strong>.</p>
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
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
  handleSubmit: function(model){
    // e.preventDefault();
    console.log(model.email);
    var email = model.email;
    var pw = model.password;
    firebaseUtils.loginWithPW({email: email, password: pw}, function(){
      if(Login.attemptedTransition){
        var transition = Login.attemptedTransition;
        Login.attemptedTransition = null;
        transition.retry();
      } else {
        console.log('submitted');
        // Router.replaceWith('pad');
        // this.context.router.transitionTo('pad');
        // this.history.pushState(null, '/pad');
        this.setState({
        	loggedIn: "loggedIn"
        });
        this.props.logInUser();
      }
    }.bind(this));
  },
});

module.exports = Login;