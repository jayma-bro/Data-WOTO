var popHelp = function(content, direction) {
  if (direction === undefined) {
    direction = "right"
  }
 return '<img src="assets/images/logo question.png" alt="" data-container="body" data-toggle="popover" data-placement="' + direction + '" data-content="' + content + '" height="20">';
}

module.exports = popHelp;
