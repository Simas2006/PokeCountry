var bossPlayer = {
  country: 0,
  visibleCountry: 0,
  faintedCountries: 0,
  active: 0,
  hp: [50],
  pp: [50,50,50,50],
  hexaballs: [0,0,0],
  party: [
    {
      country: 1,
      group: 1,
      moves: [
        [0,1],
        [1,2],
        [2,3],
        [3,4]
      ],
      hp: [50],
      pp: [50,50,50,50]
    },
    {
      country: 2,
      group: 1,
      moves: [
        [0,1],
        [1,2],
        [2,3],
        [3,4]
      ],
      hp: [50],
      pp: [50,50,50,50]
    },
    {
      country: 3,
      group: 1,
      moves: [
        [0,1],
        [1,2],
        [2,3],
        [3,4]
      ],
      hp: [50],
      pp: [50,50,50,50]
    }
  ]
}
var bossPlayerX = 0;
var bossPlayerY = 100;
var bossPlayerXVel = 0;
var bossPlayerYVel = 0;
var bossPlayerLives = 3;
var bossPlayerTimers = [100,100,100,100];
var bossPlayerSpeed = [0.75,0.375,0.1875,0.09375];
var bossAttackCountry = 0;
var bossAttackStage = 0;
var bossAttackLives = 100;
var bossAttackX = 0;
var bossAttackY = 0;
var bossAttackDirection = 1;
var bossAttackCanMove = false;
var bossBoltTimer = -1;
var bossSelectedMove = -1;
var bossShowBolt = false;
var bossShowMoves = true;
var bossMovesInitialized = false;
var bossKeypresses = {
  left: false,
  right: false,
  space: false
}

function renderBossFight() {
  // rendering code
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeRect(0,0,canvas.width,canvas.height);
  if ( bossShowBolt ) {
    ctx.strokeStyle = "yellow";
    drawLightningBolt(bossPlayerX,canvas.height * 0.9,bossAttackX,bossAttackY);
    ctx.stroke();
    if ( bossBoltTimer >= 450 ) {
      bossBoltTimer = -1;
      bossShowBolt = false;
      bossMovesInitialized = false;
      bossPlayerTimers = [100,100,100,100];
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
  ctx.fillStyle = ["white","red","yellow","green"][bossPlayerLives];
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
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(bossAttackX,bossAttackY,canvas.width * 0.2,0,2 * Math.PI);
  ctx.stroke();
  ctx.save();
  ctx.clip();
  var flag = flags[bossAttackCountry];
  for ( var j = 0; j < flag.length; j++ ) {
    var pixelPosition = [
      (Math.floor(j / 3) - 1.5) * (canvas.width * 0.2 / 1.5),
      (j % 3 - 1.5) * (canvas.width * 0.2 / 1.5)
    ];
    ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flag[j]];
    ctx.fillRect(bossAttackX + pixelPosition[0],bossAttackY + pixelPosition[1],canvas.width * 0.2 / 1.5,canvas.width * 0.2 / 1.5);
  }
  ctx.restore();
  ctx.beginPath();
  ctx.arc(bossPlayerX,bossPlayerY,canvas.width * 0.1,0,2 * Math.PI);
  ctx.stroke();
  ctx.save();
  ctx.clip();
  var flag = flags[bossPlayer.party[bossPlayer.active].country];
  for ( var j = 0; j < flag.length; j++ ) {
    var pixelPosition = [
      (Math.floor(j / 3) - 1.5) * (canvas.width * 0.1 / 1.5),
      (j % 3 - 1.5) * (canvas.width * 0.1 / 1.5)
    ];
    ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flag[j]];
    ctx.fillRect(bossPlayerX + pixelPosition[0],bossPlayerY + pixelPosition[1],canvas.width * 0.1 / 1.5,canvas.width * 0.1 / 1.5);
  }
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
    if ( bossPlayerTimers.filter(item => item > 0).length <= 0 ) bossShowMoves = false;
  }
  // internal game code
  bossPlayerX += bossPlayerXVel;
  bossPlayerXVel += Math.sign(-bossPlayerXVel) * 0.05;
  if ( (bossPlayerXVel > -0.05 && bossPlayerXVel < 0.05) || (bossPlayerX < 0 || bossPlayerX > canvas.width) ) bossPlayerXVel = 0;
  bossPlayerY -= bossPlayerYVel;
  if ( bossPlayerYVel > 0 || bossPlayerY < canvas.height * 0.9 ) bossPlayerYVel -= canvas.height * 0.00006;
  if ( bossPlayerY >= canvas.height * 0.9 ) bossPlayerYVel = 0;
  if ( bossKeypresses.left && bossPlayerX >= 0 ) bossPlayerXVel = -(canvas.height * 0.005);
  if ( bossKeypresses.right && bossPlayerX <= canvas.width ) bossPlayerXVel = canvas.height * 0.005;
  if ( bossKeypresses.space && bossPlayerY >= canvas.height * 0.9 ) bossPlayerYVel = canvas.height * 0.005;
  if ( bossAttackLives > 66 ) {
    var w = canvas.width;
    bossAttackY = (w / 2) - Math.pow(bossAttackX - (w / 2),2) / (w / 3) + (w / 6);
    bossAttackX += 3 * bossAttackDirection;
    if ( bossAttackX >= 1125 ) bossAttackDirection = -1;
    if ( bossAttackX <= -125 ) bossAttackDirection = 1;
  }
}

function drawLightningBolt(x1,y1,x2,y2) {
  bossBoltTimer++;
  if ( bossBoltTimer < 50 ) return;
  else ctx.lineWidth = bossBoltTimer % 75 >= 38 ? 10 : 25;
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

function handleKeyboardBoss(key,down) {
  if ( ["1","2","3","4"].indexOf(key) > -1 ) {
    if ( bossPlayerTimers[["1","2","3","4"].indexOf(key)] <= 0 ) return;
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
