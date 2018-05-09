var battlePlayers = [];
var battleWinner = -1;
var battleSwapTime;
var battleSwapDirection;
var battleSwapPlayer;
var battleCharDrawn = 0;
var battleTextToDraw;
var battleDialogueItem = 0;
var battleFlashingToggle = 0;
var battleSelectedButton = 0;
var battleSelectedOption = -1;
var battleBoxItems;
var battleBoxSelected = 0;
var battleSelectedMove;
var battleMovementTimer = 0;
var battleMovementPlayer = 0;
var battleDamageComplete = false;
var battleAICalculated = false;
var battleOutOfPP = false;
var battleOutOfPokeball = false;
var battleOutOfSlots = false;
var battleOutOfCountries = false;
var battleFaintPlayer = 0;
var battleFaintComplete = false;
var battleShakingTimer = -25;
var battleShakingResult;
var battleShakingType = 2;
var battleCaptureComplete = false;
var battleChangePlayer = -1;

/*
 * battleDialogueItem states:
 * 0 - Intitalization
 * 1 - ENEMY sent out COUNTRY
 * 2 - Go COUNTRY!
 * 3 - Choice buttons + move selection
 * 4 - Movement in fight
 * 5 - COUNTRY used MOVE (no effects)
 * 6 - Effectiveness levels (effects executed)
 * 7 - Intermediary state (jumps to 3 or 8)
 * 8 - COUNTRY fainted (no effects)
 * 9 - PERSON sent out COUNTRY/PERSON won the battle!
 * 10 - Intermediary state (jumps to 3 or EXIT)
 * 11 - Shaking in Pokeball
 * 12 - Is or isn't caught
 * 13 - Intermediary state (jumps to 3 or 9)
 */

function renderBattle() {
  // rendering code
  ctx.lineWidth = 1;
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  var size = canvas.width * 0.3;
  var index = Math.floor(battleMovementTimer / 25);
  var xm = [ 0, 0, 1, 1, 1, 0,-1,-1,-1, 0,0][index] * 100;
  var ym = [ 0,-1,-1, 0, 1, 1, 1, 0,-1,-1,0][index] * 100;
  ctx.beginPath();
  ctx.arc(canvas.width * (0.25 - (battleSwapPlayer != 1 ? battleSwapTime : 0)) + (battleMovementPlayer == 0 ? xm : 0),canvas.height * 0.75 + (battleMovementPlayer == 0 ? ym : 0),size,0,2 * Math.PI);
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
    ctx.fillRect(canvas.width * (0.25 - (battleSwapPlayer != 1 ? battleSwapTime : 0)) + (battleMovementPlayer == 0 ? xm : 0) + pixelPosition[0],canvas.height * 0.75 + (battleMovementPlayer == 0 ? ym : 0) + pixelPosition[1],size / 1.5,size / 1.5);
  }
  ctx.restore();
  if ( ! battleShakingResult ) {
    ctx.beginPath();
    ctx.arc(canvas.width * (0.75 + (battleSwapPlayer != 0 ? battleSwapTime : 0)) + (battleMovementPlayer == 1 ? xm : 0),canvas.height * 0.25 + (battleMovementPlayer == 1 ? ym : 0),size,0,2 * Math.PI);
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
      ctx.fillRect(canvas.width * (0.75 + (battleSwapPlayer != 0 ? battleSwapTime : 0)) + (battleMovementPlayer == 1 ? xm : 0) + pixelPosition[0] - 1,canvas.height * 0.25 + (battleMovementPlayer == 1 ? ym : 0) + pixelPosition[1] - 1,size / 1.5 + 2,size / 1.5 + 2);
    }
    ctx.restore();
  }
  if ( battleWinner <= -1 ) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    drawRoundedRect(10,canvas.width * 0.625,canvas.height * 0.675,canvas.width * 0.325,canvas.height * 0.05);
    ctx.stroke();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width * 0.625,canvas.height * 0.675,canvas.width * 0.325,canvas.height * 0.05);
    if ( battlePlayers[0].hp[0] >= 33 || battleFlashingToggle < 1.5 ) {
      ctx.fillStyle = ["red","rgb(254,209,11)","green","green"][Math.floor(battlePlayers[0].hp[0] / 33)];
      ctx.fillRect(canvas.width * 0.625,canvas.height * 0.675,canvas.width * 0.325 * (battlePlayers[0].hp[0] / 100),canvas.height * 0.05);
    }
    ctx.restore();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.625,canvas.height * 0.66);
    ctx.lineTo(canvas.width * 0.95,canvas.height * 0.66);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.font = canvas.height * 0.06 + "px Menlo";
    var name;
    if ( battlePlayers[0].active > -1 ) name = names[battlePlayers[0].party[battlePlayers[0].active].country];
    else name = names[battlePlayers[0].country];
    ctx.fillText(name,canvas.width * 0.625,canvas.height * 0.652);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    drawRoundedRect(10,canvas.width * 0.05,canvas.height * 0.2,canvas.width * 0.325,canvas.height * 0.05);
    ctx.stroke();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width * 0.05,canvas.height * 0.2,canvas.width * 0.325,canvas.height * 0.05);
    if ( battlePlayers[1].hp[0] >= 33 || battleFlashingToggle < 1.5 ) {
      ctx.fillStyle = ["red","rgb(254,209,11)","green","green"][Math.floor(battlePlayers[1].hp[0] / 33)];
      ctx.fillRect(canvas.width * 0.05,canvas.height * 0.2,canvas.width * 0.325 * (battlePlayers[1].hp[0] / 100),canvas.height * 0.05);
    }
    ctx.restore();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.05,canvas.height * 0.185);
    ctx.lineTo(canvas.width * 0.375,canvas.height * 0.185);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = canvas.height * 0.06 + "px Menlo";
    var name;
    if ( battlePlayers[1].active > -1 ) name = names[battlePlayers[1].party[battlePlayers[1].active].country];
    else name = names[battlePlayers[1].country];
    ctx.fillText(name,canvas.width * 0.05,canvas.height * 0.177);
  }
  if ( battleDialogueItem != 4 && battleDialogueItem != 11 && battleTextToDraw ) {
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    drawRoundedRect(10,1,canvas.height * 0.75,canvas.width - 2,canvas.height * 0.25 - 1);
    ctx.stroke();
    ctx.fill();
    ctx.font = canvas.height * 0.08 + "px Menlo";
    var sliceOn = battleTextToDraw.length;
    var splitWords = battleTextToDraw.split(" ");
    for ( var i = 0; i < splitWords.length + 1; i++ ) {
      if ( splitWords.slice(0,i).join(" ").length >= 20 ) {
        sliceOn = splitWords.slice(0,i - 1).join(" ").length;
        break;
      }
    }
    if ( battleTextToDraw.indexOf("\n") > -1 ) sliceOn = battleTextToDraw.indexOf("\n");
    ctx.fillStyle = "black";
    ctx.fillText(battleTextToDraw.slice(0,Math.min(Math.floor(battleCharDrawn),sliceOn)),canvas.width * 0.01,canvas.height * 0.85);
    ctx.fillText(battleTextToDraw.slice(sliceOn + 1,Math.floor(battleCharDrawn)),canvas.width * 0.01,canvas.height * 0.97);
  }
  if ( battleDialogueItem == 11 ) {
    ctx.lineWidth = 10;
    ctx.strokeStyle = "black";
    var angle = 0;
    if ( battleShakingTimer >= 250 && battleShakingTimer < 750 ) {
      if ( battleShakingTimer % 125 < 15 ) angle = 0.125 * Math.PI;
      else if ( battleShakingTimer % 125 < 30 ) angle = -0.125 * Math.PI;
    }
    var radius = 1;
    if ( battleShakingResult ) {
      if ( battleShakingTimer >= 750 && battleShakingTimer <= 900 ) radius = 1 - (battleShakingTimer - 750) / 150;
      else if ( battleShakingTimer >= 900 ) radius = 0;
    } else if ( battleShakingTimer >= 751 ) {
      battleShakingTimer = 150;
    }
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(canvas.width * 0.75,canvas.height * (1 - Math.min(battleShakingTimer,150) / 150 + 0.25),canvas.height * 0.33 * radius,angle,Math.PI + angle);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = ["red","purple","gold"][battleShakingType];
    ctx.beginPath();
    ctx.arc(canvas.width * 0.75,canvas.height * (Math.min(battleShakingTimer,150) / 150 - 0.75),canvas.height * 0.33 * radius,Math.PI + angle,2 * Math.PI + angle);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(canvas.width * 0.75,canvas.height * (1 - Math.min(battleShakingTimer,150) / 150 + 0.25),canvas.height * 0.1 * radius,0,2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    if ( battleShakingTimer < -25 || battleShakingTimer > 900 ) battleDialogueIncrement();
    if ( battleShakingTimer == 750 ) battleShakingResult = Math.random() < 0.333 + (0.2085 * battleShakingType);
    battleShakingTimer += battleShakingResult === false ? -5 : 1;
  }
  ctx.fillStyle = "black";
  if ( battleDialogueItem == 0 ) battleTextToDraw = `${names[battlePlayers[1].country].toUpperCase()} wants to battle!`;
  if ( battleDialogueItem == 1 ) battleTextToDraw = `${names[battlePlayers[1].country].toUpperCase()} sent out ${names[battlePlayers[1].party[battlePlayers[1].active].country].toUpperCase()}!`;
  if ( battleDialogueItem == 2 ) battleTextToDraw = `Go ${names[battlePlayers[0].party[battlePlayers[0].active].country].toUpperCase()}!`;
  if ( battleDialogueItem == 3 ) {
    ctx.lineWidth = 5;
    if ( battleOutOfPP ) battleTextToDraw = `There isn't\nenough PP!`;
    else if ( battleOutOfPokeball ) battleTextToDraw = `You don't\nhave that!`;
    else if ( battleOutOfSlots ) battleTextToDraw = `Your party\nis full!`;
    else if ( battleOutOfCountries ) battleTextToDraw = `Nothing to\nswitch to!`;
    else battleTextToDraw = `What should\n${names[battlePlayers[0].party[battlePlayers[0].active].country].toUpperCase()} do?`;
    drawRoundedRect(10,canvas.width * 0.6,canvas.height * 0.75 + 10,canvas.width * 0.4 - 5,canvas.height * 0.25 - 20);
    ctx.stroke();
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = battleSelectedButton == 0 ? "gold" : "red";
    ctx.fillStyle = battleSelectedButton == 0 ? "#fff1b3" : "#ff9999";
    ctx.fillRect(canvas.width * 0.6,canvas.height * 0.75 + 10,canvas.width * 0.2 - 2,canvas.height * 0.125 - 12);
    ctx.strokeRect(canvas.width * 0.6,canvas.height * 0.75 + 10,canvas.width * 0.2 - 2,canvas.height * 0.125 - 12);
    ctx.strokeStyle = battleSelectedButton == 1 ? "gold" : "orange";
    ctx.fillStyle = battleSelectedButton == 1 ? "#fff1b3" : "#fedba9";
    ctx.fillRect(canvas.width * 0.8 + 2,canvas.height * 0.75 + 10,canvas.width * 0.2 - 7,canvas.height * 0.125 - 12);
    ctx.strokeRect(canvas.width * 0.8 + 2,canvas.height * 0.75 + 10,canvas.width * 0.2 - 7,canvas.height * 0.125 - 12);
    ctx.strokeStyle = battleSelectedButton == 2 ? "gold" : "green";
    ctx.fillStyle = battleSelectedButton == 2 ? "#fff1b3" : "#99ff99";
    ctx.fillRect(canvas.width * 0.6,canvas.height * 0.878,canvas.width * 0.2 - 2,canvas.height * 0.125 - 12);
    ctx.strokeRect(canvas.width * 0.6,canvas.height * 0.878,canvas.width * 0.2 - 2,canvas.height * 0.125 - 12);
    ctx.strokeStyle = battleSelectedButton == 3 ? "gold" : "blue";
    ctx.fillStyle = battleSelectedButton == 3 ? "#fff1b3" : "#9999ff";
    ctx.fillRect(canvas.width * 0.8 + 2,canvas.height * 0.878,canvas.width * 0.2 - 7,canvas.height * 0.125 - 12);
    ctx.strokeRect(canvas.width * 0.8 + 2,canvas.height * 0.878,canvas.width * 0.2 - 7,canvas.height * 0.125 - 12);
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.font = canvas.height * 0.06 + "px Menlo";
    ctx.fillText("FIGHT",canvas.width * 0.695,canvas.height * 0.8425);
    ctx.fillText("BAG",canvas.width * 0.8975,canvas.height * 0.8425);
    ctx.fillText("RUN",canvas.width * 0.8975,canvas.height * 0.955);
    ctx.font = canvas.height * 0.0425 + "px Menlo";
    ctx.fillText("POKÉMON",canvas.width * 0.6975,canvas.height * 0.9475);
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.6,canvas.height * 0.875);
    ctx.lineTo(canvas.width - 5,canvas.height * 0.875);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.8,canvas.height * 0.75 + 10);
    ctx.lineTo(canvas.width * 0.8,canvas.height - 10);
    ctx.stroke();
    ctx.restore();
    battleShakingResult = null;
    battleFaintComplete = false;
  }
  var activeCountry = battlePlayers[battleMovementPlayer].party[battlePlayers[battleMovementPlayer].active];
  var oppositeCountry = battlePlayers[battleMovementPlayer == 0 ? 1 : 0].party[battlePlayers[battleMovementPlayer == 0 ? 1 : 0].active];
  if ( battleDialogueItem == 5 ) {
    if ( battleMovementPlayer == 1 && ! battleAICalculated ) {
      var sortedMoves = activeCountry.moves.map((item,index) => [
        item[1] / moves[item[0]].power[oppositeCountry.group] * 5,
        index
      ]).filter((item,index) => battlePlayers[1].pp[index] > 0).sort(function(a,b) {
        return b[0] - a[0];
      });
      if ( sortedMoves.length > 0 ) {
        var index;
        var value = Math.random();
        if ( value <= battlePlayers[1].skill ) index = 0;
        else if ( value <= battlePlayers[1].skill + (1 - battlePlayers[1].skill) / 2 ) index = 1;
        else index = 2;
        if ( index >= sortedMoves.length ) index = sortedMoves.length - 1;
        battleSelectedMove = sortedMoves[index][1];
      } else {
        battleSelectedMove = -1;
      }
      battleAICalculated = true;
    }
    var moveName;
    if ( battleSelectedMove <= -1 ) moveName = "STRUGGLE";
    else moveName = moves[activeCountry.moves[battleSelectedMove][0]].name;
    battleTextToDraw = `${names[activeCountry.country].toUpperCase()} used ${moveName}!`;
    battleDamageComplete = false;
    battleOutOfPP = false;

  }
  if ( battleDialogueItem == 6 && ! battleDamageComplete ) {
    var damage;
    if ( battleSelectedMove > -1 ) {
      damage = activeCountry.moves[battleSelectedMove][1] / moves[activeCountry.moves[battleSelectedMove][0]].power[oppositeCountry.group] * 5;
      if ( Math.random() <= moves[activeCountry.moves[battleSelectedMove][0]].missChance ) damage = 0;
    } else {
      damage = Math.floor(Math.random() * 6);
    }
    var oppositeObject = battlePlayers[battleMovementPlayer == 0 ? 1 : 0];
    oppositeObject.hp[0] = Math.round(oppositeObject.hp[0] - damage);
    battleDamageComplete = true;
    if ( battleSelectedMove > -1 ) {
      battlePlayers[battleMovementPlayer].hp[0] *= 1 - moves[activeCountry.moves[battleSelectedMove][0]].selfInflict;
      moves[activeCountry.moves[battleSelectedMove][0]].onUse(battlePlayers[battleMovementPlayer],battlePlayers[battleMovementPlayer].party,activeCountry);
    }
    var text = ["It wasn't very effective...","The attack landed!","It's super effective!"];
    battleTextToDraw = text[Math.floor(damage / 8.333)];
    if ( damage == 0 ) battleTextToDraw = "The attack missed...";
    battlePlayers[battleMovementPlayer].pp[battleSelectedMove] -= 5;
    battleAICalculated = false;
  }
  if ( battleDialogueItem == 8 ) {
    var selectedCountry = battlePlayers[battleFaintPlayer].party[battlePlayers[battleFaintPlayer].active];
    battleTextToDraw = `${names[selectedCountry.country].toUpperCase()} fainted!`;
  }
  if ( battleDialogueItem == 9 && ! battleFaintComplete ) {
    var trigger = false;
    if ( battleChangePlayer > -1 ) {
      battlePlayers[0].party.splice(battlePlayers[0].active,0,battlePlayers[0].party.splice(battleChangePlayer,1)[0]);
      battleChangePlayer = -1;
      trigger = true;
    }
    var selectedObject = battlePlayers[battleFaintPlayer];
    var selectedCountry = selectedObject.party[selectedObject.active + (trigger ? 0 : 1)];
    if ( selectedObject.active + 1 >= selectedObject.party.length && trigger ) battleWinner = battleFaintPlayer == 0 ? 1 : 0;
    if ( battleWinner <= -1 ) battleTextToDraw = `${["You",names[battlePlayers[1].country].toUpperCase()][battleFaintPlayer]} sent out ${names[selectedCountry.country].toUpperCase()}!`;
    else battleTextToDraw = `${["You",names[battlePlayers[1].country].toUpperCase()][battleWinner]} won the battle${["!","..."][battleWinner]}`;
    battleSwapPlayer = battleWinner <= -1 ? battleFaintPlayer : -1;
    battleSwapTime = 0.01;
    setTimeout(function() {
      if ( battleWinner <= -1 ) {
        if ( ! trigger ) selectedObject.active++;
        selectedObject.visibleCountry = selectedCountry.country;
        selectedObject.hp = selectedCountry.hp;
        selectedObject.pp = selectedCountry.pp;
      } else {
        battlePlayers[0].visibleCountry = battlePlayers[0].country;
        battlePlayers[1].visibleCountry = battlePlayers[1].country;
      }
      battleShakingResult = null;
    },1000);
    battleFaintComplete = true;
  }
  if ( battleDialogueItem == 12 && ! battleCaptureComplete ) {
    if ( battleShakingResult ) {
      battleFaintPlayer = 1;
      battlePlayers[0].party.push(battlePlayers[1].party[battlePlayers[1].active]);
      battleTextToDraw = `You captured ${names[battlePlayers[1].party[battlePlayers[1].active].country].toUpperCase()}!`;
    } else {
      battleTextToDraw = `${names[battlePlayers[1].party[battlePlayers[1].active].country].toUpperCase()} got away!`;
    }
    battlePlayers[0].pokeballs[battleShakingType]--;
    battleCaptureComplete = true;
    battleOutOfPokeball = false;
    battleOutOfSlots = false;
  }
  ctx.font = canvas.height * 0.06 + "px Menlo";
  if ( battleSelectedOption > -1 ) {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    drawRoundedRect(10,canvas.width * 0.4,canvas.height * 0.15 - 10,canvas.width * 0.6 - 5,canvas.height * 0.6);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = "black";
    var y = canvas.height * 0.23 - 10;
    var items = battleBoxItems[battleSelectedOption];
    for ( var i = 0; i < items.length; i++ ) {
      ctx.fillText(" " + items[i][0],canvas.width * 0.4 + 10,y);
      if ( battleBoxSelected == i ) {
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.4 + 10,y - canvas.height * 0.05);
        ctx.lineTo(canvas.width * 0.43 + 10,y - canvas.height * 0.025);
        ctx.lineTo(canvas.width * 0.4 + 10,y);
        ctx.closePath();
        ctx.fill();
      }
      y += canvas.height * 0.07;
      if ( items[i][1] ) {
        ctx.fillText(" ".repeat(14 - items[i][1].length) + items[i][1],canvas.width * 0.4 + 10,y);
        y += canvas.height * 0.07;
      }
    }
  }
  if ( battleCharDrawn <= battleTextToDraw.length ) {
    battleCharDrawn += 0.1;
  } else if ( battleFlashingToggle >= 1 && [3,4,11].indexOf(battleDialogueItem) <= -1 ) {
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
  if ( battleDialogueItem == 4 ) battleMovementTimer++;
}

function battleDialogueIncrement() {
  battleDialogueItem++;
  battleCharDrawn = 0;
  if ( battleDialogueItem == 1 ) {
    battleSwapPlayer = 1;
    battleSwapTime = 0.01;
    battlePlayers[1].active++;
    battlePlayers[1].hp = battlePlayers[1].party[battlePlayers[1].active].hp;
    battlePlayers[1].pp = battlePlayers[1].party[battlePlayers[1].active].pp;
    setTimeout(function() {
      battlePlayers[1].visibleCountry = battlePlayers[1].party[battlePlayers[1].active].country;
    },1000);
  } else if ( battleDialogueItem == 2 ) {
    battleSwapPlayer = 0;
    battleSwapTime = 0.01;
    battlePlayers[0].active++;
    battlePlayers[0].hp = battlePlayers[0].party[battlePlayers[0].active].hp;
    battlePlayers[0].pp = battlePlayers[0].party[battlePlayers[0].active].pp;
    setTimeout(function() {
      battlePlayers[0].visibleCountry = battlePlayers[0].party[battlePlayers[0].active].country;
    },1000);
  } else if ( battleDialogueItem == 3 ) {
    battleSelectedButton = 0;
    battleBoxSelected = 0;
    battleBoxItems = [
      battlePlayers[0].party[battlePlayers[0].active].moves.map((item,index) => [moves[item[0]].name,battlePlayers[0].pp[index] + "/100"]),
      battlePlayers[0].pokeballs.map((item,index) => [`${["POKE","MASTER ","ULTRA "][index]}BALL`,`x${item}`]),
      battlePlayers[0].party.slice(battlePlayers[0].active).map((item,index) => [names[item.country].toUpperCase() + (index == 0 ? " ✔" : "")])
    ]
  } else if ( battleDialogueItem == 4 ) {
    battleMovementTimer = 0;
    battleSelectedOption = -1;
    setTimeout(function() {
      battleMovementTimer = 0;
      battleDialogueIncrement();
    },2750);
  } else if ( battleDialogueItem == 7 ) {
    battleMovementPlayer = battleMovementPlayer == 0 ? 1 : 0;
    battleDialogueItem = 2 + battleMovementPlayer;
    if ( battlePlayers[0].hp[0] <= 0 ) {
      battleFaintPlayer = 0;
      battleDialogueItem = 7;
    }
    if ( battlePlayers[1].hp[0] <= 0 ) {
      battleFaintPlayer = 1;
      battleDialogueItem = 7;
    }
    battleDialogueIncrement();
  } else if ( battleDialogueItem == 10 ) {
    if ( battleWinner <= -1 ) {
      battleMovementPlayer = battleMovementPlayer == 0 ? 1 : 0;
      battleDialogueItem = 2 + battleMovementPlayer;
      battleDialogueIncrement();
    } else {
      resetBattle();
      mapTrainerComplete(battleWinner);
    }
  } else if ( battleDialogueItem == 13 ) {
    battleShakingTimer = -25;
    battleCaptureComplete = false;
    battleDialogueItem = battleShakingResult ? 8 : 2;
    battleDialogueIncrement();
  }
}

function handleKeyboardBattle(key) {
  if ( battleDialogueItem == 3 ) {
    if ( battleSelectedOption <= -1 ) {
      if ( key == "ArrowUp" || key == "ArrowDown" ) battleSelectedButton = [2,3,0,1][battleSelectedButton];
      if ( key == "ArrowLeft" || key == "ArrowRight" ) battleSelectedButton = [1,0,3,2][battleSelectedButton];
    } else {
      if ( key == "ArrowUp" ) battleBoxSelected = Math.max(battleBoxSelected - 1,0);
      if ( key == "ArrowDown" ) battleBoxSelected = Math.min(battleBoxSelected + 1,battleBoxItems[battleSelectedOption].length - 1);
    }
  }
  if ( key == "ArrowDown" && battleDialogueItem != 3 ) battleDialogueIncrement();
  if ( key == " " && battleDialogueItem == 3 ) {
    if ( battleSelectedOption <= -1 ) {
      battleOutOfCountries = false;
      if ( battleSelectedButton == 0 && battlePlayers[0].pp.filter(item => item > 0).length <= 0 ) {
        battleSelectedMove = -1;
        battleDialogueIncrement();
      } else if ( battleSelectedButton == 1 ) {
        battleOutOfSlots = false;
        battleOutOfPokeball = false;
        if ( battlePlayers[0].party.length >= 8 ) {
          battleOutOfSlots = true;
        } else if ( battlePlayers[0].pokeballs.filter(item => item <= 0).length >= 3 ) {
          battleOutOfPokeball = true;
        } else {
          battleSelectedOption = battleSelectedButton;
          battleSelectedButton = -1;
        }
      } else if ( battleSelectedButton == 2 && battlePlayers[0].active + 1 >= battlePlayers[0].party.length ) {
        battleOutOfCountries = true;
      } else if ( battleSelectedButton == 3 ) {
        battleDialogueItem = 99;
        resetBattle();
        mapTrainerComplete(1);
      } else {
        battleSelectedOption = battleSelectedButton;
        battleSelectedButton = -1;
      }
    } else {
      if ( battleSelectedOption == 0 && battlePlayers[0].pp[battleBoxSelected] <= 0 ) {
        battleOutOfPP = true;
      } else if ( battleSelectedOption == 1 && battlePlayers[0].pokeballs[battleBoxSelected] <= 0 ) {
        battleOutOfPokeball = true;
      } else {
        if ( battleSelectedOption == 0 ) battleSelectedMove = battleBoxSelected;
        else battleShakingType = battleBoxSelected;
        if ( battleSelectedOption == 2 ) battleChangePlayer = battlePlayers[0].active + battleBoxSelected;
        battleDialogueItem = [3,10,8][battleSelectedOption];
        battleSelectedOption = -1;
        battleDialogueIncrement();
      }
    }
  }
}

function resetBattle() {
  battlePlayers[0].active = -1;
  battlePlayers[1].active = -1;
  battleTextToDraw = "";
  battleCharDrawn = 0;
  battleDialogueItem = 0;
  battleFlashingToggle = 0;
  battleSelectedButton = 0;
  battleSelectedOption = -1;
  battleBoxItems = null;
  battleBoxSelected = 0;
  battleSelectedMove = null;
  battleMovementTimer = 0;
  battleMovementPlayer = 0;
  battleDamageComplete = false;
  battleFaintPlayer = 0;
  battleFaintComplete = false;
}
