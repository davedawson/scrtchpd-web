var React = require('react');
var ReactRouter = require('react-router');
var Link = require('react-router').Link
var firebaseUtils = require('../../utils/firebaseUtils');
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;


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
  
  render: function(){
    var errors = this.state.error ? <p> Error on Login </p> : '';
    return (
      <div className="login-page account-page">
        <div className="form-wrap">
          <h1>Log in</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input className="form-control" ref="email" placeholder="Email"/>
            </div>
            <div className="form-group">
              <input ref="pw" type="password" className="form-control" placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-primary">Log in</button>
            {errors}
          </form>
          <p>Don&#39;t have an account? <Link to="register" className="navbar-brand"> Register </Link></p>
        </div>
      </div>
    );
  },
  handleSubmit: function(e){
    e.preventDefault();
    var email = this.refs.email.value;
    var pw = this.refs.pw.value;
    firebaseUtils.loginWithPW({email: email, password: pw}, function(){
      if(Login.attemptedTransition){
        var transition = Login.attemptedTransition;
        Login.attemptedTransition = null;
        transition.retry();
      } else {
        console.log('submitted');
        // Router.replaceWith('pad');
        // this.context.router.transitionTo('pad');
        this.history.pushState(null, '/pad');
      }
    }.bind(this));
  },
});

module.exports = Login;