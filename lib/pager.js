var T = DZ.term, tty = require("tty");

var pager = {
  scroll: 0,
  active: false,
  open: function(txt) {
    this.txt = txt.split("\n");
    this.active = true;
    this.draw();
  },
  isActive: function() {
    return this.active;
  },
  close: function() {
    this.active = false;
    DZ.layout.invalidateAll();
  },
  draw: function() {
    T.clear();
    T.pos(1, 1);
    var dim = tty.getWindowSize(process);
    var width = dim[1];
    var height = dim[0];
    this.height = height;
    for (var i = this.scroll;
         (i < this.txt.length && i - this.scroll < height);
         i++) {
      var row = i - this.scroll + 1;
      T.pos(1, row);
      T.out(this.txt[i]);
    }
  },
  down: function() {
    if (this.scroll >= this.txt.length - this.height) return;
    this.scroll++;
    this.draw();
  },
  up: function() {
    if (this.scroll == 0) return;
    this.scroll--;
    this.draw();
  },
  pageDown: function() {
    this.scroll += this.height;
    if (this.scroll >= this.txt.length - this.height) {
      this.scroll = this.txt.length - this.height;
    }
    this.draw();
  },
  pageUp: function() {
    this.scroll -= this.height;
    this.scroll = Math.max(0, this.scroll);
    this.draw();
  },
  home: function() {
    this.scroll = 0;
    this.draw();
  },
  end: function() {
    this.scroll = this.txt.length - this.height;
    this.draw();
  },
}
T.on('resize', pager.draw.bind(pager));


module.exports = pager;
