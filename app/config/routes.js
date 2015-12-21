var React = require('react');
var App = require('../components/App');
var Home = require('../components/Home');
var Router = require('react-router');
var Route = Router.Route;
var Link = require('react-router').Link
var browserHistory = Router.browserHistory;
var IndexRoute = Router.IndexRoute;

module.exports = (
	
		<Router>
	    <Route path="/" component={App}>
	      <Route path="home" component={Home} />
	    </Route>
	  </Router>
	
)