const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');
const hbs = require('handlebars');
const app = express();

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var api_key = 'key-02b0667991fa6a9066a80fff3622e744';
var domain = 'sandbox84ab3f227837419caef3e84b60166189.mailgun.org';

admin.initializeApp();

// Routes
app.get("/", (req, res) => {
    // Render
    res.render('index', {
        'name': "Justin Bane"
    });
});
app.get("/shop", (req, res) => {
    // Render
    res.render('shop', {
        'name': "Justin's Shop"
    });
});

exports.app = functions.https.onRequest(app);
