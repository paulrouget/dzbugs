#!/usr/bin/env node

require("coffee-script");
var notify = require("./lib/notifications.js");

var DZ = {
  formater: require("./etc/format.js"),
  conf: require("./etc/conf.js"),
  sorters: require("./lib/sorters.js"),
  local: require("./lib/local.js"),
  term: require("node-term-ui").TermUI,
  layout: require("./lib/layout.js"),
  store: require("./lib/bugstore.js"),
  keys: require("./lib/keys.js"),
  commands: require("./lib/commands.js"),
  commandLine: require("./lib/commandline.js"),
  bz: require("./lib/bugzilla.js"),
  log: notify.log,
  error: notify.error,
}


notify.init(DZ);
DZ.sorters.init(DZ);
DZ.local.init(DZ);
DZ.commandLine.init(DZ);
DZ.commands.init(DZ);
DZ.store.init(DZ);
DZ.keys.init(DZ);
DZ.bz.init(DZ);
DZ.layout.init(DZ);

//DZ.store.load("/tmp/dzbugs.data");
