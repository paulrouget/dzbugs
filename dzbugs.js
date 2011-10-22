#!/usr/bin/env node

/* Includes */

require("coffee-script");
var notify = require("./lib/notifications.js");
var bz = require("bz")
var BugStore = require("./lib/bugstore.js").BugStore;
var printers = require("./lib/printers.js");
var formater = require("./lib/format.js").formater;
var layout = require("./lib/layout.js").layout;

console.log(layout);

/* Init store */

var store = new BugStore(layout);
layout.init(store, formater);
store.load("/tmp/dzbugs.data");

return;

//var bugsIds = [669658, 653545, 663778, 672003, 672006, 683873];

var bugzilla = bz.createClient();
fetchBugsFromBugzilla(bugsIds, function() {
  store.save("/tmp/dzbugs.data");
  return;
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
