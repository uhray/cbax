
var utils = require('./utils'),
    middleware = require('./middleware'),
    events = require('events');

exports = module.exports = CBax();

function CBax() {
  var mw = utils.arg_array(arguments),
      cb = function() {
        var fns = [];
        fns.push.apply(fns, mw);
        fns.push.apply(fns, utils.arg_array(arguments));
        return function(e, d) {
          function next(_e, _d) {
            var fn = fns.shift();
            if (arguments.length >= 1) e = _e;
            if (arguments.length >= 2) d = _d;
            fn && fn(e, d, next, cb);
            !fn && cb.emit('stop', cb, e, d);
          };
          cb.emit('start', cb, e, d);
          next();
        }
      }

  cb.__middleware = mw;
  cb.use = function() {
    mw.push.apply(mw, utils.arg_array(arguments));
  }

  cb.copy = function() {
    return CBax.apply(this, mw);
  }

  cb.fresh = function() {
    return CBax.apply(this, arguments);
  }

  utils.merge(cb, middleware);
  utils.merge(cb, events.EventEmitter.prototype);

  return cb;
}
