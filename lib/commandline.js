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
    case "mybugs":
        DZ.bz.getMyBugs();
      break;
    case "load":
      DZ.store.load();
    break;
    case "save":
      DZ.store.save();
    break;
    case "reverse":
        DZ.store.toggleReverse();
      break;
    case "sort":
      if (argc > 0) {
        DZ.store.setSorter(argv[1]);
      }
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
