var gamemode = "map";

window.onload = function() {
  setInterval(function() {
    if ( gamemode == "map" ) renderMap();
  },10);
}
