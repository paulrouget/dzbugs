// http://upload.wikimedia.org/wikipedia/commons/9/95/Xterm_color_chart.png
var formater = {
  start: function(bug, current, idx, special) {
    var str = "";
    var b = bug.src.bz.data;

    if (current) {
      str += bg(235);
    }

    if (b.status == "RESOLVED" || b.status == "VERIFIED") {
      str += fg(238);
      str += fw(idx + 1, 3, " ", true) + " " + (current? ">" : " ");
      str += '[' + fw(b.id, 6, " ", true) + '] ';
      str += fw(b.status, 8) + " ";
      str += " " + b.summary;
    } else {
      str += fw(idx + 1, 3, " ", true) + " " + (current? ">" : " ");
      str += fg(28) + '[' + fw(b.id, 6, " ", true) + '] ';
      str += fg(220) + fw(b.status, 8) + " " + fgr();
      str += " " + b.summary.replace("[", fg(199) + "[", "g").replace("]", "]" + fgr(), "g");
    }

    return str;
  },
  end: function(bug, current, idx, special) {
    var b = bug.src.bz.data;
    var l = bug.src.local.data;
    return tags(l) + " " + fg(239) + " http://bugzil.la/" + b.id + " ";
  },
}

function tags(l) {
  var str = " ";
  var addComma = false;
  if (l.tags) {
    for (var i = 0; i < l.tags.length; i++) {
      str += (addComma ? ", " : "") + fg(88) + (l.tags[i]);
      str += fgr();
      addComma = true;
    }
  }
  return str;
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
