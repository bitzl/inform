'use strict';

var set = {
  create: function () {
    var data = {};

    return {
      add: function (key, value) {
        if (!key) { throw new Error('key is missing.'); }
        if (data[key]) { throw new Error('key is already being used.'); }

        data[key] = value;
      },

      get: function (key) {
        if (!key) { throw new Error('key is missing.'); }

        return data[key];
      }
    };
  }
};

module.exports = set;
