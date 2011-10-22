#!/usr/bin/env node
var tty = require('tty');

require("coffee-script")
var T = require("node-term-ui").TermUI;
var bz = require("bz")
var BugStore = require("./lib/bugstore.js").BugStore;
var printers = require("./lib/printers.js");
var f = require("./lib/format.js").formater;



var bugzilla = bz.createClient();
var store = new BugStore();

var bugsIds = [669658, 653545, 663778, 672003, 672006, 683873];
//var bugsIds = [653545];

T.clear();
var dim = tty.getWindowSize(process);
var row = dim[0];
var col = dim[1];

fetchBugsFromBugzilla(bugsIds, function() {
  var line = 0;
  for (var i in bugsIds) {
    var bug = store.getBug(bugsIds[i]);
    T.pos(0, line);
    T.out(f.start(bug));
    var end = f.end(bug);

    var offset = col - end.length;
    if (offset > 0) {
      T.pos(offset, line);
      T.out(end);
    }

    line++;

    /*
    T.pos(5,5).fg(T.C.w).bg(T.C.r).out("Hello, world!")
    T.pos(0, 0).fg(T.C.r).bg(T.C.x).out(T.SYM.check + " ");
    */

  }
});

function fetchBugsFromBugzilla(aBugs, aOnComplete) {
  var requestCount = aBugs.length;
  for (var i in aBugs) {
    bugzilla.getBug(aBugs[i], function(aError, aBug) {
      store.addData(aBug.id, "bz", aBug, aError);
      requestCount--;
      if (requestCount == 0)
        aOnComplete();
    });
  }
}
