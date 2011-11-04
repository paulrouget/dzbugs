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
  bugStart: function(bug, current, idx, bugPage) {
    bugPage = !!bugPage;

    var str = "";
    var b = bug.bz;

    if (current) str += bg(235);
    if (!bugPage)
      str += bug.tags.indexOf("important") != -1 ? "!" : " ";

    var priority = bug.bz.priority;
    if (priority == "P1")
      priority = fg(196) + "#";
    else if (priority == "P2")
      priority = fg(208) + "#";
    else if (priority == "P3")
      priority = fg(190) + "#";
    else
      priority = " ";

    var summary = bug.alias ? bug.alias + "*" : b.summary;

    if ((b.status == "RESOLVED" || b.status == "VERIFIED") && !bugPage) {
      str += fg(238);
      str += fw(idx + 1, 5, " ", true) + " " + (current? "> " : "  ");
      str += ' [' + fw(b.id, 6, " ", true) + '] ';
      str += fw(b.status, 4) + " ";
      str += " " + summary;
    } else {
      if (!bugPage) {
        str += fw(idx + 1, 5, " ", true) + " " + (current? "> " : "  ");
        str += priority;
      }
      str += fg(28) + '[' + fw(b.id, 6, " ", true) + '] ';
      str += fg(220) + fw(b.status, 4) + " " + fgr();
      str += " " + summary.replace("[", fg(199) + "[", "g").replace("]", "]" + fgr(), "g"); //FIXME: works just once
    }

    return str;
  },
  bugEnd: function(bug, current, idx) {
    return fg(288) + bug.tags.join(" ") + " " + fg(239) + " http://bugzil.la/" + bug.id;
  },
  statusStart: function() {
    return bg(244) + fg(0);
  },
  statusEnd: function() {
    var s = DZ.store;
    return "[" + s.getFilterName() + "] [" + s.getSorterName() + "]" + (s.reverse ? "@ ": " ") + s.getCount() + "/" + s.getCountAll();
  },


  fullBug: function(dzBug, bzBug, width) {
    var txt = nl = "\n";
    var bz = bzBug;

    var separator = "";
    for (var i = 1; i < width; i++) separator += "_";
    separator += nl;

    txt += this.bugStart(dzBug, false, null, true) + nl;
    txt += fg(239) + fw("Status:", 15) + fgr() + bz.status + nl;
    txt += fg(239) + fw("Piority:", 15) + fgr() + bz.priority + nl;
    txt += fg(239) + fw("whiteboard:", 15) + fgr() + JSON.stringify(bz.whiteboard) + nl;
    txt += fg(239) + fw("keywords:", 15) + fgr() + bz.keywords + nl;
    txt += fg(239) + fw("Assigned to:", 15) + fgr() + bz.assigned_to.name + nl;
    txt += "_" + separator;

    var comments = bz.comments;

    var idx = 0;
    comments.forEach(function(c) {
      var prefix = idx == 0 ? bg(54) + " " + bgr() + " " : "  ";
      txt += prefix + "comment #" + idx + " by " + fg(198) + c.creator.name + nl;
      var body = c.text.replace(/\n>/g, "\n" + fg(239) + ">" );
      body = body.replace(/\n/g, fgr() + nl + prefix);
      txt += prefix + nl + prefix + body + nl;
      prefix = idx == 0 ? bg(54) + "_" + bgr() : "_";
      txt += prefix + separator;
      idx++;
    });

    return txt;
  },
}

module.exports = formater;
