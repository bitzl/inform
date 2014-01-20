'use strict';

var async = require('async');

var set = require('./set');

var channels = set.create(),
    usersAndGroups = require('./usersAndGroups').create();

var inform = function (recipients, messages, callback) {
  if (!recipients) { throw new Error('Recipients are missing.'); }
  if (!messages) { throw new Error('Messages are missing.'); }
  if (!callback) { throw new Error('Callback is missing.'); }

  var users = usersAndGroups.getUsers(recipients),
      userNames = Object.keys(users),
      channelNames = Object.keys(messages);

  channelNames.forEach(function (channelName) {
    if (!channels.get(channelName)) {
      throw new Error('Channel \'' + channelName + '\' does not exist.');
    }
  });

  async.each(userNames, function (userName, callbackUser) {
    async.each(channelNames, function (channelName, callbackChannel) {
      channels.get(channelName).send(
        users[userName][channelName],
        messages[channelName],
        callbackChannel
      );
    }, callbackUser);
  }, callback);
};

inform.use = function (name, channel) {
  if (!name) { throw new Error('Name is missing.'); }
  if (!channel) { throw new Error('Channel is missing'); }
  if (!channel.send) { throw new Error('Channel has no \'send\' function.'); }

  channels.add(name, channel);
};

inform.define = function (name, recipient) {
  if (!name) { throw new Error('Name is missing.'); }
  if (!recipient) { throw new Error('Recipient is missing.'); }

  if (Array.isArray(recipient)) {
    return usersAndGroups.addGroup(name, recipient);
  }

  for (var channel in recipient) {
    if (!channels.get(channel)) { throw new Error('Unkown channel \'' + channel + '\'.'); }
  }
  usersAndGroups.addUser(name, recipient);
};

inform.twilio = require('./channels/twilio');

module.exports = inform;
