var tty = require("tty");
var T = require("node-term-ui").TermUI;
var notify = require("./notifications.js");

const COLOR_REGEX = /(#\{[^\}]+\})/;

exports.layout = {
  cursor: 2,
  sidebarWidth: 0,
  scrollY: 0,
  init: function(store, formater) {
    T.clear();

    T.on('resize', function (dim) {
      this.width = dim.w;
      this.height = dim.h - 1;
      this.redrawAll();
    }.bind(this));

    this.lines2bugs = [];
    this.bugs2lines = {};

    this.store = store;
    this.formater = formater;

    var dim = tty.getWindowSize(process);
    this.width = dim[1];
    this.height = dim[0] - 1;
  },
  newBugs: function() {
    this.redrawAll();
  },
  redrawAll: function() {
    T.clear();
    this.lines2bugs = [];
    this.bugs2lines = {};

    var bugs = this.store.getRange(this.scrollY, this.height - 1, null);
    if (this.cursor >= bugs.length) {
      this.cursor = bugs.length - 1;
    }
    for (var i = 0; i < bugs.length; i++) {
      this.drawLine(bugs[i], i);
    }
  },
  scroll: function(lines) {
    if (this.scrollY + lines < 0) return;
    this.cursor -= lines;
    this.scrollY += lines;
    this.redrawAll();
  },
  selectPreviousBug: function() {
    if (this.cursor <= 0) return;
    if (this.cursor <= 4) {
      this.scroll(-1);
    }

    var previousBugId = this.lines2bugs[this.cursor];
    this.cursor--;
    this.drawLine(this.store.$(previousBugId), this.cursor + 1);
    var newBugId = this.lines2bugs[this.cursor];
    this.drawLine(this.store.$(newBugId), this.cursor);
  },
  selectNextBug: function() {
    if (this.cursor >= this.lines2bugs.length - 1) return;
    if (this.cursor >= this.lines2bugs.length - 4) {
      this.scroll(1);
    }

    var previousBugId = this.lines2bugs[this.cursor];
    this.cursor++;
    this.drawLine(this.store.$(previousBugId), this.cursor - 1);
    var newBugId = this.lines2bugs[this.cursor];
    this.drawLine(this.store.$(newBugId), this.cursor);
  },

  bugUpdated: function(id) {
  },
  drawBuffer: function(operations, room) {
    var originalRoom = room;
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
          if ("reset" in color) this.resetColors();
        } catch(e) {
          notify.error("formater parse error (start): " + e);
        }
      }
    }
    return originalRoom - room;
  },
  resetColors: function() {
    T.fg(T.C.x).bg(T.C.x);
  },
  drawLine: function(bug, y) {
    T.pos(1, y + 1);
    T.eraseLine();
    if (!bug) return;

    this.resetColors();
    this.lines2bugs[y] = bug.id;
    this.bugs2lines["_" + bug.id] = y;

    var f = this.formater;

    var room, operations, cursorWidth;


    room = this.width - this.sidebarWidth;
    operations = f.cursor(y == this.cursor).split(COLOR_REGEX);
    cursorWidth = this.drawBuffer(operations, room);

    T.pos(this.sidebarWidth + cursorWidth + 1, y + 1);
    room = this.width - this.sidebarWidth - cursorWidth;
    operations = f.start(bug).split(COLOR_REGEX);
    var startLength = this.drawBuffer(operations, room);

    operations = f.end(bug).split(COLOR_REGEX);
    var totalLength = 0;
    for (var i = 0; i < operations.length; i += 2) {
      totalLength += operations[i].length;
    }

    room = this.width - this.sidebarWidth - cursorWidth;
    if (totalLength > (room - startLength)) {
      operations[0] = "…" + operations[0];
      totalLength++;
    }

    if (totalLength < room) {
      T.pos(room - totalLength + this.sidebarWidth + cursorWidth + 1, y + 1);
      this.drawBuffer(operations, room);
    }

    this.resetColors();
    T.end();
  },
}


var m = function limitedString(str, max) {
  return str.substr(0, max);
}
