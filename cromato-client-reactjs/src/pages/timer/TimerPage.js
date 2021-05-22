import { Component } from 'react';
import ActionButton from '../../components/action-button/ActionButton';
import './TimerPage.css';

import ReportIcon from './images/icons/icon-report.svg';
import SettingsIcon from './images/icons/icon-settings.svg';
import LoginIcon from './images/icons/icon-login.svg';
import PomodoroTimer from '../../components/pomodoro-timer/PomodoroTimer';
import ProfileThumb from '../../components/profile-thumb/ProfileThumb';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, updateDoc } from 'firebase/firestore';

import {
  collection,
  addDoc,
  doc,
  query,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

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
const db = getFirestore();

let tasksCollectionRef;

class TimerPage extends Component {
  state = {
    auth: false,
    tasks: [],
    cTask: undefined,
  };
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ auth: true });
        this.setState({ owner: user });
        tasksCollectionRef = collection(
          db,
          `users/${auth.currentUser.uid}/tasks`
        );

        const q = query(collection(db, `users/${auth.currentUser.uid}/tasks`));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const tTasks = [];
          querySnapshot.forEach((doc) => {
            tTasks.push({ ...doc.data(), id: doc.id });
          });
          console.log('docs: ', tTasks);
          this.setState({ tasks: tTasks });
          this.setState({ cTask: tTasks[0] });
        });

        /*   (async () => {
          const docRef = await addDoc(
            collection(db, `users/${auth.currentUser.uid}/tasks`),
            {
              name: 'test',
              active: false,
              completed: false,
              pomodoroElapsed: 1,
              pomodoroEstimated: 3,
            }
          );
          console.log('Document written with ID: ', docRef.id);
        })(); */

        /*  this.submitTask({
          name: 'test',
          active: false,
          completed: false,
          pomodoroElapsed: 1,
          pomodoroEstimated: 3,
        }); */
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
    if (this.state.auth) {
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
  submitTask = (task) => {
    return {
      completed: task.completed,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
      name: task.name,
      pomodoroElapsed: task.pomodoroElapsed,
      pomodoroEstimated: task.pomodoroEstimated,
    };
  };
  onTaskSubmit = (data) => {
    if (data.name.length > 0 && this.state.tasks.length === 0) {
      const tTask = this.submitTask({
        name: data.name,
        pomodoroElapsed: 0,
        pomodoroEstimated: data.pomodoroEstimated,
        completed: false,
      });
      (async () => {
        const docRef = await addDoc(
          collection(db, `users/${auth.currentUser.uid}/tasks`),
          tTask
        );
        console.log('Document written with ID: ', docRef.id);
        this.setState({ cTask: { ...tTask, id: docRef.id } });
        console.log('cTask: ', this.state.cTask);
      })();
    }
  };
  onCurrentTaskNameUpdate = (task) => {
    (async () => {
      const docRef = await updateDoc(
        doc(db, `users/${auth.currentUser.uid}/tasks/${this.state.cTask.id}`),
        {
          name: task.name,
        }
      );

      console.log('document updated');
    })();
  };
  onTaskNameChangeOrSubmit = (task) => {
    if (task.name.length > 0 && this.state.tasks.length === 0) {
      //submit
      const tTask = this.submitTask({
        name: task.name,
        pomodoroElapsed: 0,
        pomodoroEstimated: task.pomodoroEstimated,
        completed: false,
      });
      (async () => {
        const docRef = await addDoc(
          collection(db, `users/${auth.currentUser.uid}/tasks`),
          tTask
        );
        console.log('Document written with ID: ', docRef.id);
        this.setState({ cTask: { ...tTask, id: docRef.id } });
        console.log('cTask: ', this.state.cTask);
      })();
    } else {
      //upating

      (async () => {
        const docRef = await updateDoc(
          doc(db, `users/${auth.currentUser.uid}/tasks/${this.state.cTask.id}`),
          {
            name: task.name,
          }
        );

        console.log('document updated');
      })();
    }
  };
  onEstPomodorosUpdate = (update) => {
    (async () => {
      const docRef = await updateDoc(
        doc(db, `users/${auth.currentUser.uid}/tasks/${this.state.cTask.id}`),
        {
          pomodoroEstimated: update.pomodoroEstimated,
        }
      );

      console.log('document updated');
    })();
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
          <PomodoroTimer
            tasks={this.state.tasks}
            aTask={this.state.cTask}
            onTaskSubmit={(e) => this.onTaskSubmit(e)}
            onTaskNameChangeOrSubmit={(e) => this.onTaskNameChangeOrSubmit(e)}
            onEstPomodorosUpdate={(e) => this.onEstPomodorosUpdate(e)}
          />
        </div>
      </div>
    );
  }
}

export default TimerPage;
