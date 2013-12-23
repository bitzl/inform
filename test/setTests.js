'use strict';

var assert = require('node-assertthat');

var set = require('../lib/set');

suite('set', function () {
  test('is an object.', function () {
    assert.that(set, is.ofType('object'));
  });

  suite('create', function () {
    test('is a function.', function () {
      assert.that(set.create, is.ofType('function'));
    });

    test('returns a set.', function () {
      var actual = set.create();
      assert.that(actual, is.ofType('object'));
      assert.that(actual.add, is.not.undefined());
      assert.that(actual.get, is.not.undefined());
    });
  });

  suite('add', function () {
    test('throws an exception if the key is missing.', function () {
      var temp = set.create();
      assert.that(function () {
        temp.add(undefined, 'foo');
      }, is.throwing());
    });

    test('throws an exception if the same key is used twice.', function () {
      var temp = set.create();
      temp.add('foo', 'bar');
      assert.that(function () {
        temp.add('foo', 'baz');
      }, is.throwing());
    });
  });

  suite('get', function () {
    test('throws an exception if the key is missing.', function () {
      var temp = set.create();
      assert.that(function () {
        temp.get(undefined);
      }, is.throwing());
    });

    test('returns undefined for a non-existent key.', function () {
      var temp = set.create();
      assert.that(temp.get('foo'), is.undefined());
    });

    test('returns the vaue for an existing key.', function () {
      var temp = set.create();
      temp.add('foo', 'bar');
      assert.that(temp.get('foo'), is.equalTo('bar'));
    });
  });
});
