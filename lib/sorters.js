var sorters = {};

exports.register = function(s) {sorters[s.name] = s;}
exports.get = function(name) { return sorters[name];}
exports.exists = function (name) { return (name in sorters)}
exports.getAll = function() {return sorters}
exports.complete = function(prefix) {
  var res = [];
  for (var i in sorters)
    if (i.indexOf(prefix) == 0)
      res.push(i);
  return res;
}

/* Some default sorters. */

this.register({
  name: "id",
  description: "Sort by creation date.",
  method: function(bug1, bug2) {
    if (bug1.id > bug2.id)
      return 1;
    if (bug1.id < bug2.id)
      return -1;
    return 0;
  }});

this.register({
  name: "activity",
  description: "Sort by latest activity.",
  method: function(bug1, bug2) {
    bug1 = bug1.bz; bug2 = bug2.bz;
    if (bug1.last_change_time < bug2.last_change_time)
      return -1;
    if (bug1.last_change_time > bug2.last_change_time)
      return 1;
    return 0;
  }});

this.register({
  name: "priority",
  description: "Sort by priotity.",
  method: function(bug1, bug2) {
    bug1 = bug1.bz; bug2 = bug2.bz;
    if (bug1.priority == bug2.priority)
      return 0;
    if (bug1.priority == "--")
      return 1;
    if (bug2.priority == "--")
      return -1;
    return bug1.priority < bug2.priority ? -1 : 1;
  }});
