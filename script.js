var gamemode = "map";
var blurActive = 0;
var blurDirection = 0;
var canvas,ctx;

var flags = [
  `440440070`, // US
  `602602602`, // Germany
  `740740740`, // Russia
  `220220000`, // China
  `000707000`, // Canada
  `444777000`, // France
  `777003003`, // Belarus
  `000020000`  // Vietnam
].map(item => item.split("").map(jtem => parseInt(jtem)));
var names = ["USA","Germany","Russia","China","Canada","France","Belarus","Vietnam"];

window.onload = function() {
  canvas = document.getElementById("canvas");
  canvas.width = Math.min(window.innerWidth,window.innerHeight);
  canvas.height = Math.min(window.innerWidth,window.innerHeight);
  ctx = canvas.getContext("2d");
  setInterval(function() {
    if ( gamemode == "map" ) renderMap();
    if ( gamemode == "battle" ) renderBattle();
    if ( blurActive > 0 ) {
      var size = Math.min(window.innerWidth,window.innerHeight);
      ctx.fillStyle = "black";
      ctx.fillRect(0,0,size,(blurActive / 100) * (size / 2));
      ctx.fillRect(0,(1 - blurActive / 100 + 1) * (size / 2),size,(blurActive / 100) * (size / 2));
      blurActive += [1,-1][blurDirection];
      if ( blurActive >= 125 ) blurDirection = 1;
    } else {
      blurDirection = 0;
    }
  },10);
  window.onkeydown = function(event) {
    if ( event.key.startsWith("Arrow") ) {
      if ( gamemode == "map" ) handleKeyboardMap(event.key,true);
      if ( gamemode == "battle" ) handleKeyboardBattle(event.key);
    }
  }
  window.onkeyup = function(event) {
    if ( event.key.startsWith("Arrow") ) {
      if ( gamemode == "map" ) handleKeyboardMap(event.key,false);
    }
  }
}
