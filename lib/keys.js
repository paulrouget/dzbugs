var notify = require("./notifications.js");
var T = require("node-term-ui").TermUI;

exports.keys = {
  init: function(layout) {
    this.layout = layout;
    T.on('keypress', function (err, key) {
      switch(key.name) {
        case "down":
          layout.selectNextBug();
          break;
        case "up":
          layout.selectPreviousBug();
          break;
        default:
      }

    }.bind(this));
  }
}

