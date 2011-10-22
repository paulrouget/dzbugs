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
    this._bugs = {};
  },
  load: function(path) {
    var fs = require('fs');

    fs.readFile(path, function (err, data) {
        if (err) {
          notify.error("Error while reading data file.");
        } else {
          try {
            this._bugs = JSON.parse(data);
          } catch(e) {
            notify.error("Error while analysing data file: " + e);
          }
          notify.log("Bugs retrieved from file successuly.");
          this.UI.newBugs(this.getAllStoredBugs());
        }
    }.bind(this));
  },
  save: function(path) {
    var fs = require('fs');

    fs.writeFile(path, JSON.stringify(this._bugs), function(err) {
      if(err) {
        notify.error("Error while saving data: " + err);
      } else {
        notify.log("Data saved successfuly.");
      }
    }); 
  },
  initBug: function(aId) {
    this._bugs["_" + aId] = {
      id: aId,
      src: {
        bz: {
          lastError: BUGSTORE_ERRORS.NEVER_UPDATED, lastSync: null, data: null,
        },
        local: {
          lastError: BUGSTORE_ERRORS.NEVER_UPDATED, lastSync: null, data: null,
        }
      },
    };
  },
  ensureBugIsInitialized: function(aId) {
    if (!this.$(aId)) {
      this.initBug(aId);
    }
  },
  getAllStoredBugs: function() {
    var list = [];
    for (var i in this._bugs) {
      list.push(this._bugs[i].id);
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
    return this._bugs["_" + aId];
  }
}
