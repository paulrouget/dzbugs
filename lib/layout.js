var tty = require("tty");
var T = require("node-term-ui").TermUI;
var notify = require("./notifications.js");

const COLOR_REGEX = /(#\{[^\}]+\})/;

exports.layout = {
  init: function(store, formater) {
    T.clear();

    T.on('resize', function (dim) {
      this.width = dim.w;
      this.height = dim.h;
      this.redrawAll();
    }.bind(this));

    this.store = store;
    this.formater = formater;
    var dim = tty.getWindowSize(process);
    this.width = dim[1];
    this.height = dim[0];
  },
  sidebarWidth: 0,
  newBugs: function(bugs) {
    T.clear();
    var y = 0;
    for (var i in bugs) {
      this.drawBug(bugs[i], y++);
    }
  },
  redrawAll: function() {
    T.clear();
    var bugs = this.store.getAllStoredBugs();
    var y = 0;
    for (var i in bugs) {
      this.drawBug(bugs[i], y++);
    }
  },
  bugUpdated: function(id) {
  },
  drawBug: function(id, y) {
    var bug = this.store.$(id);
    T.pos(this.sidebarWidth, y);
    T.eraseLine();

    var f = this.formater;

    var room = this.width - this.sidebarWidth;

    T.pos(this.sidebarWidth, y);

    var operations = f.start(bug).split(COLOR_REGEX);
    for (var i = 0; i < operations.length; i++) {
      if (!(i%2)) {
        // draw string
        var str = operations[i];
        if (!str) continue;
        if (str.length > room) {
          str = m(str, room);
          room -= str.length;
          T.out(str);
          break;
        } else {
          room -= str.length;
          T.out(str);
        }
      } else {
        try {
          var color = JSON.parse(operations[i].substr(1));
          if ("fg" in color) T.hifg(color.fg);
          if ("bg" in color) T.hibg(color.bg);
          if ("reset" in color) { T.fg(T.C.x); T.bg(T.C.x) };
        } catch(e) {
          notify.error("formater parse error (start): " + e);
        }
      }
    }

    operations = f.end(bug).split(COLOR_REGEX);
    var totalLength = 0;
    for (var i = 0; i < operations.length; i += 2) {
      totalLength += operations[i].length;
    }

    if (totalLength > room) {
      operations[0] = "…" + operations[0];
      totalLength++;
    }

    room = this.width - this.sidebarWidth;
    if (totalLength < room) {
      T.pos(room - totalLength, y);


      for (var i = 0; i < operations.length; i++) {
        if (!(i%2)) {
          // draw string
          var str = operations[i];
          if (!str) continue;
          T.out(str);
        } else {
          try {
            var color = JSON.parse(operations[i].substr(1));
            if ("fg" in color) T.hifg(color.fg);
            if ("bg" in color) T.hibg(color.bg);
            if ("reset" in color) { T.fg(T.C.x); T.bg(T.C.x) };
          } catch(e) {
            notify.error("formater parse error (end): " + e);
          }
        }
      }
    }
    T.end();
  },
}


var m = function limitedString(str, max) {
  return str.substr(0, max);
}
