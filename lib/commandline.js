var readline, _ttyWrite, active = false;
var commands = {};

exports.registerCommand = function(cmd) {
  commands[cmd.name] = cmd;
  if (cmd.keybinding) {
    DZ.keys.registerBinding(cmd);
  }
}

exports.init = function() {
  readline = require('readline').createInterface(process.stdin,
                                                 process.stdout,
                                                 completer);

  // we wrap the readline internal 'write' function to prevent it
  // to create a new line on 'return'.
  var _write = readline.output.write;
  readline.output.write = function(c) {
    if (c != '\r\n') _write.call(readline.output, c);
  }

  _ttyWrite = readline._ttyWrite;

  var prompt = ":";
  readline.setPrompt(prompt, prompt.length);

  this.hide();

  readline.on('line', function (line) {
    this.hide();
    var argv = parseLine(line);
    var cmd = argv[0];
    if (!(cmd in commands)) {
      DZ.error(" command not found: " + cmd);
    } else {
      cmd = commands[cmd];
      if (!cmd.areAgumentsValid(argv.slice(1))) {
        DZ.error(" invalid option or syntax: " + line);
      } else {
        argv = argv.slice(1);
        argv.push(DZ.layout.getCurrentBugId());
        cmd.exec.apply(DZ, argv);
      }
    }
  }.bind(this));
};

function completer(prefix) {
  var options = [];
  var argv = parseLine(prefix);
  if (argv.length == 1) { // completing command
    for (var name in commands)
      if (name.indexOf(prefix) == 0)
        options.push(name);
    if (options.length == 1)
      options[0] += " ";
    return [options, prefix];
  } else { // completing arguments
    var cmd = argv[0];
    if (!(cmd in commands)) return [];
    if (!commands[cmd].completeArgument) return [];
    var idx = argv.length - 1;
    var bugId = DZ.layout.getCurrentBugId();
    options = commands[cmd].completeArgument(idx, argv[idx], bugId);
    options = options ? options : [];
    return [options.map(function(o){return prefix + o}), prefix];
  }
}

function parseLine(line) {
  return line.trim().split(/\s+/)
}

exports.show = function() {
  active = true;
  readline._ttyWrite = _ttyWrite;
  DZ.term.pos(1, DZ.layout.height + 2);
  DZ.term.eraseLine();
  DZ.term.showCursor();
  readline.prompt();
}

exports.hide = function() {
  DZ.term.hideCursor();
  readline.line = "";
  readline._ttyWrite = function() {};
  DZ.term.pos(1, DZ.layout.height + 2);
  DZ.term.eraseLine();
  active = false;
}

exports.isActive = function() {return active};

exports.buildHelp = function() {
  var txt = "";
  txt += DZ.utils.fixedWidth("shortcut", 25);
  txt += DZ.utils.fixedWidth("command", 35);
  txt += "description";
  txt += "\n";
  txt += "==========================================================================\n";
  for (var name in commands) {
    var cmd = commands[name];
    var k = "";
    if (cmd.keybinding) {
      if (cmd.keybinding.ctrl)
        k += "ctrl+";
      if (cmd.keybinding.shift)
        k += "shift+";
      k += cmd.keybinding.name;
    }
    txt += DZ.utils.fixedWidth(k, 25);
    var synopsis = cmd.synopsis ? cmd.synopsis : cmd.name;
    txt += DZ.utils.fixedWidth(":" + synopsis, 35);
    txt += cmd.description;
    txt += "\n";
  }
  return txt;
}

this.init();
