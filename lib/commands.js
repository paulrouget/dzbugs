/**
 * cmd: {
 *  @param name
 *  @param description
 *  @param keybinding {ctrl: boolean, shift: boolean, name: string}
 *  @param exec Actual command.
 *         function (argv) {}
 *  @param areAgumentsValid
 *         function (argv) {}
 *  @param completeArgument
 *         function (index, value, bugId) {}
 * }
 */

exports.init = function() {

  /********************** :foobar ********************/

  DZ.commandLine.registerCommand({
    name: "foobar",
    areAgumentsValid: function(argv) { return true },
    completeArgument: function(index, value, bugId) { return null; },
    exec: function() {
      var bug = DZ.store.$(arguments[0]);
      DZ.log(JSON.stringify(bug.bz.cc));
    }
  });

  /********************** :help ********************/

  DZ.commandLine.registerCommand({
    name: "help",
    description: "Display this help.",
    synopsis: "help",
    keybinding: {name: "?"},
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: function(index, value, bugId) { return null; },
    exec: function() {
      DZ.pager.open(DZ.commandLine.buildHelp());
    },
  });

  /********************** :quit ********************/

  DZ.commandLine.registerCommand({
    name: "quit",
    description: "Quit the program.",
    keybinding: {name: "q"},
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: function(index, value, bugId) { return null; },
    exec: function() {
      DZ.layout.cleanBeforeExit();
      process.exit(0);
    },
  });

  /********************** :open ********************/

  DZ.commandLine.registerCommand({
    name: "open",
    description: "Open a bug.",
    synopsis: "open [bugid]",
    keybinding: {name: "enter"},
    areAgumentsValid: function(argv) { return argv.length == 1; },
    completeArgument: function(index, value, bugId) { return null; },
    exec: function() {
        DZ.bugpanel.open(arguments[0]);
    },
  });

  /********************** :load ********************/

  DZ.commandLine.registerCommand({
    name: "load",
    description: "Load from cache.",
    keybinding: null,
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: null,
    exec: function() { DZ.store.load() },
  });

  /********************** :sidebar ********************/

  DZ.commandLine.registerCommand({
    name: "sidebar",
    description: "Toggle the sidebar.",
    keybinding: {name: "b", ctrl: true},
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: null,
    exec: function() { DZ.layout.toggleSidebar() },
  });

  /********************** :save ********************/

  DZ.commandLine.registerCommand({
    name: "save",
    description: "Save to cache.",
    keybinding: null,
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: null,
    exec: function() { DZ.store.save() },
  });

  /********************** :delete ******************/

  DZ.commandLine.registerCommand({
    name: "delete",
    synopsis: "delete 615243 456389",
    description: "Delete bugs from the list.",
    keybinding: {name: "d"},
    areAgumentsValid: function(argv) { return argv.length > 1; },
    completeArgument: function() {
      // FIXME
    },
    exec: function() {
      if (arguments.length == 1) { // From shortcut
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
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: null,
    exec: function() { DZ.layout.invalidateAll() },
  });

  /********************** :filter ******************/

  DZ.commandLine.registerCommand({
    name: "filter",
    synopsis: "filter filterName",
    description: "Filter the bugs.",
    keybinding: null,
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
    name: "revert",
    description: "Revert the sort order.",
    keybinding: {name: "@"},
    areAgumentsValid: function(argv) { return argv.length == 0; },
    completeArgument: null,
    exec: function(name) {
      DZ.store.toggleReverse();
      DZ.layout.invalidateAll();
    },
  });

  /********************** :sort ********************/

  DZ.commandLine.registerCommand({
    name: "sort",
    synopsis: "sort sortMethod",
    description: "Sort the bugs.",
    keybinding: null,
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
      DZ.layout.invalidateAll();
    },
  });

  /********************** :alias ******************/

  DZ.commandLine.registerCommand({
    name: "alias",
    synopsis: "alias 'new name'",
    description: "Set a local alias for a bug.",
    keybinding: null,
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
    synopsis: "tag +tag1 +tag2 -tag3",
    description: "Add and remove custom tags to a bug.",
    keybinding: null,
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

  /********************** :fetch ********************/

  DZ.commandLine.registerCommand({
    name: "fetch",
    synopsis: "fetch :fetch source1 source2",
    description: "Fetch all the sources, or some of them.",
    keybinding: {name: "o", shift: true},
    areAgumentsValid: function(argv) { /*FIXME*/ return true; },
    completeArgument: function(index, value, bugId) { /*FIXME*/ return null; },
    exec: function() {
      DZ.fetcher.fetch();
    },
  });

  /********************** :eval ********************/

  DZ.commandLine.registerCommand({
    name: "eval",
    synopsis: "eval someJS()",
    description: "JavaScript eval. For debug only.",
    keybinding: null,
    areAgumentsValid: function(argv) { return true; },
    completeArgument: function(index, value, bugId) { return null; },
    exec: function() {
      // FIXME
      eval(argv.join(" "));
    },
  });

  /********************** :list ********************/

  DZ.commandLine.registerCommand({
    name: "list",
    synopsis: "list filters  :list sorters",
    description: "List available filters or sorters.",
    keybinding: null,
    areAgumentsValid: function(argv) {
      if (argv.length != 1) return false;
      return (argv[0] == "filters" || argv[0] == "sorters");
    },
    completeArgument: function(index, value, bugId) {
      var options = [];
      if ("filters".indexOf(value) == 0)
        options.push("filters");
      if ("sorters".indexOf(value) == 0)
        options.push("sorters");
      return options.map(function (v) {return v.slice(value.length)});
    },
    exec: function(what) {
      var txt = what + ":\n\n";
      var list;
      if (what == "filters")
        list = DZ.filters.getAll();
      if (what == "sorters")
        list = DZ.sorters.getAll();
      for (var name in list) {
        txt += DZ.utils.fixedWidth(name, 25);
        txt += list[name].description + "\n";
      }
      DZ.pager.open(txt);
    },
  });
};
exports.init();
