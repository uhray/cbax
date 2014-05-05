
var mw = module.exports = exports = {};

mw.log = function CBax_log(e, d, next) {
  console.log('Error:', e);
  console.log('Data:', d);
  next();
}


// estop - Stops if there is an error
mw.estop = function CBax_estop(e, d, next) {
  if (!e) return next();
}

// dstop - Stops if there is no data
mw.dstop = function CBax_dstop(e, d, next) {
  if (d) return next();
}

// estop - Stops if there is no data or there is an error
mw.clean = function CBax_clean(e, d, next) {
  if (!e && d) return next();
}

