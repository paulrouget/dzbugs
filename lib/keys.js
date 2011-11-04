var keys = [];
var commands = [];
var freeze = false;

exports.registerBinding = function(cmd) {
  var idx = keys.indexOf(cmd.keybinding.name);
  if (idx == -1) {
    keys.push(cmd.keybinding.name);
    commands.push([]);
    idx = keys.length - 1;
  }
  commands[idx].push(cmd);
}

exports.freeze = function() {freeze = true}
exports.unfreeze = function() {freeze = false}

exports.init = function() {
  DZ.term.on('keypress', function (c, key) {

    if (freeze) return;

    if (!key || !key.name) {
      key = {};
      key.name = c;
      key.ctrl = key.shift = false;
    }

    // Pager

    if (DZ.pager.isActive()) {
      switch(key.name) {
        case "home": DZ.pager.home(); break;
        case "end": DZ.pager.end(); break;
        case "pagedown": DZ.pager.pageDown(); break;
        case "pageup": DZ.pager.pageUp(); break;
        case "down": DZ.pager.down(); break;
        case "up": DZ.pager.up(); break;
        case "q": DZ.pager.close(); break;
        case "escape": DZ.pager.close(); break; // FIXME: Does this work?
      }
      return;
    }

    // Bug Panel

    if (DZ.bugpanel.isActive()) {
      switch(key.name) {
        case "home": DZ.bugpanel.home(); break;
        case "end": DZ.bugpanel.end(); break;
        case "pagedown": DZ.bugpanel.pageDown(); break;
        case "pageup": DZ.bugpanel.pageUp(); break;
        case "down": DZ.bugpanel.down(); break;
        case "up": DZ.bugpanel.up(); break;
        case "q": DZ.bugpanel.close(); break;
        case "g":
          if (key.shift)
            DZ.bugpanel.end();
          else
            DZ.bugpanel.home();
        break;
        case "escape": DZ.bugpanel.close(); break; // FIXME: Does this work?
      }
      return;
    }
    // Prompt

    if (DZ.commandLine.isActive()) {
      if (key.name == "escape" || key.name == 'g' && key.ctrl)
        DZ.commandLine.hide();
      return;
    }

    // Main view

    var idx = keys.indexOf(key.name);
    if (idx >= 0) {
      // we got some commands to execute
      var cmds = commands[idx];
      for (var i = 0; i < cmds.length; i++) {
        if (!!cmds[i].keybinding.ctrl == key.ctrl &&
            !!cmds[i].keybinding.shift == key.shift)
          cmds[i].exec(DZ.layout.getCurrentBugId());
      }
    }
    switch(key.name) {
      case ":": setTimeout(function() {DZ.commandLine.show(false)}, 0); break;
      case "/": setTimeout(function() {DZ.commandLine.show(true)}, 0); break;
      case "g": if (key.shift) DZ.layout.end(); else DZ.layout.home(); break;
      case "home": DZ.layout.home(); break;
      case "end": DZ.layout.end(); break;
      case "pagedown": DZ.layout.pageDown(); break;
      case "pageup": DZ.layout.pageUp(); break;
      case "down": DZ.layout.selectNextBug(); break;
      case "up": DZ.layout.selectPreviousBug(); break;
      default:
    }
  });
};

this.init();
