require('dotenv').config();
const express = require('express');
const passport = require('passport');
const path = require('path');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./passport-setup');

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

app.get('/api/loggedout', (req, res) => res.send('You log out'));
app.get('/api/signout', (req, res) => {
  req.session = null; // destroy session
  req.logout();
  res.redirect('/api/loggedout');
});

app.get('/api/fail', (req, res) =>
  res.send('Auth failed - You need to auth before accessing the API')
);
app.get('/api/statistics', isAuth, (req, res) => {
  console.log('req-user:', req.user);
  res.send('Auth successful - here are your statistics: ');
});
app.get(
  '/api/auth',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
app.get(
  '/api/auth/callback',
  passport.authenticate('google', { failureRedirect: 'api/fail' }),
  function (req, res) {
    //console.log('callback: ', req.user);
    // Successful authentication, redirect home.
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
