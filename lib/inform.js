'use strict';

var set = require('./set'),
    async = require('async');
    
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

  var status = new inform.Status();

  // Create tuples for user, message, channel
  var todos = [];
  for (var username in actualUsers) {
    var user = actualUsers.get(username);
    for (var channelname in messages) {
      if (channelname in user) {
        todos.push({
          recipient: user[channelname],
          message: messages[channelname],
          channel: channelname
        });
      }
    }
  }


  async.each(todos,
    function(todo) {
      var channel = channels.get(todo.channel);
      channel.send(todo.recipient, todo.message, status.collect);
    },
    function(err) {
      if (err) {
        // Something in our error handling went wrong. Panic!
        throw new Error(err);
      }
      callback(status);
    });

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

inform.Status = function (ok, username, channel, timestamp) {
  
  this.ok = ok;
  this.username = username;
  this.channel = channel;
  
  if (timestamp) {
    this.timestamp = timestamp;
  }
  else {
    this.timestamp = new Date().getTime();
  }
  this.start = this.timestamp;

  this.collect = function (status) {
    this.ok = this.ok && status.ok;
    if (this.timestamp < status.timestamp) {
      this.timestamp = status.timestamp;
    }
    if (this.children) {
      this.children.push(status);
    }
    else {
      this.children = [status];
    }
  };

  this.duration = function () {
    return this.start - this.timestamp;
  };
};



module.exports = inform;
