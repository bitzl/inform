'use strict';

var set = require('./set');

var channels = set.create(),
    usersAndGroups = require('./usersAndGroups').create();

var inform = function (recipients, messages, callback) {
  if (!recipients) { throw new Error('Recipients are missing.'); }
  if (!messages) { throw new Error('Messages are missing.'); }
  if (!callback) { throw new Error('Callback is missing.'); }

  var actualUsers = usersAndGroups.getUsers(recipients);
  console.log(actualUsers);

  for (var channel in messages) {
    if (!channels.get(channel)) {
      throw new Error('Unknown channel \'' + channel + '\'.');
    }
  }

  // Add sending messages to recipients here…
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

inform.ErrorMessage = function (user, channel, message, more) {
  if (!user) { throw new Error('User is missing'); }
  if (!channel) { throw new Error('Channel is missing'); }
  if (!message) { throw new Error('Message is missing'); }
  
  this.user = user;
  this.channel = channel;
  this.message = message;
  this.more = more;
  
  if (more && more.timestamp) {
    this.timestamp = more.timestamp;
  }
  else {
    this.timestamp = new Date().getTime();
  }
};

module.exports = inform;
