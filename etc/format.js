// http://upload.wikimedia.org/wikipedia/commons/9/95/Xterm_color_chart.png
var formater = {
  start: function(bug, current, idx, special) {
    var str = "";
    var b = bug.src.bz.data;

    if ((b.status == "RESOLVED" || b.status == "VERIFIED") && !current) {
      str += fg(238);
      str += fw(idx + 1, 3, " ", true) + " " + (current? ">" : " ");
      str += '[' + fw(b.id, 6, " ", true) + '] ';
      str += fw(b.status, 8) + " ";
      str += " " + b.summary;
    } else {
      var bgd = current ? bg(234):"";
      str = bgd + fw(idx + 1, 3, " ", true) + " " + (current? ">" : " ");
      str += fg(28) + '[' + fw(b.id, 6, " ", true) + '] ';
      str += fg(220) + fw(b.status, 8) + " " + bgr() + fgr();
      str += " " + b.summary.replace("[", fg(199) + "[").replace("]", "]" + fgr());
    }

    return str;
  },
  end: function(bug, current, idx, special) {
    var b = bug.src.bz.data;
    return b.last_change_time + " " + (b.priority == "--" ? "  ":b.priority) + " " + fg(239) + " http://bugzil.la/" + b.id + " ";
  },
}

var fw = function fixedWidth(str, max, /* optional */ c, /* optional */ alignRight) {
  str = "" + str;
  if (str.length > max) {
    return str.substr(0, max);
  } else {
    if (!c) c = " ";
    while (str.length < max) {
      if (alignRight) {
        str = c + str;
      } else {
        str += c;
      }
    }
    return str;
  }
}

var fg = function setFGColor(value) {
  return '#{"fg": ' + value + '}';
}
var bg = function setBGColor(value) {
  return '#{"bg": ' + value + '}';
}
var fgr = function resetFgColor() {
  return '#{"fgreset": true}';
}

var bgr = function resetBgColor() {
  return '#{"bgreset": true}';
}

for (var i in formater) {
  exports[i] = formater[i];
}
