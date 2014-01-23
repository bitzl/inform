# inform

inform sends notifications using various channels.

If you have any questions or feedback, feel free to contact us using [@goloroden](https://twitter.com/goloroden) and [@MarcusBitzl](https://twitter.com/MarcusBitzl) on Twitter.

## Installation

    $ npm install inform

## Quick start

The first thing you need to do is to add a reference to the inform module to your application.

```javascript
var inform = require('inform');
```

### Configuring channels

Next you need to define communication channels, e.g. for sending e-mails or text messages. For that call the module's `use` function and specify a name for the channel and an object that provides a `send` function.

```javascript
inform.use('foo', {
  send: function (recipient, message, callback) {
    // ...
  }
});
```

In case you need to configure a channel before using it you can create a setup function that returns the initialized object and use that setup function inside the call to the `use` function.

```javascript
var setupChannel = function (options) {
  return {
    send: function (recipient, message, callback) {
      // ...
    }
  };
};

inform.use('foo', setupChannel({ ... }));
```

### Defining users and groups

Now you need to define users and groups you would to communicate with. To define a user call the module's `define` function and specify a name and an object that describes one or more communication endpoints of the user.

```javascript
inform.define('John Doe', {
  'sms': '+49...'
});
```

To define a group call the `define` function as well, but instead of a configuration object provide an array which contains the user names you would like the group to contain.

```javascript
inform.define('users', [
  'John Doe',
  'Jane Doe'
]);
```

Please note that you can arbitrarily mix user and group names within the members of a group, i.e. a group can contain other groups. This way you are able to easily build up complex systems of users and groups.

### Notifying users

To notify a user or a group of users, call the `inform` function itself and provide the name of the user or group you would like to communicate with and an object that contains the message data for the channels you would like to use.

```javascript
inform('John Doe', {
  'sms': 'Alert! An intrusion has been detected!'
}, function (err) {
  // ...
});
```

Instead of a user name you can also provide a group name or an array with multiple user and / or group names.

### Sending text messages using Twilio

To send a text message use the module's built-in `twilio` channel. To use it you need a configured [Twilio](https://www.twilio.com/) account and its ID and secret.

```javascript
inform.use('sms', inform.twilio({
  id: '...',
  token: '...',
  from: '+49...'
}));
```

To send a text message, you only need to provide the text.

```javascript
inform('...', {
  'sms': '...'
}, function (err) {
  // ...
});
```

## Running the tests

inform has been developed using TDD. To run the tests, go to the folder where you have installed inform to and run `npm test`. You need to have [mocha](https://github.com/visionmedia/mocha) installed.

    $ npm test

Additionally, this module can be built using [Grunt](http://gruntjs.com/). Besides running the tests, Grunt also analyses the code using [JSHint](http://www.jshint.com/). To run Grunt, go to the folder where you have installed inform and run `grunt`. You need to have [grunt-cli](https://github.com/gruntjs/grunt-cli) installed.

    $ grunt

## License

The MIT License (MIT)
Copyright (c) 2013-2014 Golo Roden and Marcus Bitzl.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
