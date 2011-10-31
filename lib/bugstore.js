var bugs = [];        // All the bugs, in an Array.
var index = {};       // Raw index: bugId -> index in `bugs`.
var filteredAndSortedIndex = [];

var cacheFile = null;

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

var bugStore = {
  reverse: false,
  sorter: null,
  filter: null,
  init: function() {
    cacheFile = require('path').normalize(
      DZ.conf.db.replace(/^~\//, process.env.HOME + '/')
    );
    this.setSorter(DZ.conf.defaultSorter);
    this.setFilter(DZ.conf.defaultFilter);
    this.reverse = !!DZ.conf.reversed;
    this.load();
  },

  save: function() {
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
  },

  load: function() {
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
          this.buildIndex();
          DZ.layout.invalidateAll();
        }
    }.bind(this));
  },

  toggleReverse: function() {
    this.reverse = !this.reverse;
    this.buildIndex();
  },
  setSorter: function(name) {
    var s = DZ.sorters.get(name);
    if (!s) {
      DZ.error("No such sorter: " + name);
      return;
    }
    this.sorter = s;
    this.buildIndex();
  },

  setFilter: function(name) {
    var f = DZ.filters.get(name);
    if (!f) {
      DZ.error("No such filter: " + name);
      return;
    }
    this.filter = f;
    this.buildIndex();
  },

  remove: function(id) {
    // FIXME: use a custom property (.deleted) for recovering.
    var idx = filteredAndSortedIndex.indexOf(id);
    if (idx > -1) {
      filteredAndSortedIndex.splice(idx, 1);
      DZ.layout.invalidateAll(); //FIXME: can be optimized
    }
    idx = index[_(id)];
    bugs[idx] = null; delete index[_(id)]; //FIXME <- needs defragmentation. Fuck.
  },

  setBug: function(id, bz) {
    if (_(id) in index) {
      this.$(id).bz = bz;
    } else {
      bugs.push(new Bug(id, bz));
      index[_(id)] = bugs.length - 1;
      this.buildIndex(); //FIXME: could be optimized
    }
    return this.$(id);
  },

  getCount: function() {return filteredAndSortedIndex.length},
  getCountAll: function() {return bugs.length},

  getTotalCount: function() {return index.length},

  getRange: function(start, count) {
    return filteredAndSortedIndex.slice(start, start + count).map(function(id){
      return this.$(id);
    }.bind(this));
  },

  getFilterName: function() {return this.filter.name},
  getSorterName : function() {return this.sorter.name},

  $: function(id) {
    if (_(id) in index) {
      return bugs[index[_(id)]];
    }
    return null;
  },

  buildIndex: function() {
    var flatIndex = [];
    for (var i in index) flatIndex.push(parseInt(i.slice(1)));
    filteredAndSortedIndex = flatIndex.filter(function(id) {
      return this.filter.method(this.$(id));
    }.bind(this));
    filteredAndSortedIndex = filteredAndSortedIndex.sort(function(id1, id2) {
      return (this.reverse ? -1 : 1) * this.sorter.method(this.$(id1), this.$(id2));
    }.bind(this));
  }
}

module.exports = bugStore;
bugStore.init();
