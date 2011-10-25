var fs = require('fs');

const BUGSTORE_ERRORS = {
  NO_ERRORS: "No error.",
  NEVER_UPDATED: "Never udpated.",
  GENERIC_ERROR: "Generic error.",
};

BugStore = {
  init: function() {
    this._bugs = [];
    this._dict = {};
    this._indexes = [];
    this._sortedIndexes = [];
    this._sorter = DZ.sorters.bugnumber;
    this._sorterReverse = false;
    this._dbPath = require('path').normalize(
      DZ.conf.db.replace(/^~\//, process.env.HOME + '/')
    );
    this.load();
  },
  toggleReverse: function() {
      this._sorterReverse = !this._sorterReverse;
      this.sort();
      DZ.layout.redrawAll();
  },
  setSorter: function(aSorter) {
    if (aSorter in DZ.sorters) {
      this._sorter = DZ.sorters[aSorter];
      this.sort();
      DZ.layout.redrawAll();
    } else {
      DZ.error("No such sort method.");
    }
  },
  buildIndex: function() {
    this._dict = {};
    this._indexes = [];
    for (var i = 0; i < this._bugs.length; i++) {
      this._dict["_" + this._bugs[i].id] = i;
      this._indexes.push(this._bugs[i].id);
    }
    this.sort();
  },
  sort: function() {
    this._sortedIndexes = this._indexes.sort(this._sorter);
    if (this._sorterReverse)
      this._sortedIndexes = this._sortedIndexes.reverse();
  },
  delete: function(id) {
    this._bugs.splice(this._dict["_" + id], 1);
    this.buildIndex();
    DZ.layout.redrawAll();
  },
  load: function(path) {
    fs.readFile(this._dbPath, function (err, data) {
        if (err) {
          DZ.error("Error while reading data file.");
        } else {
          try {
            this._bugs = JSON.parse(data).bugs;
          } catch(e) {
            DZ.error("Error while analysing data file: " + e);
            return;
          }
          this.buildIndex();
          DZ.log("Bugs retrieved from file successuly.");
          DZ.layout.newBugs();
        }
    }.bind(this));
  },
  save: function() {
    fs.writeFile(this._dbPath, JSON.stringify({bugs: this._bugs}), function(err) {
      if(err) {
        DZ.error("Error while saving data: " + err);
      } else {
        DZ.log("Data saved successfuly.");
      }
    }); 
  },
  initBug: function(aId) {
    this._bugs.push({
      id: aId,
      src: {
        bz: {
          lastError: BUGSTORE_ERRORS.NEVER_UPDATED, lastSync: null, data: null,
        },
        local: {
          data: {},
        }
      },
    });
    this._dict["_" + aId] = this._bugs.length - 1;
  },
  ensureBugIsInitialized: function(aId) {
    if (!this.$(aId)) {
      this.initBug(aId);
      return true;
    }
    return false;
  },
  getCount: function() {
    return this._bugs.length;
  },
  getAll: function() {
    return this.getRange(0, this._bugs.length);
  },
  getRange: function(start, count) {
    var list = [];
    for (var i = start; i < this._sortedIndexes.length && list.length <= count; i++) {
      var bugid = this._sortedIndexes[i];
      list.push(this.$(bugid));
    }
    return list;
  },
  addData: function(aId, aSrc, aData, aError) {
    var isNew = this.ensureBugIsInitialized(aId);
    var b = this.$(aId);
    if (!aError) {
      b.src[aSrc].lastError = BUGSTORE_ERRORS.NO_ERRORS;
      b.src[aSrc].lastSync = new Date();
      b.src[aSrc].data = aData;
    } else {
      b.src[aSrc].lastError = BUGSTORE_ERRORS.GENERIC_ERROR;
    }
  },
  $: function(aId) {
    return this.getBug(aId);
  },
  getBug: function(aId) {
    if (("_" + aId) in this._dict) {
      var idx = this._dict["_" + aId];
      return this._bugs[idx];
    }
    return null;
  }
}

for (var i in BugStore) {
  exports[i] = BugStore[i];
}

this.init();
