import About from './containers/About';
import Index from './containers/Index';

var Router=ReactRouter.Router;
var Route=ReactRouter.Route;
var browserHistory=ReactRouter.browserHistory;

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Index} />
    <Route path="about" component={About} />
  </Router>, document.getElementById('root')
);


