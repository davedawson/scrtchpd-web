var React = require('react');
var App = require('../components/App');
var Home = require('../components/Home');
var Pad = require('../components/Pad');
var NotFound = require('../components/NotFound');
var Login = require("../components/login-register/Login");
var Logout = require('../components/login-register/Logout');
var Register = require('../components/login-register/Register');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = require('react-router').Link
var createBrowserHistory = require('history/lib/createBrowserHistory');
var IndexRoute = Router.IndexRoute;

module.exports = (
	
/*		<Router>
	    <Route path="/" component={App}>
	      <Route path="home" component={Home} location="history" />
	      <Route path="pad" component={Pad} location="history" />
	    </Route>
	  </Router>
*/

	<Router history={createBrowserHistory()}>
    		<Route name="home" path="/" component={Pad} />
    <Route name="pad" path="pad" component={Pad} />
    <Route name="login" path="login" component={Login} />    
    <Route name="logout" path="logout" component={Logout} />    
    <Route name="register" path="register" component={Register} />
    <Route name="not-found" path="*" component={NotFound} />
  </Router>
	
)