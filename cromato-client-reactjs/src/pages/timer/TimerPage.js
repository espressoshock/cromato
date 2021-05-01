import { Component } from 'react';
import ActionButton from '../../components/action-button/ActionButton';
import './TimerPage.css';

import ReportIcon from './images/icons/icon-report.svg';
import SettingsIcon from './images/icons/icon-settings.svg';
import LoginIcon from './images/icons/icon-login.svg';
import PomodoroTimer from '../../components/pomodoro-timer/PomodoroTimer';

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
            <div className="right">
              <ActionButton text="Report" icon={ReportIcon} size="m" />
              <ActionButton text="Settings" icon={SettingsIcon} size="m" />
              <ActionButton text="Login" icon={LoginIcon} size="m" />
            </div>
          </div>
          <div className="divider"></div>
        </header>
        <div className="main-wrapper">
          <PomodoroTimer />
        </div>
      </div>
    );
  }
}

export default TimerPage;
