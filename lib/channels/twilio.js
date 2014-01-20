'use strict';

var twilio = require('twilio');

var setup = function (options) {
  var client = twilio(options.id, options.token);

  return {
    send: function (recipient, message, callback) {
      client.sendMessage({
        to: recipient,
        from: options.from,
        body: message
      }, callback);
    }
  };
};

module.exports = setup;
