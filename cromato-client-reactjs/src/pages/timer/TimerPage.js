import { Component } from 'react';
import ActionButton from '../../components/action-button/ActionButton';
import './TimerPage.css';

import ReportIcon from './images/icons/icon-report.svg';
import SettingsIcon from './images/icons/icon-settings.svg';
import LoginIcon from './images/icons/icon-login.svg';
import PomodoroTimer from '../../components/pomodoro-timer/PomodoroTimer';
import ProfileThumb from '../../components/profile-thumb/ProfileThumb';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { getFirestore, updateDoc } from 'firebase/firestore';

import {
  collection,
  addDoc,
  doc,
  query,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
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
initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();
const db = getFirestore();

class TimerPage extends Component {
  state = {
    auth: false,
    tasks: [],
    cTask: undefined,
    avatarContextMenuAE: null,
    taskListBindingHandle: null,
    timerClearFlag: false, //special clearing flag
  };
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ auth: true });
        this.setState({ owner: user });

        const q = query(collection(db, `users/${auth.currentUser.uid}/tasks`));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const tTasks = [];
          querySnapshot.forEach((doc) => {
            tTasks.push({ ...doc.data(), id: doc.id });
          });
          console.log('docs: ', tTasks);
          this.setState({ tasks: tTasks });
          if (this.state.cTask === undefined)
            this.setState({ cTask: tTasks[0] });
        });
        this.setState({ taskListBindingHandle: unsubscribe });
      } else {
        this.setState({ auth: false });
      }
    });
  }
  openAvatarContextMenu = (e) => {
    console.log('open');
    this.setState({ avatarContextMenuAE: e.currentTarget });
  };
  closeAvatarContextMenu = () => {
    this.setState({ avatarContextMenuAE: null });
  };
  login = (e) => {
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
  signOut = (e) => {
    this.closeAvatarContextMenu(e); //auto-close context menu
    signOut(auth).then(() => {
      this.setState({ tasks: [] });
      this.setState({ cTask: undefined });
    });
  };
  renderLogin = () => {
    if (this.state.auth) {
      return (
        <ProfileThumb
          thumbURL={auth.currentUser.photoURL}
          onAvatarClick={(e) => {
            this.openAvatarContextMenu(e);
          }}
        />
      );
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
      await updateDoc(
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
        await updateDoc(
          doc(db, `users/${auth.currentUser.uid}/tasks/${this.state.cTask.id}`),
          {
            name: task.name,
          }
        );

        console.log('document updated');
        let ref = { ...this.state.cTask };
        ref.name = task.name;
        this.setState({ ref });
      })();
    }
  };
  onEstPomodorosUpdate = (update) => {
    (async () => {
      await updateDoc(
        doc(db, `users/${auth.currentUser.uid}/tasks/${this.state.cTask.id}`),
        {
          pomodoroEstimated: update.pomodoroEstimated,
        }
      );

      console.log('document updated');
    })();
  };
  onTLTaskClicked = (task) => {
    console.log('clicked', task);
    this.setState({ cTask: task });
  };
  onAddTask = (e) => {
    //submit
    const tTask = this.submitTask({
      name: 'Sample task',
      pomodoroElapsed: 0,
      pomodoroEstimated: 3,
      completed: false,
    });
    (async () => {
      const docRef = await addDoc(
        collection(db, `users/${auth.currentUser.uid}/tasks`),
        tTask
      );
      this.setState({ cTask: { ...tTask, id: docRef.id } });
      console.log('cTask: ', this.state.cTask);
    })();
  };
  onTLTaskDelete = (id) => {
    console.log('id', id);
    (async () => {
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/tasks/${id}`));

      if (this.state.cTask.id === id) {
        this.setState({ cTask: undefined });
        this.setState({ timerClearFlag: true }, () => {
          //clearing flag set/un-set
          this.setState({ timerClearFlag: false });
        });
      }

      console.log('document deleted');
    })();
  };
  onTLTaskCompleteClicked = (id, completed) => {
    (async () => {
      await updateDoc(doc(db, `users/${auth.currentUser.uid}/tasks/${id}`), {
        completed: !completed,
      });

      console.log('document updated');
    })();
  };
  onPomodoroElapsed = (e) => {
    (async () => {
      await updateDoc(
        doc(db, `users/${auth.currentUser.uid}/tasks/${this.state.cTask.id}`),
        {
          pomodoroElapsed: this.state.cTask.pomodoroElapsed + 1,
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
              <ActionButton
                text="Report"
                icon={ReportIcon}
                size="m"
                onButtonClicked={(e) => null}
              />
              <ActionButton
                text="Settings"
                icon={SettingsIcon}
                size="m"
                onButtonClicked={(e) => this.openAvatarContextMenu(e)}
              />
              {this.renderLogin()}
              <Menu
                id="simple-menu"
                anchorEl={this.state.avatarContextMenuAE}
                keepMounted
                open={Boolean(this.state.avatarContextMenuAE)}
                onClose={(e) => this.closeAvatarContextMenu(e)}
              >
                <MenuItem onClick={(e) => this.signOut()}>Sign-out</MenuItem>
              </Menu>
            </div>
          </div>
          <div className="divider"></div>
        </header>
        <div className="main-wrapper">
          <PomodoroTimer
            tasks={this.state.tasks}
            aTask={this.state.cTask}
            clearFlag={this.state.timerClearFlag}
            onTaskSubmit={(e) => this.onTaskSubmit(e)}
            onTaskNameChangeOrSubmit={(e) => this.onTaskNameChangeOrSubmit(e)}
            onEstPomodorosUpdate={(e) => this.onEstPomodorosUpdate(e)}
            onTLTaskClicked={(e) => this.onTLTaskClicked(e)}
            onAddTask={(e) => this.onAddTask(e)}
            onTLTaskDelete={(e) => this.onTLTaskDelete(e)}
            onTLTaskCompleteClicked={(id, completed) =>
              this.onTLTaskCompleteClicked(id, completed)
            }
            onPomodoroElapsed={(e) => this.onPomodoroElapsed(e)}
          />
        </div>
      </div>
    );
  }
}

export default TimerPage;
