var filters = {};

exports.register = function(s) {filters[s.name] = s;}
exports.get = function(name) { return filters[name];}
exports.exists = function (name) { return (name in filters)}
exports.getAll = function() {return filters}
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
  description: "Show all the bugs.",
  method: function(bug) {
    return true;
  }});

this.register({
  name: "important",
  description: "Show the important (!) bugs.",
  method: function(bug) {
    return bug.tags.indexOf("important") > -1;
  }});

this.register({
  name: "notfixed",
  description: "Show the non-resolved bugs.",
  method: function(bug) {
    var b = bug.bz;
    return !(b.status == "RESOLVED" || b.status == "VERIFIED");
  }});

this.register({
  name: "resolved",
  description: "Show the resolved bugs.",
  method: function(bug) {
    var b = bug.bz;
    return (b.status == "RESOLVED" || b.status == "VERIFIED");
  }});
