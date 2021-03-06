var titleMode = 0;
var titleCountryX = 0;
var titleMoving = 0;
var titleStopped = 0;
var titleAskNumber = 0;
var titleWinner = 0;
var titleWinYMod = 0;
var titleWinYVel = 0;
var titleLoseYMod = 0;
var titleBounceVel = 0;
var titleBounceYMod = 0;
var titleGhostY = -35;
var titleEndGameActive = -1;
var titleEndGameWait = 0;

function renderTitle() {
  // rendering code
  var hasWon = ["u","e","r","c"].filter(item => localStorage.getItem("wins").indexOf(item) > -1).length >= 4;
  ctx.lineWidth = 1;
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
  if ( titleMode == 0 ) {
    ctx.strokeText("PokeCountry",canvas.width * 0.5,canvas.height * 0.25);
  }
  ctx.font = canvas.width * 0.035 + "px Menlo";
  ctx.fillStyle = "white";
  if ( titleMode == 0 ) {
    if ( titleAskNumber > 0 ) {
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
      if ( names[i] == "Switzerland" && ! (hasWon && titleMode == 0) ) continue;
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
      drawFlag(flags[i],canvas.width * 0.5 + xm,canvas.height * [0.7,0.6][titleMode] + ym,radius,0);
      ctx.restore();
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
  }
  if ( titleMode == 0 ) {
    for ( var i = 0; i < 4; i++ ) {
      var x = canvas.width * 0.6725 + canvas.width * 0.085 * i;
      if ( localStorage.getItem("wins").indexOf("uerc".split("")[i]) > -1 ) {
        ctx.fillStyle = ["#00aaff","#ff7700","#777777","#ff7700"][i];
        ctx.beginPath();
        ctx.arc(x,canvas.width * 0.0425 + 10,canvas.width * 0.0425,0,2 * Math.PI);
        ctx.fill();
        ctx.lineWidth = canvas.width * 0.01;
        ctx.strokeStyle = ["blue","yellow","white","red"][i];
        ctx.beginPath();
        ctx.arc(x,canvas.height * 0.0425 + 10,canvas.width * 0.0275,0,2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "gold";
        drawStar(x,canvas.height * 0.0425 + 10,5,canvas.width * 0.0185,canvas.width * 0.01);
        ctx.fill();
      }
    }
  }
  if ( titleMode == 1 ) {
    radius = canvas.width * 0.11;
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5,canvas.height * 0.71 - titleBounceYMod,radius,0,2 * Math.PI);
    ctx.stroke();
    ctx.clip();
    drawFlag(flags[titleWinner],canvas.width * 0.5,canvas.height * 0.71 - titleBounceYMod,radius,0);
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
  if ( titleMode == 2 && titleGhostY > 0 ) {
    ctx.fillStyle = "black";
    if ( titleGhostY > canvas.height * 0.5 ) {
      ctx.globalAlpha = (titleGhostY - canvas.height * 0.5) / (canvas.height * 0.95);
      ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    ctx.globalAlpha = 1;
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
    ctx.save();
    var radius = titleGhostY * 0.8;
    if ( titleEndGameActive > -1 ) {
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.5,titleGhostY * 1.5);
      ctx.arc(canvas.width * 0.5,titleGhostY * 1.5,radius,0,2 * Math.PI);
      ctx.stroke();
      ctx.clip();
      drawFlag(flags[Math.floor(titleEndGameActive)],canvas.width * 0.5,titleGhostY * 1.5,radius,0);
      ctx.restore();
      titleEndGameActive += 0.125;
      titleEndGameActive %= 4;
    } else {
      ctx.beginPath();
      ctx.arc(canvas.width * 0.5,titleGhostY * 1.5,radius,0,2 * Math.PI);
      ctx.clip();
      drawFlag(flags[titleWinner],canvas.width * 0.5,titleGhostY * 1.5,radius,0);
      ctx.restore();
    }
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5 - (titleGhostY * 0.333),titleGhostY * 1.2,titleGhostY * 0.225,0,2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5 + (titleGhostY * 0.333),titleGhostY * 1.2,titleGhostY * 0.225,0,2 * Math.PI);
    ctx.fill();
    ctx.stroke();
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
      titleWinYVel -= canvas.width * 0.0002;
    } else {
      titleWinYVel = canvas.width * 0.0104;
    }
    if ( Math.floor(titleCountryX) == (groups[titleWinner] + 2) % 4 * 4 + 1 ) titleLoseYMod = 1;
    titleLoseYMod *= 1.075;
    if ( Math.round(titleCountryX) == 19 ) titleBounceVel = canvas.width * 0.0026;
    if ( titleBounceVel > 0 || titleBounceYMod > 0 ) {
      titleBounceVel -= canvas.width * 0.00013;
      titleCountryX -= (titleBounceVel + 1) * 0.125;
      titleBounceYMod += titleBounceVel * 7.5;
      titleStopped = 1;
    } else if ( titleStopped == 1 ) {
      setTimeout(function() {
        titleMode = 2;
      },1250);
      titleStopped = 2;
    }
  }
  if ( titleMode == 2 ) {
    titleGhostY += canvas.height * 0.0026;
    if ( titleGhostY >= canvas.height * 1.65 ) {
      setTimeout(function() {
        var wins = localStorage.getItem("wins") || "";
        if ( wins.indexOf(["u","e","r","c"][groups[titleWinner]]) <= -1 ) localStorage.setItem("wins",wins + ["u","e","r","c"][groups[titleWinner]]);
        if ( titleEndGameActive <= -1 ) location.reload();
      },1500);
      gamemode = "stop";
    }
  }
}

function renderStop() {
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  if ( titleEndGameActive > -1 ) {
    titleEndGameWait++;
    if ( titleEndGameWait >= 100 ) {
      var message = ["My name is sage","I am beige","And also a havanage"];
      ctx.font = canvas.width * 0.06 + "px Menlo";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      for ( var i = 0; i < message.length; i++ ) {
        ctx.fillText(message[i],canvas.width * 0.5,canvas.height * (0.25 + 0.06 * i));
      }
    }
  }
}

function handleKeyboardTitle(key) {
  var hasWon = ["u","e","r","c"].filter(item => localStorage.getItem("wins").indexOf(item) > -1).length >= 4;
  if ( key == "ArrowLeft" && Math.round(titleCountryX) > 0 && titleAskNumber == 0 && titleMode == 0 ) titleMoving = -1;
  if ( key == "ArrowRight" && Math.round(titleCountryX) < names.length - (hasWon ? 1 : 2) && titleAskNumber == 0 && titleMode == 0 ) titleMoving = 1;
  if ( key == " " && titleMode == 0 ) {
    if ( titleAskNumber == 0 ) {
      titleAskNumber = 1;
    } else if ( titleAskNumber == 1 ) {
      if ( Math.round(titleCountryX) != names.length - 1 ) {
        mapIndex = groups[Math.round(titleCountryX)];
        mapPosition = [
          [1,1],
          [2,2],
          [3,3],
          [4,4]
        ][groups[Math.round(titleCountryX)]];
        mapObjects = [{
          country: Math.abs(Math.round(titleCountryX)),
          x: -1,
          y: -1,
          direction: 0,
          colored: true,
          exists: true,
          battleData: initialBattleData[Math.abs(Math.round(titleCountryX))]
        }].concat(mapMetadata[mapIndex][0].trainers);
        setTimeout(function() {
          gamemode = "map";
        },1250);
      } else {
        titleGhostY = -150;
        titleEndGameActive = 0;
        setTimeout(function() {
          titleMode = 2;
        },1250);
      }
      titleAskNumber = 2;
      blurActive = 1;
    }
  }
}
