var sources = [];
var bz = require("bz").createClient(DZ.conf.bugzilla);

exports.addSource = function(src) {
  sources.push(src);
};

// FIXME: need call once everything is done, to unfreeze and display message;

exports.fetch = function() {
  DZ.keys.freeze();
  for (var i = 0; i < sources.length; i++) {
    fetchSource(sources[i]);
  }
}

function fetchSource(src) {
  var q = src.query;
  q.include_fields = "_default,cc";
  bz.searchBugs(q, function(error, bugs) {
    if (error)
      DZ.error("Error while fetching " + src.tag +": " + error);
    else
      bugs.forEach(function(bug) {
        var innerBug = DZ.store.setBug(bug.id, bug);
        if (innerBug.tags.indexOf(src.tag) == -1) {
          innerBug.tags.push(src.tag);
        }
      });
      DZ.layout.invalidateAll();
      DZ.keys.unfreeze();
  });
}

/*
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
*/
