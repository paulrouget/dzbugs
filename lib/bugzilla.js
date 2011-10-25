var bz = require("bz").createClient();
var operations = 0;

function refreshUIIfNeeded() {
  if (operations == 0) {
    DZ.store.buildIndex();
    DZ.layout.redrawAll();
  }
}

exports.fetchBug = function(bug, refresh) {
  operations++;
  bz.getBug(bug, function(aError, aBug) {
    if (aError) {
      DZ.error("Error while fetching bug " + bug + ": " + aError);
    } else {
      DZ.store.addData(aBug.id, "bz", aBug, aError);
    }
    operations--; refreshUIIfNeeded();
  });
}

exports.getBlockers = function(bug) {
  bz.getBug(bug, function(aError, aBug) {
    if (aError) {
      DZ.error("Error while fetching bug " + bug + ": " + aError);
    } else {

      var count = aBug.depends_on.length;
      DZ.log("Fetching " + count + " blockers.");

      aBug.depends_on.forEach(function(id) {
        DZ.bz.fetchBug(id, false);
      });
    }
  });
}

exports.getMyBugs = function() {
  var q = {email1: DZ.conf.email, email1_type: "equals_any", email1_assigned_to: "1"};
  operations++;
  bz.searchBugs(q, function(aError, aBugs) {
    if (aError) {
      DZ.error("Error while fetching assigned bugs: " + aError);
    } else {
      aBugs.forEach(function(bug) {
        DZ.store.addData(bug.id, "bz", bug, aError);
      });
    }
    operations--; refreshUIIfNeeded();
  });
}
