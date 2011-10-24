/**
 * cmd: {
 *  @param name
 *  @param description
 *  @param synopsis
 *  @param needsCurrentBugId
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

var DZ; exports.init = function(dz) {
  DZ = dz;

  /********************** :quit ********************/

  DZ.commandLine.registerCommand({
    name: "quit",
    description: "Quit the program.",
    synopsis: "",
    needsCurrentBugId: false,
    keybinding: {name: "q"},
    validation: "Quit DZBugs? ([yes]/no):",
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: function(index, value, bugId) { return null; },
    exec: function() {
      DZ.term.pos(1, 1);
      DZ.term.clear();
      process.exit(0);
    },
  });

  /********************** :load ********************/

  DZ.commandLine.registerCommand({
    name: "load",
    description: "Load cache.",
    synopsis: "",
    needsCurrentBugId: false,
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
    synopsis: "",
    needsCurrentBugId: false,
    keybinding: null,
    validation: null,
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: null,
    exec: function() { DZ.store.save() },
  });

  /********************** :redraw ******************/

  DZ.commandLine.registerCommand({
    name: "redraw",
    description: "Redraw the screen.",
    synopsis: "",
    needsCurrentBugId: false,
    keybinding: {name: "l", ctrl: true},
    validation: null,
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: null,
    exec: function() { DZ.layout.redrawAll() },
  });

  /********************** :tag *********************/

  DZ.commandLine.registerCommand({
    name: "tag",
    description: "Add and remove custom tags to a bug.",
    synopsis: "tag +tag1 +tag2 -tag3",
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
        var data = DZ.store.$(bugId).src.local.data;
        var options = [];
        var prefix = value.slice(1);
        if (!data.tags) return [];
        for (var i = 0; i < data.tags.length; i++)
          if (data.tags[i].indexOf(prefix) == 0)
            options.push(data.tags[i].slice(prefix.length));
        return options;
      }
      return [];
    },
    exec: function(argv, bugId) {
      var data = DZ.store.$(bugId).src.local.data;
      if (!data.tags) data.tags = [];
      for (var i = 0; i < argv.length; i++) {
        var t = argv[i].slice(1);
        var idx = data.tags.indexOf(t);
        if (argv[i][0] == "+") {
          if (idx == -1) data.tags.push(t);
        } else {
          if (argv[i][0] == "-" && idx != -1)
            data.tags.splice(idx, 1);
        }
      };
      DZ.layout.redrawCursorLine();
    },
  });
};

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
    case "sort":
      if (argc > 0) {
        DZ.store.setSorter(argv[1]);
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
