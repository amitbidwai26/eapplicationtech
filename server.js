// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var mongoose = require('mongoose');
var path = require('path');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var flash    = require('connect-flash');
var cors = require('cors');
var passport = require('passport');
var configDB = require('./config/database.js');

var app      = express();
var port     = process.env.PORT || 8080;

// configuration ===============================================================
mongoose.connect(configDB.databaseurl); // connect to our database
mongoose.connection.on('connected', () =>{
	console.log('#Connected to database')
});
mongoose.connection.on('error', (err) =>{
	console.log('\n\n#Database error : '+ err);
});
require('./config/passport')(passport); // pass passport for configuration

// Session Middleware ==========================================================
app.use(session({
    secret: configDB.secret, // session secret
    resave: true,
    saveUninitialized: true
}));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // Middleware get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport =======================================================

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================

var user = require('./routes/user')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================


// set static files (css and images, etc) location

app.use(express.static(__dirname + '/public'));


app.listen(port);
console.log('The magic is live on localhost:' + port);
