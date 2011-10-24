var DZ; var keys = {};

exports.registerBinding = function(cmd) {
  if (!(cmd.keybinding.name in keys)) {
    keys[cmd.keybinding.name] = [];
  }
  keys[cmd.keybinding.name].push(cmd);
}

exports.init = function(aDZ) {
  DZ = aDZ;

  DZ.term.on('keypress', function (c, key) {
    if (DZ.commandLine.isActive()) {
      if (key && key.name == "escape" ||
          key && key.ctrl && key.name == 'g') {
        DZ.commandLine.hide();
      }
    } else {
      if (key) {
        if (key.name in keys) {
          var cmds = keys[key.name];
          for (var i = 0; i < cmds.length; i++) {
            cmds[i].exec();
          }
        } else {
          // some default key bindings
          console.error(key.name);
          switch(key.name) {
            case "d": DZ.layout.delete(); break;
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
      } else {
        switch(c) {
          case ":": setTimeout(function() {DZ.commandLine.show()}, 0); break;
        }
      }
    }
  });
};
