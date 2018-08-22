const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var api_key = 'key-02b0667991fa6a9066a80fff3622e744';
var domain = 'sandbox84ab3f227837419caef3e84b60166189.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

admin.initializeApp();

exports.sendContactEmail = functions.database.ref('/ContactMessages/{id}').onWrite((event, context) => {
    const entry = event.after.val();

    if (!entry) {
        return false;
    }

    var mailData = {
      from: entry.name + " <" + entry.email + ">",
      to: 'justbane@gmail.com',
      subject: entry.subject,
      text: entry.name + " says:\n\n" + entry.message
    };

    return mailgun.messages().send(mailData).then(() => {
        console.log('Success');
        admin.database().ref('/ContactMessages/' + context.params.id).remove();
    }).catch((error) => {
        console.log(error);
    });

    //return null;

});
