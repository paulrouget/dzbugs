var keys = [];
var commands = [];

exports.registerBinding = function(cmd) {
  var idx = keys.indexOf(cmd.keybinding.name);
  if (idx == -1) {
    keys.push(cmd.keybinding.name);
    commands.push([]);
    idx = keys.length - 1;
  }
  commands[idx].push(cmd);
}

exports.init = function() {
  DZ.term.on('keypress', function (c, key) {

    if (!key || !key.name) {
      key = {};
      key.name = c;
      key.ctrl = key.shift = false;
    }

    if (DZ.commandLine.isActive()) {
      if (key.name == "escape" || key.name == 'g' && key.ctrl) {
        DZ.commandLine.hide();
      }
    } else {
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
        case ":": setTimeout(function() {DZ.commandLine.show()}, 0); break;
        case "g": if (key.shift) DZ.layout.end(); else DZ.layout.home(); break;
        case "home": DZ.layout.home(); break;
        case "end": DZ.layout.end(); break;
        case "pagedown": DZ.layout.pageDown(); break;
        case "pageup": DZ.layout.pageUp(); break;
        case "down": DZ.layout.selectNextBug(); break;
        case "up": DZ.layout.selectPreviousBug(); break;
        default:
      }
    }
  });
};

this.init();
