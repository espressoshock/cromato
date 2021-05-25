require('dotenv').config();
const express = require('express');
const passport = require('passport');
const path = require('path');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./passport-setup');

//firebase admin sdk
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//cokie session
app.use(
  cookieSession({
    name: 'cromato-api-session',
    keys: ['key1', 'key2'],
  })
);
//passportjs
app.use(passport.initialize());
app.use(passport.session());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'cromato-client-reactjs/build')));

const isAuth = (req, res, next) => {
  //console.log('req-user:', req.user);
  if (req.user) next();
  else res.sendStatus(401);
};
app.get('/api', (req, res) => {
  if (req.user) res.redirect('/api/statistics');
  //we're auth
  else res.redirect('/api/auth'); //we need auth
  res.redirect('/api/loggedout');
});

app.get('/api/loggedout', (req, res) =>
  res.json({ op: 'Successful', message: 'You sign out' })
);
app.get('/api/signout', (req, res) => {
  req.session = null; // destroy session
  req.logout();
  res.redirect('/api/loggedout');
});

app.get('/api/fail', (req, res) =>
  res.json({
    op: 'Error',
    messge: 'Auth failed',
  })
);
app.get('/api/statistics', isAuth, (req, res) => {
  //console.log('req-user:', req.user);
  (async () => {
    const statisticSnapshot = await db
      .collection('users')
      .doc(req.user.id)
      .get();
    const tasksSnapshot = await db
      .collection(`users/${req.user.id}/tasks`)
      .get();
    if (statisticSnapshot.exists)
      console.log('statistic-', statisticSnapshot.data());
    let tasksData = [];
    tasksSnapshot.forEach((doc) => {
      //console.log('tasks-', doc.data());
      tasksData.push(doc);
    });

    res.json({
      status: 'account active',
      reponseStatus: 200,
      user: req.user,
      statistics: statisticSnapshot,
      tasksData: tasksData,
    });
  })();
});
app.get(
  '/api/auth',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
app.get(
  '/api/auth/callback',
  passport.authenticate('google', { failureRedirect: 'api/fail' }),
  function (req, res) {
    // Successful authentication, redirect to statistics.
    res.redirect('/api/statistics');
  }
);

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname + '/cromato-client-reactjs/build/index.html')
  );
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('App is listening on port ' + port);
});
