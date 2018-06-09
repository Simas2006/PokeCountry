var titleMode = 1;
var titleCountryX = 0;
var titleMoving = 0;
var titleAskFinal = false;
var titleWinner = 1;

function renderTitle() {
  // rendering code
  ctx.globalAlpha = 1;
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  if ( titleMode == 0 ) {
    var image = document.getElementById("image");
    ctx.drawImage(image,0,0,canvas.width,canvas.height);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#000099";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
  ctx.globalAlpha = 1;
  ctx.font = canvas.width * 0.125 + "px Menlo";
  ctx.strokeStyle = "white";
  ctx.textAlign = "center";
  ctx.strokeText("PokeCountry",canvas.width * 0.5,canvas.height * 0.25);
  ctx.font = canvas.width * 0.025 + "px Menlo";
  ctx.fillStyle = "white";
  if ( titleMode == 0 ) {
    if ( titleAskFinal ) {
      ctx.fillText("Press Space to start",canvas.width * 0.5,canvas.height * 0.5);
    } else {
      ctx.fillText("Pick a character to play as:",canvas.width * 0.5,canvas.height * 0.5);
      ctx.fillText(Math.abs(titleCountryX - Math.round(titleCountryX)) < 0.01 ? names[Math.round(titleCountryX)] : "",canvas.width * 0.5,canvas.height * 0.5375);
    }
  }
  var radius = canvas.width * 0.11;
  var trueRadius = canvas.width * [0.11,0.065][titleMode];
  for ( var i = 0; i < names.length; i++ ) {
    if ( names[i] == "Switzerland" ) continue;
    if ( titleMode == 1 ) {
      if ( i % 4 == 0 ) radius = canvas.width * 0.1;
      else radius = canvas.width * 0.065;
    }
    var xm = trueRadius * [2.5,1.9][titleMode] * (i - titleCountryX) + (titleMode == 1 ? trueRadius * Math.floor(i / 4) : 0);
    ctx.strokeStyle = "black";
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5 + xm,canvas.height * [0.7,0.6][titleMode],radius,0,2 * Math.PI);
    if ( titleMode == 1 ) ctx.stroke();
    ctx.clip();
    for ( var j = 0; j < flags[i].length; j++ ) {
      var pos = [Math.floor(j / 3),j % 3];
      var pixelPosition = [(pos[0] - 1.5) * (radius / 1.5),(pos[1] - 1.5) * (radius / 1.5)];
      if ( titleMode == 0 ) ctx.globalAlpha = Math.abs(titleCountryX - i) < 0.99 ? 1 : 0.5;
      ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flags[i][j]];
      ctx.fillRect(canvas.width * 0.5 + xm + pixelPosition[0],canvas.height * [0.7,0.6][titleMode] + pixelPosition[1],radius / 1.5,radius / 1.5);
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.arc(canvas.width * 0.45 + xm,canvas.height * [0.65,0.55,0.575][titleMode + (titleMode == 1 && i % 4 > 0 ? 1 : 0)],trueRadius * [0.25,0.4,0.2][titleMode + (titleMode == 1 && i % 4 > 0 ? 1 : 0)],0,2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(canvas.width * 0.55 + xm,canvas.height * [0.65,0.55,0.575][titleMode + (titleMode == 1 && i % 4 > 0 ? 1 : 0)],trueRadius * [0.25,0.4,0.2][titleMode + (titleMode == 1 && i % 4 > 0 ? 1 : 0)],0,2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }
  if ( titleMode == 1 ) {
    radius = canvas.width * 0.11;
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5,canvas.height * 0.71,radius,0,2 * Math.PI);
    ctx.stroke();
    ctx.clip();
    for ( var i = 0; i < flags[titleWinner].length; i++ ) {
      var pos = [Math.floor(i / 3),i % 3];
      var pixelPosition = [(pos[0] - 1.5) * (radius / 1.5),(pos[1] - 1.5) * (radius / 1.5)];
      ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flags[titleWinner][i]];
      ctx.fillRect(canvas.width * 0.5 + pixelPosition[0],canvas.height * 0.71 + pixelPosition[1],radius / 1.5,radius / 1.5);
    }
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(canvas.width * 0.535,canvas.height * 0.675,radius * 0.3,0,2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    var billboardlx = canvas.width * (0.5 + 0.065 * 1.9 * ((groups[titleWinner] * 4 - 0.5) - titleCountryX) + 0.065 * groups[titleWinner]);
    var billboardgx = canvas.width * (0.5 + 0.065 * 1.9 * ((groups[titleWinner] * 4 + 3.5) - titleCountryX) + 0.065 * groups[titleWinner]);
    ctx.fillStyle = "brown";
    ctx.fillRect(billboardlx + canvas.width * 0.0125,canvas.height * 0.225,canvas.width * 0.026,canvas.height * 0.265);
    ctx.fillRect(billboardgx - canvas.width * 0.09,canvas.height * 0.225,canvas.width * 0.026,canvas.height * 0.265);
    ctx.fillStyle = "green";
    ctx.fillRect(billboardlx - canvas.width * 0.025,canvas.height * 0.225,billboardgx - billboardlx,canvas.height * 0.175);
  }
  // internal game code
  if ( titleMoving != 0 ) {
    titleCountryX += titleMoving * 0.05;
    if ( Math.abs(titleCountryX - Math.round(titleCountryX)) < 0.01 ) titleMoving = 0;
  }
  if ( titleMode == 1 ) titleCountryX += 0.01;
}

function handleKeyboardTitle(key) {
  if ( key == "ArrowLeft" && Math.round(titleCountryX) > 0 && ! titleAskFinal && titleMode == 0 ) titleMoving = -1;
  if ( key == "ArrowRight" && Math.round(titleCountryX) < names.length - 2 && ! titleAskFinal && titleMode == 0 ) titleMoving = 1;
  if ( key == " " && titleMode == 0 ) {
    if ( ! titleAskFinal ) {
      titleAskFinal = true;
    } else {
      mapObjects.unshift({
        country: titleCountryX,
        x: -1,
        y: -1,
        direction: 0,
        colored: true,
        exists: true,
        battleData: initialBattleData[Math.round(titleCountryX)]
      });
      blurActive = 1;
      setTimeout(function() {
        gamemode = "map";
      },1250);
    }
  }
}
