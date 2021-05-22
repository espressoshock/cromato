import { Component } from 'react';
import ActionButton from '../../components/action-button/ActionButton';
import './TimerPage.css';

import ReportIcon from './images/icons/icon-report.svg';
import SettingsIcon from './images/icons/icon-settings.svg';
import LoginIcon from './images/icons/icon-login.svg';
import PomodoroTimer from '../../components/pomodoro-timer/PomodoroTimer';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import ProfileThumb from '../../components/profile-thumb/ProfileThumb';

const firebaseConfig = {
  apiKey: 'AIzaSyA3pQsx-EOXyJoS4ckyTl-WUfULEJtBGJU',
  authDomain: 'cromato.firebaseapp.com',
  projectId: 'cromato',
  storageBucket: 'cromato.appspot.com',
  messagingSenderId: '338654786395',
  appId: '1:338654786395:web:9f519f34a4e4cb4fd8607e',
  measurementId: 'G-X9SG38QH5W',
};
const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

class TimerPage extends Component {
  state = {
    auth: false,
  };
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ auth: true });
      } else {
        this.setState({ auth: false });
      }
    });
  }
  login = (e) => {
    console.log('login');
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log(credential);
        console.log(auth.currentUser);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  renderLogin = () => {
    console.log(this.state.auth);
    if (this.state.auth) {
      console.log(auth.currentUser);
      return <ProfileThumb thumbURL={auth.currentUser.photoURL} />;
    } else
      return (
        <ActionButton
          text="Login"
          icon={LoginIcon}
          size="m"
          onButtonClicked={(e) => {
            this.login();
          }}
        />
      );
  };
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
              {this.renderLogin()}
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
