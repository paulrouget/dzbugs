var DZ;
exports.init = function(aDZ) { DZ = aDZ; }

exports.addTag = function(bugId, tag) {
  var data = DZ.store.$(bugId).src.local.data;
  if (!data.tags) {
    data.tags = {};
  }
  data.tags["_" + tag] = true;
}

exports.deleteTag = function(bugId, tag) {
  var data = DZ.store.$(bugId).src.local.data;
  if (!data.tags) return;
  if (("_" + tag) in data.tags) {
    delete data.tags["_" + tag];
  }
}
