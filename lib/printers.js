exports.blackAndWhiteText = blackAndWhiteText;

function blackAndWhiteText(aBug) {
  var str = "> [";
  str += aBug.id + "] " + aBug.src.bz.data.summary;
  console.log(str);
}
