var bz = require("bz").createClient();

// Fixme: follow the sorters/filters pattern.

exports.fetchBug = function(id) {
  bz.getBug(id, function(error, bug) {
    if (error)
      DZ.error("Error while fetching bug " + id + ": " + error);
    else
      DZ.store.setBug(bug.id, bug);
  });
}

exports.getBlockers = function(id) {
  bz.getBug(id, function(error, bug) {
    if (error) {
      DZ.error("Error while fetching bug " + id + ": " + error);
    } else {
      DZ.log("Fetching " + bug.depends_on.length + " blockers.");
      bug.depends_on.forEach(function(id) {DZ.bz.fetchBug(id);});
    }
  });
}

exports.getMyBugs = function() {
  var q = {
    email1: DZ.conf.email,
    email1_type: "equals_any",
    email1_assigned_to: "1"
  };
  bz.searchBugs(q, function(error, bugs) {
    if (error)
      DZ.error("Error while fetching assigned bugs: " + error);
    else
      bugs.forEach(function(bug) { DZ.store.setBug(bug.id, bug); });
  });
}
