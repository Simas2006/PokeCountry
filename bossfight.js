var bossPlayer;
var bossFightFinished = false;
var bossPlayerX = 0;
var bossPlayerY = 100;
var bossPlayerXVel = 0;
var bossPlayerYVel = 0;
var bossPlayerLives = 3;
var bossPlayerInviniciblity = 0;
var bossPlayerTimers = [100,100,100,100];
var bossPlayerSpeed = [0.75,0.375,0.1875,0.09375];
var bossAttackCountry;
var bossAttackLives = 100;
var bossAttackX = 0;
var bossAttackY = 0;
var bossAttackYVel = 0;
var bossAttackDirection = 1;
var bossAttackSeparationX = 0;
var bossAttackSeparationY = 0;
var bossAttackCanMove = true;
var bossAttackRotation = 0;
var bossAttackCount = -2;
var bossSteelX = 500;
var bossSteelY = 320;
var bossSteelTrigger = 0;
var bossSteelDirection = 0;
var bossBoltTimer = -1;
var bossSelectedMove = -1;
var bossShowBolt = false;
var bossShowMoves = false;
var bossMovesInitialized = false;
var bossKeypresses = {
  left: false,
  right: false,
  space: false
}

function renderBossFight() {
  // rendering code
  if ( bossFightFinished ) return;
  ctx.lineWidth = 1;
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  if ( bossShowBolt ) {
    bossBoltTimer++;
    ctx.lineWidth = bossBoltTimer % 75 >= 38 ? 10 : 25;
    ctx.strokeStyle = "yellow";
    if ( bossBoltTimer >= 50 ) drawLightningBolt(bossPlayerX,bossPlayerY,bossAttackX,bossAttackY);
    ctx.stroke();
    if ( bossBoltTimer >= 450 ) {
      bossBoltTimer = -1;
      bossShowBolt = false;
      bossMovesInitialized = false;
      bossAttackRotation = 1;
      var move = bossPlayer.party[0].moves[bossSelectedMove];
      var damage = move[1] / moves[move[0]].power[groups[bossAttackCountry]] * 5;
      setTimeout(function() {
        bossAttackLives -= damage;
        bossAttackCanMove = true;
      },1000);
    }
  }
  ctx.lineWidth = 5;
  ctx.strokeStyle = "black";
  drawRoundedRect(10,canvas.width * 0.025,canvas.height * 0.895,canvas.width * 0.45,canvas.height * 0.08);
  ctx.stroke();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "white";
  ctx.fillRect(canvas.width * 0.025,canvas.height * 0.895,canvas.width * 0.45,canvas.height * 0.08);
  ctx.fillStyle = ["white","red","yellow","green"][bossPlayerLives + (bossPlayerInviniciblity % 10 == 0 && bossPlayerInviniciblity != 0 ? 1 : 0)];
  ctx.fillRect(canvas.width * 0.025,canvas.height * 0.895,canvas.width * 0.15 * bossPlayerLives,canvas.height * 0.08);
  ctx.restore();
  drawRoundedRect(10,canvas.width * 0.025,canvas.height * 0.025,canvas.width * 0.95,canvas.height * 0.08);
  ctx.stroke();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "white";
  ctx.fillRect(canvas.width * 0.025,canvas.height * 0.025,canvas.width * 0.95,canvas.height * 0.08);
  ctx.fillStyle = ["white","red","yellow","green","green"][Math.floor((bossAttackLives) / 33) + 1];
  ctx.fillRect(canvas.width * 0.025,canvas.height * 0.025,canvas.width * 0.0095 * bossAttackLives,canvas.height * 0.08);
  ctx.restore();
  ctx.lineWidth = canvas.width * 0.03;
  ctx.strokeStyle = "gray";
  ctx.fillStyle = "lightgray";
  if ( bossSteelTrigger >= 2 && bossAttackLives < 66 && bossAttackLives > 32 ) {
    ctx.beginPath();
    ctx.arc(bossSteelX,bossSteelY,canvas.width * 0.088,0,2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(bossAttackX,bossAttackY - bossAttackSeparationY,canvas.width * 0.2,Math.PI,2 * Math.PI);
  ctx.stroke();
  ctx.save();
  ctx.clip();
  drawFlag(flags[bossAttackCountry],bossAttackX,bossAttackY - bossAttackSeparationY,canvas.width * 0.2,Math.floor(bossAttackRotation / 25));
  ctx.restore();
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.arc(bossAttackX - canvas.width * 0.075,bossAttackY - bossAttackSeparationY - canvas.width * 0.075,canvas.width * 0.05,0,2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(bossAttackX + canvas.width * 0.075,bossAttackY - bossAttackSeparationY - canvas.width * 0.075,canvas.width * 0.05,0,2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(bossAttackX - bossAttackSeparationX,bossAttackY + bossAttackSeparationY,canvas.width * 0.2,0,Math.PI);
  ctx.stroke();
  ctx.save();
  ctx.clip();
  drawFlag(flags[bossAttackCountry],bossAttackX - bossAttackSeparationX,bossAttackY + bossAttackSeparationY,canvas.width * 0.2,Math.floor(bossAttackRotation / 25));
  ctx.restore();
  ctx.beginPath();
  ctx.arc(bossPlayerX,bossPlayerY,canvas.width * 0.1,0,2 * Math.PI);
  ctx.stroke();
  ctx.save();
  ctx.clip();
  if ( bossPlayerInviniciblity % 10 > 0 || bossPlayerInviniciblity == 0 ) drawFlag(flags[bossPlayer.party[0].country],bossPlayerX,bossPlayerY,canvas.width * 0.1,0);
  ctx.restore();
  if ( bossShowMoves ) {
    var availableMoves = bossPlayer.party[0].moves;
    if ( ! bossMovesInitialized ) {
      for ( var i = availableMoves.length - 1; i > 0; i-- ) {
        var swap = Math.floor(Math.random() * (i + 1));
        var temp = availableMoves[i];
        availableMoves[i] = availableMoves[swap];
        availableMoves[swap] = temp;
      }
      bossMovesInitialized = true;
    }
    for ( var i = 0; i < availableMoves.length; i++ ) {
      bossPlayerSpeed[i] = (availableMoves[i][1] / moves[availableMoves[i][0]].power[groups[bossAttackCountry]]) / 2;
    }
    ctx.strokeStyle = "black";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = canvas.width * 0.06 + "px Menlo";
    for ( var i = 0; i < 4; i++ ) {
      ctx.fillStyle = "white";
      ctx.fillRect(i <= 1 ? 0 : canvas.width * 0.6,canvas.height * (0.2 + (i % 2 == 0 ? 0 : 0.175)),canvas.width * 0.4,canvas.height * 0.15);
      ctx.strokeRect(i <= 1 ? 0 : canvas.width * 0.6,canvas.height * (0.2 + (i % 2 == 0 ? 0 : 0.175)),canvas.width * 0.4,canvas.height * 0.15);
      ctx.fillStyle = "black";
      ctx.fillText(`[${i + 1}] ${moves[bossPlayer.party[0].moves[i][0]].name}`,i <= 1 ? 0 : canvas.width * 0.6,canvas.height * (0.275 + (i % 2 == 0 ? 0 : 0.175)));
      ctx.strokeRect(i <= 1 ? 0 : canvas.width * 0.6,canvas.height * (0.35 + (i % 2 == 0 ? 0 : 0.175)),canvas.width * 0.4,canvas.height * 0.025);
      ctx.fillStyle = "white";
      ctx.fillRect(i <= 1 ? 0 : canvas.width * 0.6,canvas.height * (0.35 + (i % 2 == 0 ? 0 : 0.175)),canvas.width * 0.4,canvas.height * 0.025);
      ctx.fillStyle = ["white","red","yellow","green"][Math.ceil(Math.min(bossPlayerTimers[i],99) / 33)];
      ctx.fillRect(i <= 1 ? 0 : canvas.width * 0.6,canvas.height * (0.35 + (i % 2 == 0 ? 0 : 0.175)),canvas.width * 0.4 * (bossPlayerTimers[i] / 100),canvas.height * 0.025);
      bossPlayerTimers[i] = Math.max(bossPlayerTimers[i] - bossPlayerSpeed[i],0);
    }
    if ( bossPlayerTimers.filter(item => item > 0).length <= 0 ) {
      bossShowMoves = false;
      bossPlayerTimers = [100,100,100,100];
      bossAttackCanMove = true;
    }
  }
  // internal game code
  if ( bossAttackRotation > 0 ) bossAttackRotation++;
  if ( bossAttackRotation >= 125 ) bossAttackRotation = 0;
  bossPlayerX += bossPlayerXVel;
  bossPlayerXVel += Math.sign(-bossPlayerXVel) * 0.05;
  if ( (bossPlayerXVel > -0.05 && bossPlayerXVel < 0.05) || (bossPlayerX < 0 || bossPlayerX > canvas.width) ) bossPlayerXVel = 0;
  bossPlayerY -= bossPlayerYVel;
  if ( bossPlayerYVel > 0 || bossPlayerY < canvas.height * 0.9 ) bossPlayerYVel -= canvas.height * 0.00006;
  if ( bossPlayerY >= canvas.height * 0.9 ) bossPlayerYVel = 0;
  if ( bossKeypresses.left && bossPlayerX >= 0 ) bossPlayerXVel = -(canvas.height * 0.005);
  if ( bossKeypresses.right && bossPlayerX <= canvas.width ) bossPlayerXVel = canvas.height * 0.005;
  if ( bossKeypresses.space && bossPlayerY >= canvas.height * 0.9 ) bossPlayerYVel = canvas.height * 0.006;
  if ( bossAttackLives > 65 && bossAttackCanMove ) {
    var w = canvas.width;
    bossAttackY = (w / 2) - Math.pow(bossAttackX - (w / 2),2) / (w / 3) + (w / 6);
    bossAttackX += 3 * bossAttackDirection;
    if ( bossAttackX >= (canvas.width * 1.125) ) bossAttackDirection = -1;
    if ( bossAttackX <= -(canvas.width * 0.125) ) bossAttackDirection = 1;
    if ( bossAttackY > canvas.height * 0.25 && bossAttackY < canvas.height * 0.26 ) {
      bossAttackCount++;
      bossAttackCount %= 3;
      if ( bossAttackCount == 2 ) {
        bossShowMoves = true;
        bossAttackCanMove = false;
      }
    }
  } else if ( bossAttackLives > 32 ) {
    if ( bossSteelTrigger > 0 ) {
      if ( bossAttackSeparationX < canvas.width * 0.4 && bossSteelY < canvas.height * 0.8925 ) {
        bossSteelX = bossAttackX;
        bossSteelY = bossAttackY;
        bossAttackSeparationX += 3;
        bossSteelTrigger = 2;
      } else if ( bossSteelY < canvas.height * 0.8925 ) {
        bossSteelY += 5;
        bossSteelDirection = Math.sign(bossPlayerX - bossSteelX);
      } else {
        if ( bossAttackSeparationX > 0 ) bossAttackSeparationX -= 3;
        bossSteelX += 3 * bossSteelDirection;
        if ( bossSteelX < -100 || bossSteelX > canvas.width + 100 ) {
          bossSteelY = 0;
          bossSteelTrigger = 0;
          bossAttackCanMove = true;
        }
      }
    } else if ( bossAttackCanMove ) {
      if ( bossAttackX > bossPlayerX + canvas.width * 0.2 && bossAttackDirection == 1 ) bossAttackDirection = -1;
      else if ( bossAttackX < bossPlayerX - canvas.width * 0.2 && bossAttackDirection == -1 ) bossAttackDirection = 1;
      bossAttackX += canvas.width * 0 * bossAttackDirection;
      if ( Math.abs(bossAttackX - bossPlayerX) <= canvas.width * 0.005 ) {
        if ( bossAttackCount == 1 ) {
          bossSteelTrigger = 1;
          bossAttackCanMove = false;
        } else if ( bossAttackCount == 3 ) {
          bossShowMoves = true;
          bossAttackCanMove = false;
        }
        bossAttackCount++;
        bossAttackCount %= 4;
      }
    }
  } else if ( bossAttackCanMove ) {
    if ( bossAttackX > bossPlayerX + canvas.width * 0.2 && bossAttackY >= canvas.height * 0.8 && bossAttackDirection == 1 ) bossAttackDirection = -1;
    else if ( bossAttackX < bossPlayerX - canvas.width * 0.2 && bossAttackY >= canvas.height * 0.8 && bossAttackDirection == -1 ) bossAttackDirection = 1;
    bossAttackX += canvas.width * 0.00375 * bossAttackDirection;
    if ( bossAttackX > bossPlayerX + canvas.width * 0.2 && bossAttackYVel == 0 && bossAttackDirection == 1 ) bossAttackDirection = -1;
    else if ( bossAttackX < bossPlayerX - canvas.width * 0.2 && bossAttackYVel == 0 && bossAttackDirection == -1 ) bossAttackDirection = 1;
    bossAttackY -= canvas.width * 0.0075 * bossAttackYVel;
    if ( bossAttackYVel > 0 || bossAttackY < canvas.height * 0.9 ) bossAttackYVel -= canvas.height * 0.00006;
    if ( bossAttackY >= canvas.height * 0.8 ) bossAttackYVel = canvas.height * 0.005;
    if ( bossAttackYVel > 0 && bossAttackYVel < 0.05 ) {
      if ( bossAttackCount == 1 ) {
        bossShowMoves = true;
        bossAttackCanMove = false;
      }
      bossAttackCount++;
      bossAttackCount %= 3;
    }
  }
  if ( bossAttackLives <= 0 && bossAttackSeparationY <= 0 ) {
    bossAttackSeparationY = 1;
    bossAttackCanMove = false;
  }
  if ( bossAttackSeparationY > 0 ) {
    bossAttackSeparationY += canvas.height * 0.01;
    ctx.lineWidth = 20;
    ctx.strokeStyle = "yellow";
    drawLightningBolt(0,bossAttackY,canvas.width,bossAttackY);
    ctx.stroke();
  }
  if ( bossAttackSeparationY > canvas.height && ! bossFightFinished ) activateExit(true);
  if ( bossPlayerLives <= 0 ) activateExit(false);
  if ( (Math.sqrt(Math.pow(bossAttackX - bossPlayerX,2) + Math.pow(bossAttackY - bossPlayerY,2)) <= canvas.width * 0.3 || Math.sqrt(Math.pow(bossSteelX - bossPlayerX,2) + Math.pow(bossSteelY - bossPlayerY,2)) <= canvas.width * 0.103) && bossPlayerInviniciblity <= 0 ) {
    bossPlayerLives--;
    bossPlayerInviniciblity = 100;
  } else if ( bossPlayerInviniciblity > 0 ) {
    bossPlayerInviniciblity--;
  }
}

function drawLightningBolt(x1,y1,x2,y2) {
  ctx.beginPath();
  var distance = (Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2))) / 10;
  var angle = Math.atan2(y2 - y1,x2 - x1) * 180 / Math.PI;
  ctx.moveTo(x1,y1);
  angle += 45;
  for ( var i = 0; i < 10; i++ ) {
    angle += 90 * (i % 2 == 1 ? 1 : -1);
    x1 += distance * 1.5 * Math.cos(Math.PI * angle / 180);
    y1 += distance * 1.5 * Math.sin(Math.PI * angle / 180);
    ctx.lineTo(x1,y1);
  }
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

function activateExit(successful) {
  bossFightFinished = true;
  blurActive = 1;
  setTimeout(function() {
    if ( successful ) {
      gamemode = "title";
      titleMode = 1;
      titleWinner = mapObjects[0].country;
      titleCountryX = -8.5;
    } else {
      gamemode = "map";
      mapIndex = groups[mapObjects[0].country];
      mapMetadataID = 0;
      mapPosition = [[2,2]][groups[mapObjects[0].country]];
      mapObjects = [mapObjects[0]].concat(mapMetadata[mapIndex][0].trainers);
      mapObjects[0].colored = true;
    }
  },1250);
}

function handleKeyboardBoss(key,down) {
  if ( ["1","2","3","4"].indexOf(key) > -1 && bossShowMoves ) {
    if ( bossPlayerTimers[["1","2","3","4"].indexOf(key)] <= 0 ) return;
    bossPlayerTimers = [100,100,100,100];
    bossSelectedMove = ["1","2","3","4"].indexOf(key);
    bossBoltTimer = 0;
    bossShowBolt = true;
    bossShowMoves = false;
  }
  if ( ["ArrowLeft","ArrowRight"," "].indexOf(key) > -1 ) {
    var index = ["left","right","space"][["ArrowLeft","ArrowRight"," "].indexOf(key)];
    bossKeypresses[index] = down;
  }
}
