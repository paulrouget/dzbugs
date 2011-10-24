var DZ, T; exports.init = function(aDZ) { DZ = aDZ; T = DZ.term}

exports.log = function(str) {
  T.out("");
  print("" + str, T.C.x, T.C.x);
}

exports.error = function(str) {
  print("" + str, T.C.r, T.C.k);
}

function print(str, fg, bg) {
  T.pos(1, DZ.layout.height + 1);
  T.eraseLine();
  T.fg(fg).bg(bg).out(m(str, DZ.layout.width));
  T.fg(T.C.x).bg(T.C.x);
  DZ.layout.hideCursor();
}

var m = function limitedString(str, max) {
  return str.substr(0, max);
}
