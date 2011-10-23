var notify = require("./notifications.js");

exports.BugStore = BugStore;

const BUGSTORE_ERRORS = {
  NO_ERRORS: "No error.",
  NEVER_UPDATED: "Never udpated.",
  GENERIC_ERROR: "Generic error.",
};

function BugStore(UI) {
  this.init();
  this.UI = UI;
}

BugStore.prototype = {
  init: function() {
    this._bugs = [];
    this._index = {};
  },
  buildIndex: function() {
    this._index = {};
    for (var i = 0; i < this._bugs.length; i++) {
      this._index["_" + this._bugs[i].id] = i;
    }
  },
  load: function(path) {
    var fs = require('fs');

    fs.readFile(path, function (err, data) {
        if (err) {
          notify.error("Error while reading data file.");
        } else {
          try {
            this._bugs = JSON.parse(data).bugs;
          } catch(e) {
            notify.error("Error while analysing data file: " + e);
            return;
          }
          this.buildIndex();
          notify.log("Bugs retrieved from file successuly.");
          this.UI.newBugs();
        }
    }.bind(this));
  },
  save: function(path) {
    var fs = require('fs');

    fs.writeFile(path, JSON.stringify({bugs: this._bugs}), function(err) {
      if(err) {
        notify.error("Error while saving data: " + err);
      } else {
        notify.log("Data saved successfuly.");
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
          lastError: BUGSTORE_ERRORS.NEVER_UPDATED, lastSync: null, data: null,
        }
      },
    });
    this._index["_" + aId] = this._bugs.length - 1;
  },
  ensureBugIsInitialized: function(aId) {
    if (!this.$(aId)) {
      this.initBug(aId);
    }
  },
  getRange: function(start, count, filter) {
    var list = [];
    for (var i = start; i < this._bugs.length && list.length <= count; i++) {
      list.push(this._bugs[i]);
    }
    return list;
  },
  addData: function(aId, aSrc, aData, aError) {
    this.ensureBugIsInitialized(aId);
    var b = this.$(aId);
    if (!aError) {
      b.src[aSrc].lastError = BUGSTORE_ERRORS.NO_ERRORS;
      b.src[aSrc].lastSync = new Date();
      b.src[aSrc].data = aData;
    } else {
      b.src[aSrc].lastError = BUGSTORE_ERRORS.GENERIC_ERROR;
    }
    this.UI.bugUpdated(aId);
  },
  $: function(aId) {
    return this.getBug(aId);
  },
  getBug: function(aId) {
    if (("_" + aId) in this._index) {
      var idx = this._index["_" + aId];
      return this._bugs[idx];
    }
    return null;
  }
}
