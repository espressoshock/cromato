import { Route, BrowserRouter, Switch } from 'react-router-dom';
import './App.css';
import InfoPage from './pages/InfoPage/InfoPage';
import TimerPage from './pages/timer/TimerPage';

function App() {
  return (
    <div className="cromato">
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/" component={TimerPage} />
          <Route exact={true} path="/info" component={InfoPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
