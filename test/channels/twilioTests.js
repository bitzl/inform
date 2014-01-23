'use strict';

var assert = require('node-assertthat'),
    proxyquire = require('proxyquire');

var twilio = proxyquire('../../lib/channels/twilio', {
  twilio: function (id, token) {
    return {
      sendMessage: function (options, callback) {
        assert.that(id, is.equalTo('foo'));
        assert.that(token, is.equalTo('bar'));
        assert.that(options.to, is.equalTo('+49...'));
        assert.that(options.from, is.equalTo('+41...'));
        assert.that(options.body, is.equalTo('foobar'));
        callback(null);
      }
    };
  }
});

suite('twilio', function () {
  test('is a function.', function () {
    assert.that(twilio, is.ofType('function'));
  });

  test('throws an error if no options are given.', function () {
    assert.that(function () {
      twilio();
    }, is.throwing());
  });

  test('returns an object.', function () {
    var actual = twilio({});
    assert.that(actual, is.ofType('object'));
  });

  suite('send', function () {
    test('calls sendMessage on twilio module.', function (done) {
      var actual = twilio({
        id: 'foo',
        token: 'bar',
        from: '+41...'
      });
      actual.send('+49...', 'foobar', done);
    });
  });
});
