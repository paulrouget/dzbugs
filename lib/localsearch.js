var localSearch = {
  bugs: [],
  idx: -1,
  search: function(string) {
    this.bugs = DZ.store.search(string);
    if (this.bugs.length == 0) {
      DZ.log("Not found.");
      return;
    }
    this.forward();
  },
  forward: function() {
    if (this.bugs.length == 0) return;
    this.idx++;
    if (this.idx >= this.bugs.length) {
      this.idx = 0;
    }
    var cursor = DZ.store.getIndexOfBug(this.bugs[this.idx]);
    DZ.layout.changeCursor(cursor);
  },
  back: function() {
    if (this.bugs.length == 0) return;
    this.idx--;
    if (this.idx < 0) {
      this.idx = this.bugs.length - 1;
    }
    var cursor = DZ.store.getIndexOfBug(this.bugs[this.idx]);
    DZ.layout.changeCursor(cursor);
  }
}

module.exports = localSearch;
