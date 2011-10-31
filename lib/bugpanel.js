var bz = require("bz").createClient(DZ.conf.bugzilla);
var T = DZ.term,
    tty = require("tty");

module.exports = {
  active: false,
  height: 0,
  buffer: null,
  scroll: 0,
  isActive: function() { return this.active; },
  open: function(bugId) {
    this.scroll = 0;
    this.active = true;
    this.layoutScroll = DZ.layout.scroll;
    DZ.layout.invalidateAll();
    DZ.layout.ensureCursorIsVisible();
    this.yoffset = DZ.conf.bugPanelOffset;
    var dim = tty.getWindowSize(process);
    this.width = dim[1];
    this.height = dim[0];
    T.pos(1, this.yoffset);
    this.fetchAndDrawBug(bugId);
  },
  close: function() {
    this.height = 0;
    this.active = false;
    DZ.layout.scroll = this.layoutScroll;
    DZ.layout.invalidateAll();
  },
  drawSingleLine: function(txt) {
    if (!this.isActive()) return;
    for (var i = this.yoffset + 2; i < this.height; i++) {
      T.pos(1, i);
      T.eraseLine();
    }
    T.pos(2, this.yoffset + 3);
    T.out(txt);
  },
  fetchAndDrawBug: function(id) {
    if (!this.isActive()) return;
    this.drawSingleLine("Fetching bug " + id + "…");
    bz.getBug(id, function(error, bug) {
      if (error) {
        this.drawSingleLine("Error: " + error);
      } else {
        bz.bugComments(bug.id, function(error, comments) {
          if (error) {
            this.drawSingleLine("Error while fetching comments: " + error);
          } else {
            bug.comments = comments;
            this.buildBufffer(bug);
            this.draw();
          }
        }.bind(this));
      }
    }.bind(this));
  },
  draw: function() {
    if (!this.isActive()) return;
    for (var i = this.yoffset + 2; i < this.height; i++) {
      T.pos(2, i);
      T.eraseLine();
      var line = i - this.yoffset - 2 + this.scroll;
      if (line >= this.buffer.length) continue;
      DZ.layout.drawLine(i, 2, this.buffer[line], null);
    }
    T.pos(this.width - 3, this.height);
    var maxScroll = this.buffer.length - this.height + this.yoffset;
    T.eraseLine();
    T.out(Math.round(100 * this.scroll / maxScroll) + "%");
  },
  buildBufffer: function(bzBug) {
    var dzBug = DZ.store.$(bzBug.id);
    this.buffer = DZ.formater.fullBug(dzBug, bzBug, this.width - 2).split("\n");
  },

  // keys
  up: function() {
    if (this.scroll == 0) return;
    this.scroll--;
    this.draw();
  },
  down: function() {
    if (!this.buffer) return;
    if (this.scroll >= (this.buffer.length - this.height + this.yoffset)) return;
    this.scroll++;
    this.draw();
  },
  pageUp: function() {
    this.scroll -= this.height - this.yoffset - 1;
    this.scroll = Math.max(this.scroll, 0);
    this.draw();
  },
  pageDown: function() {
    this.scroll += this.height - this.yoffset - 1;
    if (this.scroll >= (this.buffer.length - this.height + this.yoffset))
      this.end();
    else
      this.draw();
  },
  end: function() {
    this.scroll = this.buffer.length - this.height + this.yoffset;
    this.draw();
  },
  home: function() {
    this.scroll = 0;
    this.draw();
  },
}
