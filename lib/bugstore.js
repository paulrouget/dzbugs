exports.BugStore = BugStore;

const BUGSTORE_ERRORS = {
  NO_ERRORS: "No error.",
  NEVER_UPDATED: "Never udpated.",
  GENERIC_ERROR: "Generic error.",
};

function BugStore() {
  this.init();
}

BugStore.prototype = {
  init: function() {
    this._bugs = [];
  },
  save: function() {

  },
  initBug: function(aId) {
    this._bugs[aId] = {
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
    if (!this._bugs[aId]){
      this.initBug(aId);
    }
  },
  addData: function(aId, aSrc, aData, aError) {
    this.ensureBugIsInitialized(aId);
    var b = this._bugs[aId];
    if (!aError) {
      b.src[aSrc].lastError = BUGSTORE_ERRORS.NO_ERRORS;
      b.src[aSrc].lastSync = new Date();
      b.src[aSrc].data = aData;
    } else {
      b.src[aSrc].lastError = BUGSTORE_ERRORS.GENERIC_ERROR;
    }
  },
  getBug: function(aId) {
    return this._bugs[aId];
  }
}
