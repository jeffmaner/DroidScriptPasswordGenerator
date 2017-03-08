// Text Support.
function toLines(s) {
  return s.split("\n");
}

function fromLines(lines) {
  return lines.join("\n");
}

function isNotComment(line) {
  return !line.startsWith("#");
}

function withoutComments(lines) {
  return lines.filter(isNotComment);
}

function stripExtension(fileName) {
  return _.initial(fileName.split(".")).join("");
}

function stripPath(fileName) {
  return _.last(fileName.split("/"));
}
