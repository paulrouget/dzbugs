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
  q.include_fields = DZ.conf.bugzillaDefaultField;
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
