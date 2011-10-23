var bz = require("bz").createClient();
var DZ;
exports.init = function(aDZ) { DZ = aDZ; }

exports.fetchBug = function(bug, cb) {
  bz.getBug(bug, function(aError, aBug) {
    if (aError) {
      DZ.error("Error while fetching bug " + bug + ": " + aError);
    } else {
      DZ.store.addData(aBug.id, "bz", aBug, aError);
    }
  });
}
