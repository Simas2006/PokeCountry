var battlePlayers = [];
var battleSwapTime;
var battleSwapDirection;
var battleSwapPlayer;
var battleCharDrawn = 0;
var battleTextToDraw;
var battleDialogueItem = 0;
var battleFlashingToggle = 0;

function renderBattle() {
  // rendering code
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  var size = canvas.width * 0.3;
  ctx.beginPath();
  ctx.arc(canvas.width * (0.25 - (battleSwapPlayer != 1 ? battleSwapTime : 0)),canvas.height * 0.75,size,0,2 * Math.PI);
  ctx.stroke();
  ctx.save();
  ctx.clip();
  var flag = flags[battlePlayers[0].visibleCountry];
  for ( var j = 0; j < flag.length; j++ ) {
    var pixelPosition = [
      (Math.floor(j / 3) - 1.5) * (size / 1.5),
      (j % 3 - 1.5) * (size / 1.5)
    ];
    ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flag[j]];
    ctx.fillRect(canvas.width * (0.25 - (battleSwapPlayer != 1 ? battleSwapTime : 0)) + pixelPosition[0],canvas.height * 0.75 + pixelPosition[1],size / 1.5,size / 1.5);
  }
  ctx.restore();
  ctx.beginPath();
  ctx.arc(canvas.width * (0.75 + (battleSwapPlayer != 0 ? battleSwapTime : 0)),canvas.height * 0.25,size,0,2 * Math.PI);
  ctx.stroke();
  ctx.save();
  ctx.clip();
  var flag = flags[battlePlayers[1].visibleCountry];
  for ( var j = 0; j < flag.length; j++ ) {
    var pixelPosition = [
      (Math.floor(j / 3) - 1.5) * (size / 1.5),
      (j % 3 - 1.5) * (size / 1.5)
    ];
    ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flag[j]];
    ctx.fillRect(canvas.width * (0.75 + (battleSwapPlayer != 0 ? battleSwapTime : 0)) + pixelPosition[0],canvas.height * 0.25 + pixelPosition[1],size / 1.5,size / 1.5);
  }
  ctx.restore();
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  var radius = 10;
  var x = 1;
  var y = canvas.height * 0.75;
  var width = canvas.width - 2;
  var height = canvas.height - (y + 1);
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
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.font = canvas.height * 0.08 + "px Menlo";
  if ( battleDialogueItem == 0 ) battleTextToDraw = `${names[battlePlayers[1].country].toUpperCase()} wants to battle!`;
  if ( battleDialogueItem == 1 ) battleTextToDraw = `${names[battlePlayers[1].country].toUpperCase()} sent out ${names[battlePlayers[1].party[battlePlayers[1].active].country].toUpperCase()}!`;
  if ( battleDialogueItem == 2 ) battleTextToDraw = `Go ${names[battlePlayers[0].party[battlePlayers[0].active].country].toUpperCase()}!`;

  var sliceOn = battleTextToDraw.length;
  var splitWords = battleTextToDraw.split(" ");
  for ( var i = 0; i < splitWords.length + 1; i++ ) {
    if ( splitWords.slice(0,i).join(" ").length >= 20 ) {
      sliceOn = splitWords.slice(0,i - 1).join(" ").length;
      break;
    }
  }
  ctx.fillText(battleTextToDraw.slice(0,Math.min(Math.floor(battleCharDrawn),sliceOn)),canvas.width * 0.01,canvas.height * 0.85);
  ctx.fillText(battleTextToDraw.slice(sliceOn + 1,Math.floor(battleCharDrawn)),canvas.width * 0.01,canvas.height * 0.97);
  if ( battleCharDrawn <= battleTextToDraw.length ) {
    battleCharDrawn += 0.1;
  } else if ( battleFlashingToggle >= 1 ) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.9,canvas.height * 0.9);
    ctx.lineTo(canvas.width * 0.98,canvas.height * 0.9);
    ctx.lineTo(canvas.width * 0.94,canvas.height * 0.98);
    ctx.closePath();
    ctx.fill();
  }
  // internal game code
  battleFlashingToggle += 0.025;
  if ( battleFlashingToggle >= 2 ) battleFlashingToggle = 0;
  if ( battleSwapTime > 0 ) {
    if ( battleSwapTime >= 1 ) battleSwapDirection = 1;
    battleSwapTime += [0.01,-0.01][battleSwapDirection];
  } else {
    battleSwapDirection = 0;
  }
}

function battleDialogueIncrement() {
  battleDialogueItem++;
  battleCharDrawn = 0;
  if ( battleDialogueItem == 1 ) {
    battleSwapPlayer = 1;
    battleSwapTime = 0.01;
    battlePlayers[1].active++;
    battlePlayers[1].hp = 100;
    battlePlayers[1].pp = [100,100,100,100];
    setTimeout(function() {
      battlePlayers[1].visibleCountry = battlePlayers[1].party[battlePlayers[1].active].country;
    },1000);
  } else if ( battleDialogueItem == 2 ) {
    battleSwapPlayer = 0;
    battleSwapTime = 0.01;
    battlePlayers[0].active++;
    battlePlayers[0].hp = 100;
    battlePlayers[0].pp = [100,100,100,100];
    setTimeout(function() {
      battlePlayers[0].visibleCountry = battlePlayers[0].party[battlePlayers[0].active].country;
    },1000);
  }
}

function handleKeyboardBattle(key) {
  if ( key == "ArrowDown" ) {
    if ( battleDialogueItem != 2 ) {
      battleDialogueIncrement();
    }
  }
}
