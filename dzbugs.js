#!/usr/bin/env node

/* Includes */

require("coffee-script");
var notify = require("./lib/notifications.js");
var bz = require("bz");
var BugStore = require("./lib/bugstore.js").BugStore;
var formater = require("./lib/format.js").formater;
var layout = require("./lib/layout.js").layout;
var keys = require("./lib/keys.js").keys;

/* Init store */

var store = new BugStore(layout);
layout.init(store, formater);
store.load("/tmp/dzbugs.data");

keys.init(layout);

return;


var bugsIds = "566092 650804 653545 663778 663852 663902 665933 666250 672003 672006 674887 683662 683873 683954 689939 689946 691712 692466 694019 694954 694956 694958 696015 696139 642471 650794 663781 663831 663833 663858 663898 664436 665421 665539 665880 665907 666249 666650 668254 669652 669656 669658 671689 672002 672902 674871 683906 690068".split(" ");

var bugzilla = bz.createClient();
fetchBugsFromBugzilla(bugsIds, function() {
  store.save("/tmp/dzbugs.data");
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
