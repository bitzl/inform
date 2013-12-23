'use strict';

var _ = require('lodash');

var set = require('./set');

var channels = set.create(),
    groups = set.create(),
    users = set.create();

var inform = function (recipients, messages, callback) {
  if (!recipients) {
    throw new Error('Recipients are missing.');
  }
  if (!messages) {
    throw new Error('Messages are missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  recipients = _.flatten([ recipients ]);

  for (var i = 0; i < recipients.length; i++) {
    var recipient = recipients[i];
    if (!groups.get(recipient) && !users.get(recipient)) {
      throw new Error('Unknown recipient \'' + recipient + '\'.');
    }
  }

  for (var channel in messages) {
    if (!channels.get(channel)) {
      throw new Error('Unknown channel \'' + channel + '\'.');
    }
  }

  // Add sending messages to recipients here…
};

inform.use = function (name, channel) {
  if (!name) {
    throw new Error('Name is missing.');
  }
  if (!channel) {
    throw new Error('Channel is missing');
  }
  if (!channel.send) {
    throw new Error('Channel has no \'send\' function.');
  }

  channels.add(name, channel);
};

inform.define = function (name, userOrGroup) {
  if (!name) {
    throw new Error('Name is missing.');
  }
  if (!userOrGroup) {
    throw new Error('Recipient is missing.');
  }

  var recipientType = Array.isArray(userOrGroup) ? 'group' : 'user',
      group = userOrGroup,
      user = userOrGroup;

  switch (recipientType) {
    case 'user':
      for (var channel in user) {
        if (!channels.get(channel)) {
          throw new Error('Unknown channel \'' + channel + '\'.');
        }
      }

      users.add(name, user);
      break;
    case 'group':
      if (group.length === 0) {
        throw new Error('Group is empty.');
      }

      for (var i = 0; i < group.length; i++) {
        var recipient = group[i];
        if (!groups.get(recipient) && !users.get(recipient)) {
          throw new Error('Unknown recipient \'' + recipient + '\'.');
        }
      }

      groups.add(name, group);
      break;
  }
};

module.exports = inform;
