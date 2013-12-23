'use strict';

var _ = require('lodash');

var set = require('./set');

var groups = set.create(),
    users = set.create();

var usersAndGroups = {
  create: function () {
    return {
      addUser: function (name, data) {
        if (!data) { throw new Error('User data is missing.'); }
        users.add(name, data);
      },

      addGroup: function (name, usersInGroup) {
        if (!usersInGroup) { throw new Error('Users are missing.'); }
        if (usersInGroup.length === 0) { throw new Error('Users are missing.'); }

        for (var i = 0; i < usersInGroup.length; i++) {
          var user = usersInGroup[i];
          if (!users.get(user)) { throw new Error('Unknown user \'' + user + '\'.'); }
        }

        groups.add(name, usersInGroup);
      },

      getUsers: function (usersAndGroups) {
        usersAndGroups = _.flatten([ usersAndGroups ]);

        var actualUsers = {};

        for (var i = 0; i < usersAndGroups.length; i++) {
          var potentialUser = users.get(usersAndGroups[i]),
              potentialGroup = groups.get(usersAndGroups[i]);

          if (potentialUser) {
            actualUsers[usersAndGroups[i]] = potentialUser;
            continue;
          }

          if (potentialGroup) {
            actualUsers = _.assign(actualUsers, this.getUsers(potentialGroup));
            continue;
          }

          throw new Error('The user or group \'' + usersAndGroups[i] + '\'.');
        }

        return actualUsers;
      }
    };
  }
};

module.exports = usersAndGroups;
