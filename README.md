CBAX Library
===============

Cbax is a simple library for creating callback streams that operate like connect middleware. It works for callbacks that expect to be called with (error, data).

Install with `npm install cbax@git+ssh://git@github.com:uhray/cbax.git`.

### Simple Example

```js
var cbax = require('./cbax'),
    fs = require('fs');

// Middleware that ensures no error and there is data
cbax.use(cbax.clean);

fs.readFile('file.txt', cbax(function(e, d) {
  console.log('got data:', d);
}));

```

### API

<a name="use" href="#use">#</a> cbax.<b>use</b>(<i>callback</i>, [cb2, cb3...])

Adds <i>callback</i> and all other arguments to the middleware chain.

<a name="copy" href="#copy">#</a> cbax.<b>copy</b>()

Creates a copy of the cbax object with the same middleware. This allows you to create a new cbax object from the original, add a bunch of middleware, and use it multiple times. I suggest adding middleware that you want globally, and then create a copy for each page or module to use with additional middleware.

<a name="fresh" href="#fresh">#</a> cbax.<b>fresh</b>([<i>callback</i>, cb2, cb3...])

Create a new cbax object with no middleware other than the optional <i>callback</i> values provided as arguments here.

<a name="call" href="#call">#</a> <b>cbax</b>([<i>callback</i>, cb2, cb3...])

Returns a function with all the preset middleware plus the provided <i>callbacks</i> here. This is the callback function that should be passed to functions expecting a callback.

### Callback format

Callbacks should expect four arguments: (error, data, next, context)

The error and data will be preserved from the caller of cbax. The next function will continue down the middleware chain. The context is the context of the cbax object.  This context most notably has the <a href="#cb-get">get</a> method to retrieve values associated with this cbax instance.

If you call the next object with values, they will override the original error and data. next('error') will override the error. next('error', 'data') will override both error and data.

The <i>context</i> of the callback will the context set by the function caller.

NEW: you can now change the callback format if your callback does not expect only two arguments, you can change the default. Do `cbax.config.num_args = 7` to set the number of arguments to 7. This means that the `next` and `context` arguments will be the 8th and 9th arguments, respecively.

### Middleware

Cbax comes packaged with some useful middleware that you can add to your middleware chains if you desire.

<a name="mw-log" href="#mw-log">#</a> cbax.<b>log</b>()

Logs the error and data values and then calls next.

<a name="mw-estop" href="#mw-estop">#</a> cbax.<b>estop</b>()

If there is an error, it stops the middleware chain.

<a name="mw-dstop" href="#mw-dstop">#</a> cbax.<b>dstop</b>()

If there is no data, it stops the middleware chain.

<a name="mw-clean" href="#mw-clean">#</a> cbax.<b>clean</b>()

Stops the chain unless there is data and is no error. This is the same as using both estop and dstop.

### Events

The cbax object is an event emitter. This means you can listen for the following events.

<a name="ev-start" href="#ev-start">#</a> cbax.<b>on</b>('start', <i>callback</i>)

This is called when a callback chain is first called. It is called with the (error, data) values and the context is the cbax context.

<a name="ev-stop" href="#ev-stop">#</a> cbax.<b>on</b>('stop', <i>callback</i>)

This is called when a callback chain is done. It is called with the first argument as the array of arguments that would be passed down the middleware chain.

### SetGet

The cbax object has setters and getters. This offers two API methods:


<a name="cb-set" href="#cb-set">#</a> cbax.<b>set</b>(<i>key</i>, <i>value</i>)

Sets the key-value pair on the object so that callback functions can be configured with more information than just the value in the argument array.

<a name="cb-get" href="#cb-get">#</a> cbax.<b>get</b>(<i>key</i>)

Retrieves the value associate with this key (values set using the <b>set</b> method).

### Future Work

* More prepackaged middleware
* More events of use
