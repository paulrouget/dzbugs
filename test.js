#!/usr/bin/env node

var bz = require("bz").createClient();
var q = "product=Bugzilla&priority=P1&severity=blocker";
var q = {email1: "paul@mozilla.com", email1_type: "equals_any", email1_assigned_to: "1"};
//var q = {changed_after: "1h"};

bz.searchBugs(q, function(err, bugs) {
  console.log("Got it");
  if (err) {
    console.error(err);
  }
  bugs.forEach(function(bug) {
    console.log(bug.id);
  });
});
