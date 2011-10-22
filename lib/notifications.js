/* Includes */

require("coffee-script");
var tty = require("tty");
var T = require("node-term-ui").TermUI;

exports.log = function(str) {
  print("" + str, T.C.x, T.C.x);
}

exports.error = function(str) {
  print("" + str, T.C.r, T.C.k);
}

function print(str, fg, bg) {
  var dim = tty.getWindowSize(process);
  var row = dim[0];
  var col = dim[1];

  var offset = col - str.length;
  offset = Math.max(0, offset);

  T.pos(offset,col - 1);
  T.eraseLine();
  T.fg(fg).bg(bg).out(m(str, col));
}

var m = function limitedString(str, max) {
  return str.substr(0, max);
}
