import { Component, Fragment } from 'react';
import ActionButton from '../../components/action-button/ActionButton';
import './TimerPage.css';

import ReportIcon from './images/icons/icon-report.svg';
import SettingsIcon from './images/icons/icon-settings.svg';
import LoginIcon from './images/icons/icon-login.svg';
import PomodoroTimer from '../../components/pomodoro-timer/PomodoroTimer';
import ProfileThumb from '../../components/profile-thumb/ProfileThumb';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import { ListItemIcon, ListItemSecondaryAction } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import Snackbar from '@material-ui/core/Snackbar';

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
  setDoc,
  addDoc,
  doc,
  query,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import {
  enableIndexedDbPersistence,
  disableNetwork,
  enableNetwork,
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
    settingsModalOpen: false,
    settings: {
      offlineMode: false,
    },
    snackbarVisibility: false,
    snackbarMode: 'light',
    snackbarMessage: '',
  };
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ auth: true });
        this.setState({ owner: user });

        //enable persistence
        enableIndexedDbPersistence(db).catch((err) => {
          if (err.code === 'failed-precondition') {
            console.log('error failed-precondition');
          } else if (err.code === 'unimplemented') {
            console.log('error unimplemented');
          }
        });

        //load settings
        this.loadSettings();

        const q = query(
          collection(db, `users/${auth.currentUser.providerData[0].uid}/tasks`)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const tTasks = [];
          querySnapshot.forEach((doc) => {
            tTasks.push({ ...doc.data(), id: doc.id });
            const source = doc.metadata.fromCache ? 'local cache' : 'server';
            console.log('Data came from ' + source);
            if (doc.metadata.fromCache)
              this.showNotification(
                'You are offline, data cached locally',
                'dark'
              );
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
    this.setState({ avatarContextMenuAE: e.currentTarget });
  };
  closeAvatarContextMenu = () => {
    this.setState({ avatarContextMenuAE: null });
  };
  openSettingsModal = (e) => {
    this.setState({ settingsModalOpen: true });
  };
  closeSettingsModal = (e) => {
    this.setState({ settingsModalOpen: false });
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
          collection(db, `users/${auth.currentUser.providerData[0].uid}/tasks`),
          tTask
        );
        console.log('Document written with ID: ', docRef.id);
        this.setState({ cTask: { ...tTask, id: docRef.id } });
        console.log('cTask: ', this.state.cTask);
        this.showNotification('Task added');
      })();
    }
  };
  onCurrentTaskNameUpdate = (task) => {
    (async () => {
      await updateDoc(
        doc(
          db,
          `users/${auth.currentUser.providerData[0].uid}/tasks/${this.state.cTask.id}`
        ),
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
          collection(db, `users/${auth.currentUser.providerData[0].uid}/tasks`),
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
          doc(
            db,
            `users/${auth.currentUser.providerData[0].uid}/tasks/${this.state.cTask.id}`
          ),
          {
            name: task.name,
          }
        );

        console.log('document updated');
        let ref = { ...this.state.cTask };
        ref.name = task.name;
        this.setState({ cTask: ref });
      })();
    }
  };
  onEstPomodorosUpdate = (update) => {
    (async () => {
      await updateDoc(
        doc(
          db,
          `users/${auth.currentUser.providerData[0].uid}/tasks/${this.state.cTask.id}`
        ),
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
        collection(db, `users/${auth.currentUser.providerData[0].uid}/tasks`),
        tTask
      );
      this.setState({ cTask: { ...tTask, id: docRef.id } });
      console.log('cTask: ', this.state.cTask);
      this.showNotification('Task added successfully!');
    })();
  };
  onTLTaskDelete = (id) => {
    console.log('id', id);
    (async () => {
      await deleteDoc(
        doc(db, `users/${auth.currentUser.providerData[0].uid}/tasks/${id}`)
      );

      if (this.state.cTask.id === id) {
        this.setState({ cTask: undefined });
        this.setState({ timerClearFlag: true }, () => {
          //clearing flag set/un-set
          this.setState({ timerClearFlag: false });
        });
      }

      console.log('document deleted');
      this.showNotification('Task deleted successfully!');
    })();
  };
  onTLTaskCompleteClicked = (id, completed) => {
    (async () => {
      await updateDoc(
        doc(db, `users/${auth.currentUser.providerData[0].uid}/tasks/${id}`),
        {
          completed: !completed,
        }
      );
      if (this.state.cTask?.id === id) {
        let ref = { ...this.state.cTask };
        const c = !completed;
        ref.completed = c;
        this.setState({ cTask: ref });
      }
      console.log('document updated');
      this.showNotification('Task marked as completed!');
    })();
  };
  onPomodoroElapsed = (e) => {
    (async () => {
      await updateDoc(
        doc(
          db,
          `users/${auth.currentUser.providerData[0].uid}/tasks/${this.state.cTask.id}`
        ),
        {
          pomodoroElapsed: this.state.cTask.pomodoroElapsed + 1,
        }
      );

      console.log('document updated');
      const ctask = { ...this.state.cTask };
      ctask.pomodoroElapsed = ctask.pomodoroElapsed + 1;
      this.setState({ cTask: ctask });
    })();
  };
  ///////////////////////////////////
  ////////////////  SETTINGS
  ///////////////////////////////////
  loadSettings = () => {
    onSnapshot(
      doc(db, 'users', auth.currentUser.providerData[0].uid),
      (doc) => {
        console.log('Current data: ', doc.data());
        const source = doc.metadata.fromCache ? 'local cache' : 'server';
        console.log('Data came from ' + source);
        this.setState({ settings: doc.data() }, () => {
          //apply settings
          //offline mode
          if (!this.state.settings?.offlineMode)
            (async () => await enableNetwork(db))();
          else (async () => await disableNetwork(db))();
        });
      }
    );
  };

  toggleOfflineMode = (e) => {
    const settings = { ...this.state.setttings };
    settings.offlineMode = e.target.checked;
    this.setState({ settings: settings });

    (async () => {
      await setDoc(doc(db, 'users', auth.currentUser.providerData[0].uid), {
        offlineMode: e.target.checked,
      });
      console.log('settings updated');
      if (!e.target.checked) (async () => await enableNetwork(db))();
      else (async () => await disableNetwork(db))();
    })();
  };
  ///////////////////////////////////
  ////////////////  notification snackbar
  ///////////////////////////////////
  showNotification = (message, mode = 'light') => {
    this.setState({ snackbarMessage: message });
    this.setState({ snackbarVisibility: true });
    if (mode !== 'light') this.setState({ snackbarMode: mode });
  };
  hideNotification = () => {
    this.setState({ snackbarVisibility: false });
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
                onButtonClicked={(e) => this.openSettingsModal(e)}
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
        <Dialog
          open={this.state.settingsModalOpen}
          onClose={(e) => this.closeSettingsModal(e)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={'xs'}
          fullWidth={true}
        >
          <DialogTitle id="alert-dialog-title">
            {'Settings'}
            <IconButton
              aria-label="close"
              onClick={(e) => this.closeSettingsModal(e)}
              className="modal-close-button"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <DialogContent id="alert-dialog-description">
              Here you can customize the in-app settings
              <List>
                <ListItem>
                  <ListItemIcon>
                    <OfflineBoltIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Offline Mode"
                    secondary="Keep working when offline"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      onChange={(e) => this.toggleOfflineMode(e)}
                      checked={this.state.settings?.offlineMode}
                      inputProps={{
                        'aria-labelledby': 'switch-list-label-wifi',
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </DialogContent>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) => this.closeSettingsModal(e)}
              color="primary"
              autoFocus
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          className={this.state.snackbarMode}
          autoHideDuration={3000}
          open={this.state.snackbarVisibility}
          onClose={(e) => this.hideNotification(e)}
          message={this.state.snackbarMessage}
          action={
            <Fragment>
              <Button
                color="secondary"
                size="small"
                onClick={(e) => this.hideNotification(e)}
              >
                DISMISS
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={(e) => this.hideNotification(e)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Fragment>
          }
        />
      </div>
    );
  }
}

export default TimerPage;
