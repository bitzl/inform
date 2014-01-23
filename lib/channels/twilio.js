'use strict';

var twilio = require('twilio');

var setup = function (options) {
  if (!options) { throw new Error('Options are missing.'); }

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
