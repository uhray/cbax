
var utils = module.exports = exports = {};

utils.arg_array = function(args) {
  return Array.prototype.slice.call(args, 0);
}

utils.merge = function(a, b) {
  for (var k in b) { a[k] = b[k]; }
}

