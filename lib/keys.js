var DZ;

exports.init = function(aDZ) {
  DZ = aDZ;

  DZ.term.on('keypress', function (c, key) {
    if (DZ.layout.commandMode) {
      if (key && key.name == "escape") {
        this.layout.hidePrompt();
      }
      if (key && key.ctrl && key.name == 'g') {
        DZ.layout.hidePrompt();
      }
      return;
    }
    if (key) {
      switch(key.name) {
        case "home":
          DZ.layout.home();
        break;
        case "end":
          DZ.layout.end();
        break;
        case "pagedown":
          DZ.layout.pageDown();
        break;
        case "pageup":
          DZ.layout.pageUp();
        break;

        case "down":
          DZ.layout.selectNextBug();
        break;
        case "up":
          DZ.layout.selectPreviousBug();
        break;
        case "q":
          process.exit(0);
        break;
        default:
      }
    } else {
      switch(c) {
        case ":":
          setTimeout(function() {DZ.layout.prompt()}, 0);
        break;
        default:
      }
    }
  });
};
