import { Route, BrowserRouter, Switch } from 'react-router-dom';
import './App.css';
import TimerPage from './pages/timer/TimerPage';

function App() {
  return (
    <div className="cromato">
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/" component={TimerPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
