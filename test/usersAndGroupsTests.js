'use strict';

var assert = require('node-assertthat');

var usersAndGroups = require('../lib/usersAndGroups');

suite('usersAndGroups', function () {
  test('is an object.', function () {
    assert.that(usersAndGroups, is.ofType('object'));
  });

  suite('create', function () {
    test('is a function.', function () {
      assert.that(usersAndGroups.create, is.ofType('function'));
    });

    test('returns an object.', function () {
      assert.that(usersAndGroups.create(), is.ofType('object'));
    });
  });

  suite('addUser', function () {
    test('is a function.', function () {
      var temp = usersAndGroups.create();
      assert.that(temp.addUser, is.ofType('function'));
    });

    test('throws an exception if no user name is given.', function () {
      var temp = usersAndGroups.create();
      assert.that(function () {
        temp.addUser('', {});
      }, is.throwing());
    });

    test('throws an exception if no user data is given.', function () {
      var temp = usersAndGroups.create();
      assert.that(function () {
        temp.addUser('6c550720-a5c7-4722-922d-eaaf5af91f8c', undefined);
      }, is.throwing());
    });

    test('throws an exception if the same user name is added twice.', function () {
      var temp = usersAndGroups.create();
      temp.addUser('f701b2ec-2b6d-42ca-a654-d844c7c003cf', {});
      assert.that(function () {
        temp.addUser('f701b2ec-2b6d-42ca-a654-d844c7c003cf', {});
      }, is.throwing());
    });
  });

  suite('addGroup', function () {
    test('is a function.', function () {
      var temp = usersAndGroups.create();
      assert.that(temp.addGroup, is.ofType('function'));
    });

    test('throws an exception if no group name is given.', function () {
      var temp = usersAndGroups.create();
      assert.that(function () {
        temp.addGroup('', {});
      }, is.throwing());
    });

    test('throws an exception if no users are given.', function () {
      var temp = usersAndGroups.create();
      assert.that(function () {
        temp.addGroup('0901f950-7fb8-4ecb-90b5-261011a9c4b3', undefined);
      }, is.throwing());
    });

    test('throws an exception if an empty list of users is given.', function () {
      var temp = usersAndGroups.create();
      assert.that(function () {
        temp.addGroup('0901f950-7fb8-4ecb-90b5-261011a9c4b3', []);
      }, is.throwing());
    });

    test('throws an exception if a given user does not exist.', function () {
      var temp = usersAndGroups.create();
      assert.that(function () {
        temp.addGroup('0901f950-7fb8-4ecb-90b5-261011a9c4b3', [ '76635a8d-edba-4a58-ba67-4c74f76457ac' ]);
      }, is.throwing());
    });

    test('throws an exception if the same group name is added twice.', function () {
      var temp = usersAndGroups.create();
      temp.addUser('46bd373b-4310-41a3-8ed0-354299ab5c8d', {});
      temp.addGroup('442193f6-c135-4f01-bf08-090bc031fb80', [ '46bd373b-4310-41a3-8ed0-354299ab5c8d' ]);
      assert.that(function () {
        temp.addGroup('442193f6-c135-4f01-bf08-090bc031fb80', [ 'becf6a0f-bdfe-4541-98c6-c24f133a51c7' ]);
      }, is.throwing());
    });
  });

  suite('getUsers', function () {
    test('is a function.', function () {
      var temp = usersAndGroups.create();
      assert.that(temp.getUsers, is.ofType('function'));
    });

    test('returns a list with a single user when a single user is given.', function () {
      var temp = usersAndGroups.create();
      temp.addUser('9bb3ac69-b5fd-4106-a6be-a02162a86acb', { foo: 'bar' });
      var actual = temp.getUsers([ '9bb3ac69-b5fd-4106-a6be-a02162a86acb' ]);
      assert.that(actual, is.equalTo({
        '9bb3ac69-b5fd-4106-a6be-a02162a86acb': { foo: 'bar' }
      }));
    });

    test('returns a list with multiple users when multiple users are given.', function () {
      var temp = usersAndGroups.create();
      temp.addUser('bf50224b-0fe1-4afe-97f0-d88d12a74545', { foo: 'bar' });
      temp.addUser('26be0111-9345-4071-b24f-f0c0cb827a51', { baz: 'bas' });
      var actual = temp.getUsers([
        'bf50224b-0fe1-4afe-97f0-d88d12a74545',
        '26be0111-9345-4071-b24f-f0c0cb827a51'
      ]);
      assert.that(actual, is.equalTo({
        'bf50224b-0fe1-4afe-97f0-d88d12a74545': { foo: 'bar' },
        '26be0111-9345-4071-b24f-f0c0cb827a51': { baz: 'bas' }
      }));
    });

    test('returns a list with multiple users when a group is given.', function () {
      var temp = usersAndGroups.create();
      temp.addUser('4e6d1fdb-770d-4f36-8456-b2a7cd15e854', { foo: 'bar' });
      temp.addUser('33d76f96-511e-41fa-9bbb-92aeb584427a', { baz: 'bas' });
      temp.addGroup('76ce3647-df06-4006-9b12-332686409354', [
        '4e6d1fdb-770d-4f36-8456-b2a7cd15e854',
        '33d76f96-511e-41fa-9bbb-92aeb584427a'
      ]);
      var actual = temp.getUsers([ '76ce3647-df06-4006-9b12-332686409354' ]);
      assert.that(actual, is.equalTo({
        '4e6d1fdb-770d-4f36-8456-b2a7cd15e854': { foo: 'bar' },
        '33d76f96-511e-41fa-9bbb-92aeb584427a': { baz: 'bas' }
      }));
    });

    test('returns a list with multiple users when multiple groups are given.', function () {
      var temp = usersAndGroups.create();

      temp.addUser('0fab50e1-1cf3-4699-a45a-b524d9ee4e7c', { foo: 'bar' });
      temp.addGroup('a156a1c7-7204-4a39-8b3a-76b2f954f411', [ '0fab50e1-1cf3-4699-a45a-b524d9ee4e7c' ]);

      temp.addUser('fe5eaf1f-4d5a-4622-83ef-36e9fbf4290a', { baz: 'bas' });
      temp.addGroup('7430c8e9-f987-4307-a684-292a7f30bb6a', [ 'fe5eaf1f-4d5a-4622-83ef-36e9fbf4290a' ]);

      var actual = temp.getUsers([
        'a156a1c7-7204-4a39-8b3a-76b2f954f411',
        '7430c8e9-f987-4307-a684-292a7f30bb6a'
      ]);
      assert.that(actual, is.equalTo({
        '0fab50e1-1cf3-4699-a45a-b524d9ee4e7c': { foo: 'bar' },
        'fe5eaf1f-4d5a-4622-83ef-36e9fbf4290a': { baz: 'bas' }
      }));
    });

    test('returns a list with multiple users when a mixture of users and groups is given.', function () {
      var temp = usersAndGroups.create();

      temp.addUser('2909d5dc-13a9-4cfb-bf49-559a6cf73496', { foo: 'bar' });

      temp.addUser('8ffbab8a-ce53-4688-a8d4-9c613f05c424', { baz: 'bas' });
      temp.addGroup('a9bee0b1-bd6a-4c0b-8b2d-d8ee2173d11f', [ '8ffbab8a-ce53-4688-a8d4-9c613f05c424' ]);

      var actual = temp.getUsers([
        '2909d5dc-13a9-4cfb-bf49-559a6cf73496',
        'a9bee0b1-bd6a-4c0b-8b2d-d8ee2173d11f'
      ]);
      assert.that(actual, is.equalTo({
        '2909d5dc-13a9-4cfb-bf49-559a6cf73496': { foo: 'bar' },
        '8ffbab8a-ce53-4688-a8d4-9c613f05c424': { baz: 'bas' }
      }));
    });

    test('throws an exception if a non-existent user or group is given.', function () {
      var temp = usersAndGroups.create();
      assert.that(function () {
        temp.getUsers([ '3b53e5d3-8e80-4501-81dd-af460ef12879' ]);
      }, is.throwing());
    });
  });
});
