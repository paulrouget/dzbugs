// 256 colors: http://upload.wikimedia.org/wikipedia/commons/9/95/Xterm_color_chart.png

// set foreground color:
var fg = function setFGColor(value) {return '#{"fg": ' + value + '}';}
var bg = function setBGColor(value) {return '#{"bg": ' + value + '}';}
// reset foreground:
var fgr = function resetFgColor() {return '#{"fgreset": true}';}
// reset background:
var bgr = function resetBgColor() {return '#{"bgreset": true}';}
// fixed width:
var fw = DZ.utils.fixedWidth;

var formater = {
  bugStart: function(bug, current, idx) {
    var str = "";
    var b = bug.bz;

    if (current) str += bg(235);
    str += bug.tags.indexOf("important") != -1 ? "!" : " ";

    if (b.status == "RESOLVED" || b.status == "VERIFIED") {
      str += fg(238);
      str += fw(idx + 1, 5, " ", true) + " " + (current? ">" : " ");
      str += '[' + fw(b.id, 6, " ", true) + '] ';
      str += fw(b.status, 8) + " ";
      summary = bug.alias ? bug.alias + "*" : b.summary;
      str += " " + summary;
    } else {
      str += fw(idx + 1, 5, " ", true) + " " + (current? ">" : " ");
      str += fg(28) + '[' + fw(b.id, 6, " ", true) + '] ';
      str += fg(220) + fw(b.status, 8) + " " + fgr();
      summary = bug.alias ? bug.alias + "*" : b.summary;
      str += " " + summary.replace("[", fg(199) + "[", "g").replace("]", "]" + fgr(), "g"); //FIXME: works just once
    }

    return str;
  },
  bugEnd: function(bug, current, idx) {
    return JSON.stringify(bug.bz.cc);
    //return fg(288) + bug.tags.join(" ") + " " + fg(239) + " http://bugzil.la/" + bug.id;
  },
  statusStart: function() {
    return bg(244) + fg(0);
  },
  statusEnd: function() {
    var s = DZ.store;
    return "[" + s.getFilterName() + "] [" + s.getSorterName() + "]" + (s.reverse ? "@ ": " ") + s.getCount() + "/" + s.getCountAll();
  }
}

module.exports = formater;
