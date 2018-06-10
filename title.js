var titleMode = 2;
var titleCountryX = -6.5;
var titleMoving = 0;
var titleStopped = 0;
var titleAskFinal = false;
var titleWinner = 0;
var titleWinYMod = 0;
var titleWinYVel = 0;
var titleLoseYMod = 0;
var titleBounceVel = 0;
var titleBounceYMod = 0;
var titleGhostY = 1;

function renderTitle() {
  // rendering code
  ctx.lineWidth = 1;
  ctx.globalAlpha = 1;
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = "black";
  ctx.strokeRect(0,0,canvas.width,canvas.height);
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
  ctx.font = canvas.width * 0.035 + "px Menlo";
  ctx.fillStyle = "white";
  if ( titleMode == 0 ) {
    if ( titleAskFinal ) {
      ctx.fillText("Press Space to start",canvas.width * 0.5,canvas.height * 0.5);
    } else {
      ctx.fillText("Pick a character to play as:",canvas.width * 0.5,canvas.height * 0.5);
      ctx.fillText(Math.abs(titleCountryX - Math.round(titleCountryX)) < 0.01 ? names[Math.round(titleCountryX)] : "",canvas.width * 0.5,canvas.height * 0.5375);
    }
  }
  if ( titleMode < 2 ) {
    var radius = canvas.width * 0.11;
    var trueRadius = canvas.width * [0.11,0.065][titleMode];
    for ( var i = 0; i < [names.length,16][titleMode]; i++ ) {
      if ( names[i] == "Switzerland" ) continue;
      if ( titleMode == 1 ) {
        if ( i % 4 == 0 ) radius = canvas.width * 0.1;
        else radius = canvas.width * 0.065;
      }
      var xm = trueRadius * [2.5,1.9][titleMode] * (i - titleCountryX) + (titleMode == 1 ? trueRadius * Math.floor(i / 4) : 0);
      var ym = (Math.floor(i / 4) == groups[titleWinner] ? -titleWinYMod : 0) + (Math.floor(i / 4) == ((groups[titleWinner] + 2) % 4) ? titleLoseYMod : 0);
      ctx.strokeStyle = "black";
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width * 0.5 + xm,canvas.height * [0.7,0.6][titleMode] + ym,radius,0,2 * Math.PI);
      if ( titleMode == 1 ) ctx.stroke();
      ctx.clip();
      for ( var j = 0; j < flags[i].length; j++ ) {
        var pos = [Math.floor(j / 3),j % 3];
        var pixelPosition = [(pos[0] - 1.5) * (radius / 1.5),(pos[1] - 1.5) * (radius / 1.5)];
        if ( titleMode == 0 ) ctx.globalAlpha = Math.abs(titleCountryX - i) < 0.99 ? 1 : 0.5;
        ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flags[i][j]];
        ctx.fillRect(canvas.width * 0.5 + xm + pixelPosition[0],canvas.height * [0.7,0.6][titleMode] + ym + pixelPosition[1],radius / 1.5,radius / 1.5);
        ctx.fillStyle = Math.floor(i / 4) == (groups[titleWinner] + 2) % 4 && titleLoseYMod <= 1.2 && titleMode == 1 ? "red" : "white";
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(canvas.width * [0.45,0.45,0.475][titleMode + (titleMode == 1 && i % 4 > 0 ? 1 : 0)] + xm,canvas.height * [0.65,0.55,0.575][titleMode + (titleMode == 1 && i % 4 > 0 ? 1 : 0)] + ym,trueRadius * [0.25,0.4,0.2][titleMode + (titleMode == 1 && i % 4 > 0 ? 1 : 0)],0,2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(canvas.width * [0.55,0.55,0.525][titleMode + (titleMode == 1 && i % 4 > 0 ? 1 : 0)] + xm,canvas.height * [0.65,0.55,0.575][titleMode + (titleMode == 1 && i % 4 > 0 ? 1 : 0)] + ym,trueRadius * [0.25,0.4,0.2][titleMode + (titleMode == 1 && i % 4 > 0 ? 1 : 0)],0,2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  if ( titleMode == 1 ) {
    radius = canvas.width * 0.11;
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5,canvas.height * 0.71 - titleBounceYMod,radius,0,2 * Math.PI);
    ctx.stroke();
    ctx.clip();
    for ( var i = 0; i < flags[titleWinner].length; i++ ) {
      var pos = [Math.floor(i / 3),i % 3];
      var pixelPosition = [(pos[0] - 1.5) * (radius / 1.5),(pos[1] - 1.5) * (radius / 1.5)];
      ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flags[titleWinner][i]];
      ctx.fillRect(canvas.width * 0.5 + pixelPosition[0],canvas.height * 0.71 - titleBounceYMod + pixelPosition[1],radius / 1.5,radius / 1.5);
    }
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(canvas.width * 0.535,canvas.height * 0.675 - titleBounceYMod,radius * 0.3,0,2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    var billboardlx = canvas.width * (0.5 + 0.065 * 1.9 * ((groups[titleWinner] * 4 - 0.5) - titleCountryX) + 0.065 * groups[titleWinner]);
    var billboardgx = canvas.width * (0.5 + 0.065 * 1.9 * ((groups[titleWinner] * 4 + 3.5) - titleCountryX) + 0.065 * groups[titleWinner]);
    ctx.fillStyle = "brown";
    ctx.fillRect(billboardlx + canvas.width * 0.0125,canvas.height * 0.225 - titleWinYMod,canvas.width * 0.026,canvas.height * 0.265);
    ctx.fillRect(billboardgx - canvas.width * 0.09,canvas.height * 0.225 - titleWinYMod,canvas.width * 0.026,canvas.height * 0.265);
    ctx.fillStyle = "green";
    ctx.fillRect(billboardlx - canvas.width * 0.025,canvas.height * 0.225 - titleWinYMod,billboardgx - billboardlx,canvas.height * 0.175);
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.font = canvas.width * 0.075 + "px Menlo";
    ctx.fillText("WE   ",billboardlx + (billboardgx - billboardlx) * 0.275,canvas.height * 0.3435 - titleWinYMod);
    ctx.font = canvas.width * 0.1 + "px Menlo";
    ctx.fillText("   ♡ ",billboardlx + (billboardgx - billboardlx) * 0.275,canvas.height * 0.35 - titleWinYMod);
    ctx.beginPath();
    ctx.arc(billboardlx + (billboardgx - billboardlx) * 0.75,canvas.height * 0.3125 - titleWinYMod,canvas.width * 0.075,0,2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(billboardlx + (billboardgx - billboardlx) * 0.6,canvas.height * 0.3125 - titleWinYMod);
    ctx.lineTo(billboardlx + (billboardgx - billboardlx) * 0.9,canvas.height * 0.3125 - titleWinYMod);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(billboardlx + (billboardgx - billboardlx) * 0.675,canvas.height * 0.2875 - titleWinYMod,canvas.width * 0.015,0,2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(billboardlx + (billboardgx - billboardlx) * 0.825,canvas.height * 0.2875 - titleWinYMod,canvas.width * 0.015,0,2 * Math.PI);
    ctx.stroke();
  }
  if ( titleMode == 2 ) {
    ctx.fillStyle = "black";
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5,titleGhostY * 1.5,titleGhostY,0,2 * Math.PI);
    ctx.fill();
    ctx.fillRect(canvas.width * 0.5 - titleGhostY,titleGhostY * 1.5,titleGhostY * 2,titleGhostY * 1.25);
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.5 - titleGhostY,titleGhostY * 2.75);
    ctx.lineTo(canvas.width * 0.5 - (titleGhostY * 0.666),titleGhostY * 3.5);
    ctx.lineTo(canvas.width * 0.5 - (titleGhostY * 0.333),titleGhostY * 2.75);
    ctx.lineTo(canvas.width * 0.5,titleGhostY * 3.5);
    ctx.lineTo(canvas.width * 0.5 + (titleGhostY * 0.333),titleGhostY * 2.75);
    ctx.lineTo(canvas.width * 0.5 + (titleGhostY * 0.666),titleGhostY * 3.5);
    ctx.lineTo(canvas.width * 0.5 + titleGhostY,titleGhostY * 2.75);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5,titleGhostY * 1.5,titleGhostY * 0.8,0,2 * Math.PI);
    ctx.clip();
    var radius = titleGhostY * 0.8;
    for ( var i = 0; i < flags[titleWinner].length; i++ ) {
      var pos = [Math.floor(i / 3),i % 3];
      var pixelPosition = [(pos[0] - 1.5) * (radius / 1.5),(pos[1] - 1.5) * (radius / 1.5)];
      ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flags[titleWinner][i]];
      ctx.fillRect(canvas.width * 0.5 + pixelPosition[0],titleGhostY * 1.5 + pixelPosition[1],radius / 1.5,radius / 1.5);
    }
    ctx.restore();
  }
  // internal game code
  if ( titleMode == 0 ) {
    titleCountryX += titleMoving * 0.05;
    if ( Math.abs(titleCountryX - Math.round(titleCountryX)) < 0.01 ) titleMoving = 0;
  }
  if ( titleMode == 1 ) {
    if ( titleStopped == 0 ) titleCountryX += 0.01;
    if ( titleWinYVel > 0 || titleWinYMod > 0 ) {
      titleWinYMod += titleWinYVel;
      titleWinYVel -= 0.1;
    } else {
      titleWinYVel = 4;
    }
    if ( Math.floor(titleCountryX) == (groups[titleWinner] + 2) % 4 * 4 + 1 ) titleLoseYMod = 1;
    titleLoseYMod *= 1.075;
    if ( Math.round(titleCountryX) == 19 ) titleBounceVel = 1;
    if ( titleBounceVel > 0 || titleBounceYMod > 0 ) {
      titleBounceVel -= 0.05;
      titleCountryX -= (titleBounceVel + 1) * 0.125;
      titleBounceYMod += titleBounceVel * 7.5;
      titleStopped = 1;
    } else if ( titleStopped == 1 ) {
      setTimeout(function() {
        titleMode = 2;
      },750);
      titleStopped = 2;
    }
  }
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
