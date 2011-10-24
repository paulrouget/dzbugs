var bz = require("bz").createClient();
var DZ;
exports.init = function(aDZ) { DZ = aDZ; }

exports.fetchBug = function(bug) {
  bz.getBug(bug, function(aError, aBug) {
    if (aError) {
      DZ.error("Error while fetching bug " + bug + ": " + aError);
    } else {
      DZ.store.addData(aBug.id, "bz", aBug, aError);
    }
  });
}

exports.getMyBugs = function() {
  var q = {email1: DZ.conf.email, email1_type: "equals_any", email1_assigned_to: "1"};
  bz.searchBugs(q, function(aError, aBugs) {
    if (aError) {
      DZ.error("Error while fetching assigned bugs: " + aError);
    } else {
      aBugs.forEach(function(bug) {
        DZ.store.addData(bug.id, "bz", bug, aError);
      });
    }
  });
}
