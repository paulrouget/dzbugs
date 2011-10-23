var DZ;
exports.init = function(aDZ) { DZ = aDZ; }

exports.exec = function(cmd) {
  var argv = cmd.trim().split(/\s+/)
  var argc = argv.length;
  switch (argv[0]) {
    case "quit":
    case "exit":
      process.exit(0);
    break;
    case "add":
      if (argc > 0) {
        DZ.bz.fetchBug(argv[1]);
      }
      break;
    default:
      DZ.error("Can't understand this command: " + cmd);
  }
}
