var filters = {};

exports.register = function(s) {filters[s.name] = s.method;}
exports.get = function(name) { return filters[name];}
exports.exists = function (name) { return (name in filters)}
exports.complete = function(prefix) {
  var res = [];
  for (var i in filters)
    if (i.indexOf(prefix) == 0)
      res.push(i);
  return res;
}

/* Some default filters. */

this.register({
  name: "all",
  method: function(bug) {
    return true;
  }});

this.register({
  name: "important",
  method: function(bug) {
    return bug.tags.indexOf("important") > -1;
  }});

this.register({
  name: "active",
  method: function(bug) {
    var b = bug.bz;
    return !(b.status == "RESOLVED" || b.status == "VERIFIED");
  }});

this.register({
  name: "fixed",
  method: function(bug) {
    var b = bug.bz;
    return (b.status == "RESOLVED" || b.status == "VERIFIED");
  }});
