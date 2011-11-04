var T, tty = require("tty");

var layout = {
  cursor: 0,
  sidebarWidth: 0,
  scroll: 0,
  get rcursor() {
    return this.cursor - this.scroll;
  },
  getCurrentBugId: function() {
    return this.row2bug[this.rcursor];
  },
  init: function() {
    // Init the terminal.
    T = DZ.term;
    T.hideCursor();
    T.disableMouse();
    T.on('resize', function() {
      this.getDimensions();
      this.moveCursorIfOut();
      if (DZ.pager.isActive()) return;
      this.invalidateAll();
    }.bind(this));
    this.getDimensions();
    this.row2bug = [];
    this.empty();
  },
  empty: function() {
    T.clear();
    T.pos(1, 1).out("No bugs.");
  },
  cleanBeforeExit: function() {
    T.clear();
    T.pos(1, 1);
    T.showCursor();
  },
  getDimensions: function() {
    var dim = tty.getWindowSize(process);
    this.width = dim[1];
    this._height = dim[0] - 2;
  },
  get height() {
    if (DZ.bugpanel.isActive()) {
      return Math.min(this._height, DZ.conf.bugPanelOffset);
    }
    return this._height;
  },
  invalidateAll: function() {
    T.clear();
    this.drawStatusLine();
    this.invalidate(0, this.height);
  },
  invalidate: function(from, count) {
    var bugs = DZ.store.getRange(this.scroll + from, count);
    this.row2bug = [];
    for (var i = 0; i < bugs.length; i++) {
      var bug = bugs[i];
      this.row2bug[from + i] = bug.id;
      this.drawBugLine(this.scroll + from + i);
    }
    for (var i = bugs.length; i < count; i++) {
      this.clearLine(this.scroll + from + i);
    }
  },
  drawCursorLine: function(otherLine) {
    this.drawBugLine(this.cursor);
    if (otherLine != undefined)
      this.drawBugLine(otherLine);
  },
  moveCursorIfOut: function() {
    if (this.rcursor < 0)
      this.cursor = this.scroll;
    if (this.rcursor > this.height - 1)
      this.cursor = this.scroll + this.height - 1;
  },
  ensureCursorIsVisible: function() {
    if (this.rcursor < 0) {
      this.scroll = this.cursor;
      this.invalidateAll();
      return false;
    }
    if (this.rcursor > (this.row2bug.length - 1)) {
      this.scroll += this.rcursor - this.row2bug.length + 1;
      this.invalidateAll();
      return false;
    }
    return true;
  },
  toggleSidebar: function() {
    this.sidebarWidth = this.sidebarWidth ? 0:25;
    this.invalidateAll();
  },


  ////////////// MOVES


  changeCursor: function(newPosition) {
    var oldPosition = this.cursor;
    this.cursor = newPosition;
    if (this.ensureCursorIsVisible())
      this.drawCursorLine(oldPosition);
  },
  end: function() {
    this.changeCursor(DZ.store.getCount() - 1);
  },
  home: function() {
    this.changeCursor(0);
  },
  selectPreviousBug: function() {
    if (this.cursor <= 0) return;
    this.changeCursor(this.cursor - 1);
  },
  selectNextBug: function() {
    if (this.cursor >= DZ.store.getCount() - 1) return;
    this.changeCursor(this.cursor + 1);
  },
  pageDown: function() {
    var cursor = this.cursor + this.height - 1;
    this.changeCursor(Math.min(DZ.store.getCount() - 1, cursor));
  },
  pageUp: function() {
    var cursor = this.cursor - this.height - 1;
    this.changeCursor(Math.max(0, cursor));
  },


  ////////////// DRAWING


  drawBuffer: function(operations, room) {
    var originalRoom = room;
    for (var i = 0; i < operations.length; i++) {
      if (!(i%2)) {
        // draw string
        var str = operations[i];
        if (!str) continue;
        if (str.length > room) {
          str = str.substr(0, room);
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
  clearLine: function(y) {
    y = y - this.scroll;
    if (y < 0 || y >= this.height) return;
    T.pos(1, y + 1);
    T.eraseLine();
  },

  drawLine: function(row, xoffset, start, end) {
    var COLOR_REGEX = /(#\{[^\}]+\})/;
    this.resetColors();
    var room, operations;
    T.pos(xoffset, row);
    T.eraseLine();
    room = this.width - xoffset;
    operations = start.split(COLOR_REGEX);
    var startLength = this.drawBuffer(operations, room);
    var spacer = "";
    var spacerCount = this.width - startLength - xoffset;
    for (var i = 0; i < spacerCount; i++) spacer += " ";
    T.out(spacer);
    if (end) {
      operations = end.split(COLOR_REGEX);
      var totalLength = 0;
      for (var i = 0; i < operations.length; i += 2) {
        totalLength += operations[i].length;
      }
      room = this.width - xoffset;
      if (totalLength > (room - startLength)) {
        operations[0] = "…" + operations[0];
        totalLength++;
      }
      if (totalLength < room) {
        T.pos(room - totalLength + xoffset + 1, row);
        this.drawBuffer(operations, room);
      }
    }
    this.resetColors();
  },
  drawStatusLine: function() {
    var start= DZ.formater.statusStart();
    var end = DZ.formater.statusEnd();
    this.drawLine(this.height + 1, 0, start, end);
  },
  drawBugLine: function(y) {
    y = y - this.scroll;
    if (y < 0 || y >= this.height) return;
    var bug = DZ.store.$(this.row2bug[y]);
    if (!bug) return;
    var start = DZ.formater.bugStart(bug, y == this.rcursor, this.scroll + y);
    var end = DZ.formater.bugEnd(bug, y == this.rcursor, this.scroll + y);
    this.drawLine(y + 1, this.sidebarWidth, start, end);
  },
}

module.exports = layout;

var m = function limitedString(str, max) {
  return str.substr(0, max);
}

layout.init();
