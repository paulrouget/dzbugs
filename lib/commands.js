/**
 * cmd: {
 *  @param name
 *  @param description
 *  @param keybinding {ctrl: boolean, shift: boolean, name: string}
 *  @param validation warning message if command executed via the keybinding,
 *                    null for no validation.
 *  @param exec Actual command.
 *         function (argv) {}
 *  @param areAgumentsValid
 *         function (argv) {}
 *  @param completeArgument
 *         function (index, value, bugId) {}
 * }
 */

exports.init = function() {

  /********************** :help ********************/

  DZ.commandLine.registerCommand({
    name: "help",
    description: "Display this help.",
    keybinding: {name: "?"},
    validation: "",
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: function(index, value, bugId) { return null; },
    exec: function() {
      //FIXME: do something
      DZ.log("Here is some help…");
    },
  });

  /********************** :quit ********************/

  DZ.commandLine.registerCommand({
    name: "quit",
    description: "Quit the program.",
    keybinding: {name: "q"},
    validation: "Quit DZBugs? ([yes]/no):",
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: function(index, value, bugId) { return null; },
    exec: function() {
      DZ.layout.cleanBeforeExit();
      process.exit(0);
    },
  });

  /********************** :load ********************/

  DZ.commandLine.registerCommand({
    name: "load",
    description: "Load from cache.",
    keybinding: null,
    validation: null,
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: null,
    exec: function() { DZ.store.load() },
  });

  /********************** :save ********************/

  DZ.commandLine.registerCommand({
    name: "save",
    description: "Save to cache.",
    keybinding: null,
    validation: null,
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: null,
    exec: function() { DZ.store.save() },
  });

  /********************** :delete ******************/

  DZ.commandLine.registerCommand({
    name: "delete",
    description: "Delete a node.",
    keybinding: {name: "d"},
    validation: null,
    areAgumentsValid: function(argv) {
      // FIXME
      return true;
    },
    completeArgument: function() {
      // FIXME
    },
    exec: function() {
      if (arguments.length == 1) {
        DZ.store.remove(arguments[0]);
      } else {
        for (var i = 0; i < arguments.length - 1; i++) {
          DZ.store.remove(arguments[i]);
        }
      }
    },
  });

  /********************** :redraw ******************/

  DZ.commandLine.registerCommand({
    name: "redraw",
    description: "Redraw the screen.",
    keybinding: {name: "l", ctrl: true},
    validation: null,
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: null,
    exec: function() { DZ.layout.invalidateAll() },
  });

  /********************** :filter ******************/

  DZ.commandLine.registerCommand({
    name: "filter",
    description: "Filter the bugs.",
    keybinding: null,
    validation: "",
    areAgumentsValid: function(argv) {
      if (argv.length == 1) {
        return DZ.filters.exists(argv[0]);
      }
      return false;
    },
    completeArgument: function(index, value, bugId) {
      var options = DZ.filters.complete(value);
      return options.map(function (v) {return v.slice(value.length)});
    },
    exec: function(name) {
      DZ.store.setFilter(name);
      DZ.layout.invalidateAll();
    },
  });

  /********************** :sort ********************/

  DZ.commandLine.registerCommand({
    name: "sort",
    description: "Sort the bugs.",
    keybinding: null,
    validation: "",
    areAgumentsValid: function(argv) {
      if (argv.length == 1) {
        return DZ.sorters.exists(argv[0]);
      }
      return false;
    },
    completeArgument: function(index, value, bugId) {
      var options = DZ.sorters.complete(value);
      return options.map(function (v) {return v.slice(value.length)});
    },
    exec: function(name) {
      DZ.store.setSorter(name);
    },
  });

  /********************** :alias ******************/

  DZ.commandLine.registerCommand({
    name: "alias",
    description: "Set a local alias for a bug.",
    keybinding: null,
    validation: "",
    areAgumentsValid: function(argv) { return argv.length == 1; },
    completeArgument: function(index, value, bugId) { return null; },
    exec: function(alias, bugid) {
      var bug = DZ.store.$(bugid);
      bug.alias = alias;
      DZ.layout.drawCursorLine();
    },
  });

  /********************** :unalias ****************/

  DZ.commandLine.registerCommand({
    name: "unalias",
    description: "Remove the local alias.",
    keybinding: null,
    validation: "",
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: function(index, value, bugId) { return null; },
    exec: function(bugid) {
      var bug = DZ.store.$(bugid);
      bug.alias = null;
      DZ.layout.drawCursorLine();
    },
  });


  /********************** :toggleImportant *********/

  DZ.commandLine.registerCommand({
    name: "toggleimportant",
    description: "Toggle the important tag.",
    keybinding: {name: "!"},
    validation: "",
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: function(index, value, bugId) { return null; },
    exec: function(bugid) {
      var bug = DZ.store.$(bugid);
      var idx = bug.tags.indexOf("important");
      if (idx == -1)
        bug.tags.push("important");
      else
        bug.tags.splice(idx, 1);
      DZ.layout.drawCursorLine();
    },
  });

  /********************** :tag *********************/

  DZ.commandLine.registerCommand({
    name: "tag",
    description: "Add and remove custom tags to a bug.",
    keybinding: null,
    validation: null,
    areAgumentsValid: function(argv) {
      if (argv.length == 0) return false;
      for (var i = 0; i < argv.length; i++) {
        var t = argv[i];
        if (t.length < 2) return false;
        if (t[0] != "+" && t[0] != "-") return false;
      }
      return true;
    },
    completeArgument: function(index, value, bugId) {
      if (value[0] = "-") {
        var bug = DZ.store.$(bugId);
        var options = [];
        var prefix = value.slice(1);
        for (var i = 0; i < bug.tags.length; i++)
          if (bug.tags[i].indexOf(prefix) == 0)
            options.push(bug.tags[i].slice(prefix.length));
        return options;
      }
      return [];
    },
    exec: function() {
      var bugId = arguments[arguments.length - 1];
      var bug = DZ.store.$(bugId);
      for (var i = 0; i < arguments.length - 1; i++) {
        var add = arguments[i][0] == "+";
        var t = arguments[i].slice(1);
        var idx = bug.tags.indexOf(t);
        if (add)
          if (idx == -1) bug.tags.push(t);
        else
          if (idx != -1) bug.tags.splice(idx, 1);
      };
      DZ.layout.drawCursorLine();
    },
  });

  /********************** :eval ********************/

  DZ.commandLine.registerCommand({
    name: "eval",
    description: "JavaScript eval. For debug only.",
    keybinding: null,
    validation: "",
    areAgumentsValid: function(argv) { return true; },
    completeArgument: function(index, value, bugId) { return null; },
    exec: function() {
      eval(argv.join(" "));
    },
  });
};

exports.init();

/*
    case "mybugs":
        DZ.bz.getMyBugs();
      break;
    case "reverse":
        DZ.store.toggleReverse();
      break;
    case "blockers":
      if (argc > 0) {
        var id = DZ.layout.getCurrentBugId();
        DZ.bz.getBlockers(argv[1]);
        break;
      }
    case "add":
      if (argc > 0) {
        DZ.bz.fetchBug(argv[1], true);
        break;
      }
  }
}
*/
