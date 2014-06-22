
var utools = require('utools'),
    events = require('events'),
    utils = require('./utils'),
    middleware = require('./middleware');

exports = module.exports = CBax();

function CBax() {
  var mw = utils.arg_array(arguments),
      cb = function() {
        var fns = [];
        fns.push.apply(fns, mw);
        fns.push.apply(fns, utils.arg_array(arguments));
        return function() {
          var args = utils.arg_array(arguments),
              cfg = cb.config,
              idx = 0,
              self = this;

          while (args.length < cfg.num_args + 2) args.push(undefined);
          function next(_e, _d) {
            var fn = fns[idx++],
                i=0;

            // can override
            while (i < arguments.length) args[i] = arguments[i++];
            args[cfg.num_args] = next;
            args[cfg.num_args + 1] = cb;

            fn && fn.apply(self, args);
            !fn && cb.emit('stop', args);
          };
          cb.emit('start', args);
          next();
        }
      }

  cb.__middleware = mw;

  cb.config = { num_args: 2 }

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
  utils.merge(cb, utools.setget.prototype);

  return cb;
}

