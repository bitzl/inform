'use strict';

var assert = require('node-assertthat');

var inform = require('../lib/inform');

suite('inform', function () {
  test('is a function.', function () {
    assert.that(inform, is.ofType('function'));
  });

  test('throws an exception when no recipient is given.', function () {
    assert.that(function () {
      inform(undefined, {}, function () {});
    }, is.throwing());
  });

  test('throws an exception when no message object is given.', function () {
    assert.that(function () {
      inform('600b75bf-3490-4a93-94d9-117d0ded80d5', undefined, function () {});
    }, is.throwing());
  });

  test('throws an exception when no callback is given.', function () {
    assert.that(function () {
      inform('c382eed5-05b7-4c8e-8df3-53bf34d923d0', {}, undefined);
    }, is.throwing());
  });

  test('throws an exception when a non-existent recipient is given as single user.', function () {
    assert.that(function () {
      inform('ca8739c2-71b2-4464-806d-51e63896f821', {}, function () {});
    }, is.throwing());
  });

  test('throws an exception when a non-existent recipient is given within an array.', function () {
    inform.define('39994f4d-bba0-4aab-9c6e-292d2eecdea4', {});

    assert.that(function () {
      inform([
        '39994f4d-bba0-4aab-9c6e-292d2eecdea4',
        'd9e215eb-3022-4304-9f70-ecb56b7b8ec7'
      ], {}, function () {});
    }, is.throwing());
  });

  test('throws an exception when a non-existent channel is given.', function () {
    inform.define('91d99d5c-4905-4082-be7c-7f10c213afdc', {});

    assert.that(function () {
      inform('91d99d5c-4905-4082-be7c-7f10c213afdc', {
        '4e0c46de-8215-4bc3-974f-6dfae66de4ec': 'some message'
      }, function () {});
    }, is.throwing());
  });

  test('actually sends …');

  suite('use', function () {
    test('is a function.', function () {
      assert.that(inform.use, is.ofType('function'));
    });

    test('throws an exception when no channel name is given.', function () {
      assert.that(function () {
        inform.use('', {
          send: function () {}
        });
      }, is.throwing());
    });

    test('throws an exception when no channel object is given.', function () {
      assert.that(function () {
        inform.use('ddbc7723-45f0-4f70-b57d-a4f3e0a32a26', undefined);
      }, is.throwing());
    });

    test('throws an exception when channel object does not fulfill channel contract.', function () {
      assert.that(function () {
        inform.use('73f588e6-ca5e-43da-85fc-6cad077fbb33', {});
      }, is.throwing());
    });

    test('throws an exception when a channel name is used twice.', function () {
      inform.use('447a24f3-6ddd-487c-9acb-d43d33fc94d3', {
        send: function () {}
      });

      assert.that(function () {
        inform.use('447a24f3-6ddd-487c-9acb-d43d33fc94d3', {
          send: function () {}
        });
      }, is.throwing());
    });
  });

  suite('define', function () {
    test('is a function.', function () {
      assert.that(inform.define, is.ofType('function'));
    });

    test('throws an exception when no recipient name is given.', function () {
      assert.that(function () {
        inform.define('', {});
      }, is.throwing());
    });

    test('throws an exception when no recipient is given.', function () {
      assert.that(function () {
        inform.define('8f63fa0e-71f3-45ac-b8a7-88cc5e6b525b', undefined);
      }, is.throwing());
    });

    test('throws an exception when a recipient name is used twice.', function () {
      inform.define('5188f33b-8bd2-401d-87d9-f791eb0684eb', {});

      assert.that(function () {
        inform.define('5188f33b-8bd2-401d-87d9-f791eb0684eb', {});
      }, is.throwing());
    });

    suite('users', function () {
      test('throws an exception when a recipient tries to use a non-existent channel.', function () {
        assert.that(function () {
          inform.define('f3c5796a-fc0f-43a9-bb1f-11f4d7ebfbba', {
            'b163a098-2de1-474b-b719-70a4d1fd0c83': 'some contact data'
          });
        }, is.throwing());
      });

      test('does not throw an exception when a recipient tries to use an existing channel.', function () {
        inform.use('8facabcf-e6b9-4b93-9722-fa317dbc2b6e', {
          send: function () {}
        });

        assert.that(function () {
          inform.define('39d63dbf-4346-428e-b2ca-2df12b76054b', {
            '8facabcf-e6b9-4b93-9722-fa317dbc2b6e': 'some contact data'
          });
        }, is.not.throwing());
      });
    });

    suite('groups', function () {
      test('throws an exception when you try to define an empty group.', function () {
        assert.that(function () {
          inform.define('1230508d-f540-4a3b-8bb3-146f36ad2e67', []);
        }, is.throwing());
      });

      test('throws an exception when you try to use non-existent users in a group.', function () {
        assert.that(function () {
          inform.define('b91c7af9-81f0-49ea-9558-27d5ce4c6721', [ '4a05189e-6888-412e-8e78-7f4c02e07cc2' ]);
        }, is.throwing());
      });

      test('does not throw an exception when you try to define a group with existing users.', function () {
        inform.define('0fc7655b-e9a5-499f-b81f-a382e92bb024', {});
        inform.define('396b4cc5-2084-4b47-80c9-ed95c2ebffe6', {});

        assert.that(function () {
          inform.define('2cf07517-af7a-4e47-8190-8f11fda6c900', [
            '0fc7655b-e9a5-499f-b81f-a382e92bb024',
            '396b4cc5-2084-4b47-80c9-ed95c2ebffe6'
          ]);
        }, is.not.throwing());
      });
    });
  });

  suite('errors', function() {
    test('throws an exception when you leave the user out', function() {
      assert.that(function() {
        /*jshint -W031 */
        new inform.ErrorMessage(
          undefined,
          '35159e3b-2b16-42e8-b452-c8914d2011e1',
          '9ffac53a-b9b9-4001-a8a2-5ecaaf2aed05'
        );
      }, is.throwing());
    });

    test('throws an exception when you leave the channel out', function() {
      assert.that(function() {
        /*jshint -W031 */
        new inform.ErrorMessage(
          '3d0b9a48-8ec9-43fe-b8e2-99eadfa7d8c3',
          undefined,
          'f8366188-2726-4eed-aeb1-59379dc92bae'
        );
      }, is.throwing());
    });

    test('throws an exception when you leave the message out', function() {
      assert.that(function() {
        /*jshint -W031 */
        new inform.ErrorMessage(
          '3d0b9a48-8ec9-43fe-b8e2-99eadfa7d8c3',
          'f8366188-2726-4eed-aeb1-59379dc92bae',
          undefined
        );
      }, is.throwing());
    });

    test('constructor sets the user', function() {
      var error = new inform.ErrorMessage(
        '0241f1f3-0245-41cd-a41d-b0de574ffa27',
        '3821116e-affa-41e5-b458-1c81d20825fb',
        '09d78042-9b6f-4935-a89f-c58b88587b48'
      );
      assert.that(error.user, is.equalTo('0241f1f3-0245-41cd-a41d-b0de574ffa27'));
    });

    test('constructor sets the channel', function() {
      var error = new inform.ErrorMessage(
        '0241f1f3-0245-41cd-a41d-b0de574ffa27',
        '3821116e-affa-41e5-b458-1c81d20825fb',
        '09d78042-9b6f-4935-a89f-c58b88587b48'
      );
      assert.that(error.channel, is.equalTo('3821116e-affa-41e5-b458-1c81d20825fb'));
    });
      
    test('constructor sets the message', function() {
      var error = new inform.ErrorMessage(
        '0241f1f3-0245-41cd-a41d-b0de574ffa27',
        '3821116e-affa-41e5-b458-1c81d20825fb',
        '09d78042-9b6f-4935-a89f-c58b88587b48'
      );
      assert.that(error.message, is.equalTo('09d78042-9b6f-4935-a89f-c58b88587b48'));
    });
      
    test('constructor sets the error code', function() {
      var error = new inform.ErrorMessage(
        '0241f1f3-0245-41cd-a41d-b0de574ffa27',
        '3821116e-affa-41e5-b458-1c81d20825fb',
        '09d78042-9b6f-4935-a89f-c58b88587b48',
        { code: '34234a88-eab5-4dc3-a727-8cf070fdb706' }
      );
      assert.that(error.more.code, is.equalTo('34234a88-eab5-4dc3-a727-8cf070fdb706'));
    });
      
    test('constructor sets the actual time', function() {
      var error = new inform.ErrorMessage(
        '0241f1f3-0245-41cd-a41d-b0de574ffa27',
        '3821116e-affa-41e5-b458-1c81d20825fb',
        '09d78042-9b6f-4935-a89f-c58b88587b48'
      );
      var now = new Date().getTime();
      assert.that(error.timestamp, is.between(now - 100, now + 100));
    });

    test('constructor takes timestamp from "more" object', function() {
      var error = new inform.ErrorMessage(
        '0241f1f3-0245-41cd-a41d-b0de574ffa27',
        '3821116e-affa-41e5-b458-1c81d20825fb',
        '09d78042-9b6f-4935-a89f-c58b88587b48',
        { timestamp : 4728947298924}
      );
      assert.that(error.timestamp, is.equalTo(4728947298924));
    });

    test('more is usually undefined', function() {
      var error = new inform.ErrorMessage(
        '0241f1f3-0245-41cd-a41d-b0de574ffa27',
        '3821116e-affa-41e5-b458-1c81d20825fb',
        '09d78042-9b6f-4935-a89f-c58b88587b48'
      );
      assert.that(error.more, is.equalTo(undefined));
    });
  });
});
