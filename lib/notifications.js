/* Includes */

require("coffee-script");
var tty = require("tty");
var T = require("node-term-ui").TermUI;

var DZ;
exports.init = function(aDZ) { DZ = aDZ; }

exports.log = function(str) {
  T.out("");
  print("" + str, T.C.x, T.C.x);
}

exports.error = function(str) {
  print("" + str, T.C.r, T.C.k);
}

function print(str, fg, bg) {
  var dim = tty.getWindowSize(process);
  var col = dim[1];

  T.pos(1, col - 1);
  T.eraseLine();
  T.fg(fg).bg(bg).out(m(str, col));
  /* FIXME (setTimeout?): T.once("keypress", function() {
    T.eraseLine();
  });*/
  T.fg(T.C.x).bg(T.C.x);
}

var m = function limitedString(str, max) {
  return str.substr(0, max);
}
