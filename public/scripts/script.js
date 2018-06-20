var gamemode = "title";
var blurActive = 0;
var blurDirection = 0;
var completedGyms = {
  us: false,
  eu: false,
  ru: false,
  ch: false
}
var canvas,ctx;

function drawRoundedRect(radius,x,y,width,height) {
  ctx.beginPath();
  ctx.moveTo(x + radius,y);
  ctx.lineTo(x + width - radius,y);
  ctx.quadraticCurveTo(x + width,y,x + width,y + radius);
  ctx.lineTo(x + width,y + height - radius);
  ctx.quadraticCurveTo(x + width,y + height,x + width - radius,y + height);
  ctx.lineTo(x + radius,y + height);
  ctx.quadraticCurveTo(x,y + height,x,y + height - radius);
  ctx.lineTo(x,y + radius);
  ctx.quadraticCurveTo(x,y,x + radius,y);
  ctx.closePath();
}

function drawFlag(flag,x,y,radius,rotation) {
  var matrices = [
    [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]],
    [[2,0],[1,0],[0,0],[2,1],[1,1],[0,1],[2,2],[1,2],[0,2]],
    [[2,2],[2,1],[2,0],[1,2],[1,1],[1,0],[0,2],[0,1],[0,0]],
    [[0,2],[1,2],[2,2],[0,1],[1,1],[2,1],[0,0],[1,0],[2,0]]
  ];
  for ( var i = 0; i < flag.length; i++ ) {
    var pos = matrices[rotation % 4][i];
    var pixelPosition = [(pos[0] - 1.5) * (radius / 1.5),(pos[1] - 1.5) * (radius / 1.5)];
    ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flag[i]];
    ctx.fillRect(x + pixelPosition[0],y + pixelPosition[1],radius / 1.5,radius / 1.5);
  }
}

window.onload = function() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  setInterval(function() {
    if ( ! localStorage.getItem("wins") ) localStorage.setItem("wins","");
    ctx.textBaseline = "alphabetic";
    canvas.width = Math.min(window.innerWidth,window.innerHeight);
    canvas.height = Math.min(window.innerWidth,window.innerHeight);
    if ( gamemode == "map" ) renderMap();
    else if ( gamemode == "battle" ) renderBattle();
    else if ( gamemode == "bossfight" ) renderBossFight();
    else if ( gamemode == "title" ) renderTitle();
    else if ( gamemode == "stop" ) renderStop();
    else throw new Error("Invalid gamemode");
    renderNPC();
    renderMenu();
    if ( blurActive > 0 ) {
      var size = Math.min(canvas.width,canvas.height);
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
    if ( event.key.startsWith("Arrow") || event.key == " " ) {
      if ( npcTextDrawing ) {
        handleKeyboardNPC(event.key);
      } else if ( gamemode == "map" ) {
        if ( ! menuActive ) handleKeyboardMap(event.key,true);
        else handleKeyboardMenu(event.key);
      } else if ( gamemode == "battle" ) {
        handleKeyboardBattle(event.key);
      } else if ( gamemode == "bossfight" ) {
        handleKeyboardBoss(event.key,true);
      } else if ( gamemode == "title" ) {
        handleKeyboardTitle(event.key,true);
      }
    }
    if ( ["1","2","3","4"].indexOf(event.key) > -1 && gamemode == "bossfight" ) handleKeyboardBoss(event.key,true);
    if ( event.key == "m" && gamemode == "map" ) handleKeyboardMenu(event.key,true);
    if ( event.key == "x" && gamemode == "map" ) handleKeyboardMap(event.key,true);
  }
  window.onkeyup = function(event) {
    if ( event.key.startsWith("Arrow") || event.key == " " ) {
      if ( gamemode == "map" ) handleKeyboardMap(event.key,false);
      else if ( gamemode == "bossfight" ) handleKeyboardBoss(event.key,false);
    }
    if ( event.key == "x" && gamemode == "map" ) handleKeyboardMap(event.key,false);
  }
}
