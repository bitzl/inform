'use strict';

var _ = require('lodash');

var channels = {},
    recipients = {};

var inform = function (recipient, messages, callback) {
  if (!recipient) { throw new Error('recipient are missing.'); }
  if (!messages) { throw new Error('messages are missing.'); }
  if (!callback) { throw new Error('callback is missing.'); }

  recipient = _.flatten([ recipient ]);

  for (var i = 0; i < recipient.length; i++) {
    if (!recipients[recipient[i]]) { throw new Error('Unknown recipient \'' + recipient[i] + '\'.'); }
  }

  for (var channel in messages) {
    if (!channels[channel]) { throw new Error('Unknown channel \'' + channel + '\'.'); }
  }
};

inform.use = function (name, channel) {
  if (!name) { throw new Error('name is missing.'); }
  if (!channel) { throw new Error('channel is missing'); }
  if (!channel.send) { throw new Error('channel.send is missing.'); }
  if (channels[name]) { throw new Error('channel name is already being used.'); }

  channels[name] = channel;
};

inform.define = function (name, recipient) {
  if (!name) { throw new Error('name is missing.'); }
  if (!recipient) { throw new Error('recipient is missing.'); }
  if (recipients[name]) { throw new Error('recipient name is already being used.'); }

  var isDefining = Array.isArray(recipient) ? 'group' : 'user';

  switch (isDefining) {
    case 'user':
      for (var channel in recipient) {
        if (!channels[channel]) { throw new Error('Unknown channel \'' + channel + '\'.'); }
      }

      recipients[name] = recipient;
      break;
    case 'group':
      if (recipient.length === 0) { throw new Error('recipients are missing.'); }
      for (var i = 0; i < recipient.length; i++) {
        if (!recipients[recipient[i]]) { throw new Error('Unknown recipient \'' + recipient[i] + '\'.'); }
      }

      recipients[name] = recipient;
      break;
  }
};

module.exports = inform;
