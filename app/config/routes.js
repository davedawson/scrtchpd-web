var React = require('react');
var App = require('../components/App');
var Home = require('../components/Home');
var Pad = require('../components/Pad');
var Login = require("../components/login-register/Login");
var Logout = require('../components/login-register/Logout');
var Register = require('../components/login-register/Register');
var Router = require('react-router');
var Route = Router.Route;
var Link = require('react-router').Link
var browserHistory = Router.browserHistory;
var IndexRoute = Router.IndexRoute;

module.exports = (
	
/*		<Router>
	    <Route path="/" component={App}>
	      <Route path="home" component={Home} location="history" />
	      <Route path="pad" component={Pad} location="history" />
	    </Route>
	  </Router>
*/

	<Route path="/" component={App}>
		<Route name="home" path="/" component={Pad} />
    <Route name="pad" path="pad" component={Pad} />
    <Route name="login" path="login" component={Login} />    
    <Route name="logout" path="logout" component={Logout} />    
    <Route name="register" path="register" component={Register} />
  </Route>
	
)