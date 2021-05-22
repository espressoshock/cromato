import { Component } from 'react';
import ActionButton from '../../components/action-button/ActionButton';
import './TimerPage.css';

import ReportIcon from './images/icons/icon-report.svg';
import SettingsIcon from './images/icons/icon-settings.svg';
import LoginIcon from './images/icons/icon-login.svg';
import PomodoroTimer from '../../components/pomodoro-timer/PomodoroTimer';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

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
  state = {};
  componentDidMount() {}
  login = (e) => {
    console.log('login');
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(credential);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(error);
        // ...
      });
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
              <ActionButton
                text="Login"
                icon={LoginIcon}
                size="m"
                onButtonClicked={(e) => {
                  this.login();
                }}
              />
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
