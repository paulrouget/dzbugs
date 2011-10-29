exports.fixedWidth = function(str, width, alignRight) {
  str = "" + str;
  if (str.length > width)
    return str.substr(0, width);
  while (str.length < width) {
    if (alignRight)
      str = " " + str;
    else
      str += " ";
  }
  return str;
}
