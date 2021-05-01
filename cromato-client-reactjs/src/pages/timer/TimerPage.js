import { Component } from 'react';
import './TimerPage.css';

class TimerPage extends Component {
  state = {};
  render() {
    return (
      <div className="timer-page">
        <header>
          <div className="menu">
            <div className="left">
              <div className="logo">Cromato</div>
            </div>
            <div className="right">Hello</div>
          </div>
        </header>
        <div className="wrapper">Hello!</div>
      </div>
    );
  }
}

export default TimerPage;
