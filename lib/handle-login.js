'use strict';
const prompt = require('prompt');
const auth = require('panoptes-client/lib/auth');

module.exports = function(promptEnabled, callback) {
  if(promptEnabled) { // delete credentials from ENV when prompting
    delete process.env.PANOPTES_USERNAME;
    delete process.env.PANOPTES_PASSWORD;
  }
  // skip prompt if credentials are found in ENV
  prompt.override = { login: process.env.PANOPTES_USERNAME, password: process.env.PANOPTES_PASSWORD };
  prompt.start();
  prompt.get({
    properties: {
      login: {
        pattern: /^[a-zA-Z\s\-]+$/,
        message: 'Name must be only letters, spaces, or dashes',
        required: true
      },
      password: {
        hidden: true
      }
    }
  }, function(error, result) {
    if (error) { console.log(error); }
    let credentials = result;
    auth.signIn(credentials).then((user) => {
      callback(user); // run callback once logged in
    });
  });


}
