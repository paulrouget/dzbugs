var tty = require("tty");

var T;

var layout = {
  commandMode: false,
  cursor: 0,
  sidebarWidth: 10,
  scrollY: 0,
  init: function() {
    T = DZ.term;
    T.clear();
    T.disableMouse();

    T.on('resize', function (dim) {
      this.width = dim.w;
      this.height = dim.h - 1;
      this.redrawAll();
    }.bind(this));

    this.lines2bugs = [];
    this.bugs2lines = {};

    var dim = tty.getWindowSize(process);
    this.width = dim[1];
    this.height = dim[0] - 1;

    T.pos(1, 1).out("No bugs.");
  },
  hideCursor: function() {
    T.pos(this.width, this.height);
  },
  rCursor: function() {
    return this.cursor - this.scrollY;
  },
  newBugs: function() {
    this.redrawAll();
  },
  redrawAll: function() {
    T.clear();
    this.lines2bugs = [];
    this.bugs2lines = {};

    var bugs = DZ.store.getRange(this.scrollY, this.height - 1);
    for (var i = 0; i < bugs.length; i++) {

      var bug = bugs[i];
      this.lines2bugs[i] = bug.id;
      this.bugs2lines["_" + bug.id] = i;

      this.drawLine(this.scrollY + i);
    }
    this.ensureCursorVisible();
  },
  ensureCursorVisible: function() {
    if (this.rCursor() < 0)
      this.cursor = this.scrollY;
    if (this.rCursor() > this.height - 1)
      this.cursor = this.scrollY + this.height - 1;
    this.drawLine(this.cursor);
  },
  scroll: function(lines) {
    if (this.scrollY + lines < 0) {
      lines = -this.scrollY;
    }

    var count = DZ.store.getCount();
    if (this.scrollY + lines > count - 1) {
      lines = this.count - 1;
    }
    this.scrollY += lines;
    this.redrawAll();
  },

  // FIXME: replace all this mess with a proper setCursor() method
  // that ensures the cursor is visible.
  home: function() {
    this.scrollY = 0;
    this.cursor = 0;
    this.redrawAll();
  },
  end: function() {
    if (this.isLastPage()) {
      var lastCursor = this.cursor;
      this.cursor = DZ.store.getCount() - 1;
      this.drawLine(this.cursor);
      this.drawLine(lastCursor);
    } else {
      var count = DZ.store.getCount();
      this.scrollY = count - this.height + 4;
      this.cursor = count - 1;
      this.redrawAll();
    }
  },
  isLastPage: function() {
    return this.lines2bugs.length < this.height;
  },
  isFirstPage: function() {
    return this.scrollY == 0;
  },
  pageDown: function() {
    if (this.isLastPage()) {
      var lastCursor = this.cursor;
      this.cursor = DZ.store.getCount() - 1;
      this.drawLine(lastCursor);
      this.drawLine(this.cursor);
    } else {
      this.scroll(this.height);
    }
  },
  pageUp: function() {
    if (this.isFirstPage()) {
      var lastCursor = this.cursor;
      this.cursor = 0;
      this.drawLine(lastCursor);
      this.drawLine(this.cursor);
    } else {
      this.scroll(-this.height);
    }
  },
  getCurrentBugId: function() {
    return this.lines2bugs[this.rCursor()];
  },
  delete: function() {
    DZ.store.delete(this.getCurrentBugId());
  },
  selectPreviousBug: function() {
    if (this.cursor <= 0) return;

    this.cursor--;

    if (this.rCursor() < 4) {
      this.scroll(-1);
    } else {
      this.drawLine(this.cursor);
      this.drawLine(this.cursor + 1);
    }
  },
  selectNextBug: function() {
    if (this.cursor >= DZ.store.getCount() - 1) return;

    this.cursor++;

    if (this.rCursor() >= this.height - 1) {
      this.scroll(1);
    } else {
      this.drawLine(this.cursor);
      this.drawLine(this.cursor - 1);
    }
  },
  redrawCursorLine: function() {
    this.drawLine(this.cursor);
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
          if ("fgreset" in color) T.fg(T.C.x);
          if ("bgreset" in color) T.bg(T.C.x);
        } catch(e) {
          DZ.error("formater parse error (start): " + e);
        }
      }
    }
    return originalRoom - room;
  },
  resetColors: function() {
    T.fg(T.C.x).bg(T.C.x);
  },
  bugUpdated: function(id) {
    DZ.log("Bug " + id + " updated.");
  },
  newBug: function(id) {
    DZ.log("Bug " + id + " added.");
    if (this.isLastPage()) {
      this.redrawAll();
    }
  },
  drawLine: function(y) {
    y = y - this.scrollY;
    if (y < 0 || y > this.height - 1) return;
    var bug = DZ.store.$(this.lines2bugs[y]);
    T.pos(1, y + 1);
    T.eraseLine();
    if (!bug) return;

    const COLOR_REGEX = /(#\{[^\}]+\})/;

    this.resetColors();

    var f = DZ.formater;

    var room, operations;

    T.pos(this.sidebarWidth + 1, y + 1);
    room = this.width - this.sidebarWidth;
    operations = f.start(bug, y == this.rCursor(), this.scrollY + y, T.SYM).split(COLOR_REGEX);
    var startLength = this.drawBuffer(operations, room);

    var spacer = "";
    var spacerCount = this.width - startLength - this.sidebarWidth;
    for (var i = 0; i < spacerCount; i++) spacer += " ";
    T.out(spacer);

    operations = f.end(bug, y == this.rCursor(), this.scrollY + y, T.SYM).split(COLOR_REGEX);
    var totalLength = 0;
    for (var i = 0; i < operations.length; i += 2) {
      totalLength += operations[i].length;
    }

    room = this.width - this.sidebarWidth;
    if (totalLength > (room - startLength)) {
      operations[0] = "…" + operations[0];
      totalLength++;
    }

    if (totalLength < room) {
      T.pos(room - totalLength + this.sidebarWidth + 1, y + 1);
      this.drawBuffer(operations, room);
    }

    this.resetColors();
    T.pos(-1, -1);
  },
}


var m = function limitedString(str, max) {
  return str.substr(0, max);
}

for (var i in layout) {
  exports[i] = layout[i];
}

this.init();
