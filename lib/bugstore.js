var bugs = [];        // All the bugs, in an Array.
var index = {};       // Raw index: bugId -> index in `bugs`.
var filteredAndSortedIndex = [];

var cacheFile = null;

var sorter = null;
var filter = null;

function Bug(id, bz) { // Properties only, it will be JSONified.
  this.id = id;
  bz = bz ? bz : {};

  /* Bugzilla data */
  this.bz = bz;

  /* Custom fields */
  this.tags = [];
  this.alias = null;
}

/**
 * API:
 *    bugStore.init = function() {};
 *    bugStore.save = function() {};
 *    bugStore.load = function() {};
 *    bugStore.setSorter = function(sorterName) {};
 *    bugStore.setFilter = function(filterName) {};
 *    bugStore.remove = function(id) {};
 *    bugStore.setBug = function(id, bz) {};
 *    bugStore.getCount = function() {};
 *    bugStore.getTotalCount = function() {}; // without filters.
 *    bugStore.getRange = function(start, count) {};
 *    bugStore.getAll = function() {};
 *    bugStore.$ = function(id) {};
 */

function _(id) {return "_" + id}

var bugStore = {};
bugStore.init = function() {
  cacheFile = require('path').normalize(
    DZ.conf.db.replace(/^~\//, process.env.HOME + '/')
  );
  this.setSorter("id");
  this.setFilter("all");
  this.load();
};

bugStore.$ = function(id) {
  if (_(id) in index) return bugs[index[_(id)]];
  return null;
};

bugStore.save = function() {
  var fs = require('fs');
  fs.writeFile(
    cacheFile,
    JSON.stringify({bugs: bugs, index: index}),
    function(err) {
      if(err) {
        DZ.error("Error while saving data: " + err);
      } else {
        DZ.log("Data saved successfuly.");
      }
  }); 
};

bugStore.load = function() {
  var fs = require('fs');
  fs.readFile(
    cacheFile,
    function (err, data) {
      if (err) {
        DZ.error("Error while reading data file.");
      } else {
        try {
          var json = JSON.parse(data);
          bugs = json.bugs;
          index = json.index;
        } catch(e) {
          DZ.error("Error while analysing data file: " + e);
          return;
        }
        buildIndex();
        DZ.layout.invalidateAll();
      }
  });
};

bugStore.setSorter = function(name) {
  var method = DZ.sorters.get(name);
  if (!method) {
    DZ.error("No such sorter: " + name);
    return;
  }
  sorter = method;
  buildIndex();
};

bugStore.setFilter = function(name) {
  var method = DZ.filters.get(name);
  if (!method) {
    DZ.error("No such filter: " + name);
    return;
  }
  filter = method;
  buildIndex();
};

bugStore.remove = function(id) {
  // FIXME: use a custom property (.deleted) for recovering.
  var idx = filteredAndSortedIndex.indexOf(id);
  if (idx > -1) {
    filteredAndSortedIndex.splice(idx, 1);
    DZ.layout.invalidateAll(); //FIXME: can be optimized
  }
  idx = index[_(id)];
  bugs[idx] = null; delete index[_(id)]; //FIXME <- needs defragmentation. Fuck.
};

bugStore.setBug = function(id, bz) {
  if (_(id) in index) {
    this.$(id).bz = bz;
  } else {
    bugs.push(new Bug(id, bz));
    index[_(id)] = bugs.length - 1;
    buildIndex(); //FIXME: could be optimized
    DZ.layout.invalidateAll();
  }
};

bugStore.getCount = function() {return filteredAndSortedIndex.length};
bugStore.getCountAll = function() {return bugs.length};

bugStore.getTotalCount = function() {return index.length};

bugStore.getRange = function(start, count) {
  return filteredAndSortedIndex.slice(start, start + count).map(function(id){
    return bugStore.$(id);
  });
};

bugStore.$ = function(id) {
  if (_(id) in index) {
    return bugs[index[_(id)]];
  }
  return null;
}

function buildIndex() {
  var flatIndex = [];
  for (var i in index) flatIndex.push(parseInt(i.slice(1)));
  filteredAndSortedIndex = flatIndex.filter(function(id) {
    return filter(bugStore.$(id));
  });
  filteredAndSortedIndex = filteredAndSortedIndex.sort(function(id1, id2) {
    return sorter(bugStore.$(id1), bugStore.$(id2));
  });
}

module.exports = bugStore;
bugStore.init();
