var gamemode = "map";

window.onload = function() {
  setInterval(function() {
    if ( gamemode == "map" ) renderMap();
  },10);
  window.onkeydown = function(event) {
    if ( event.key.startsWith("Arrow") ) {
      if ( gamemode == "map" ) handleKeyboardMap(event.key,true);
    }
  }
  window.onkeyup = function(event) {
    if ( event.key.startsWith("Arrow") ) {
      if ( gamemode == "map" ) handleKeyboardMap(event.key,false);
    }
  }
}
