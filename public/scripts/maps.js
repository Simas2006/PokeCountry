var mapObjects = [];
var mapPosition = [0,0];
var mapIndex;
var mapMetadataID = 0;
var mapCurrentBattle;
var mapCanMove = true;
var mapInExit = false;
var mapInvincible = false;
var mapKeypresses = {
  up: false,
  down: false,
  left: false,
  right: false,
  x: false
}

var mapZoomLevel = 12;
var mapEnableGrid = false;

function renderMap() {
  // rendering code
  var map = maps[mapIndex];
  var unit = Math.min(canvas.width,canvas.height) / mapZoomLevel;
  if ( Math.ceil(mapPosition[0]) - mapPosition[0] < 1e-4 ) mapPosition[0] = Math.ceil(mapPosition[0]);
  if ( Math.ceil(mapPosition[1]) - mapPosition[1] < 1e-4 ) mapPosition[1] = Math.ceil(mapPosition[1]);
  ctx.strokeStyle = "black";
  for ( var i = 0; i < mapZoomLevel + 1; i++ ) {
    for ( var j = 0; j < mapZoomLevel + 1; j++ ) {
      var sum = [
        Math.min(Math.max(i + mapPosition[0] - mapZoomLevel / 2,0),map[0].length - 1),
        Math.min(Math.max(j + mapPosition[1] - mapZoomLevel / 2,0),map.length - 1)
      ];
      ctx.fillStyle = mapMetadata[mapIndex][mapMetadataID].tileData.tileset[map[Math.floor(sum[1])][Math.floor(sum[0])]] || "white";
      ctx.fillRect(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0]))) - 1,unit * (j - (mapPosition[1] - Math.floor(mapPosition[1]))) - 1,unit + 2,unit + 2);
      if ( mapEnableGrid ) ctx.strokeRect(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0]))),unit * (j - (mapPosition[1] - Math.floor(mapPosition[1]))),unit,unit);
    }
  }
  var gymx = mapMetadata[mapIndex][mapMetadataID].onScreenObjects.gym.x;
  var gymy = mapMetadata[mapIndex][mapMetadataID].onScreenObjects.gym.y;
  var pcx = mapMetadata[mapIndex][mapMetadataID].onScreenObjects.pc.x;
  var pcy = mapMetadata[mapIndex][mapMetadataID].onScreenObjects.pc.y;
  for ( var i = 0; i < mapZoomLevel + 1; i++ ) {
    for ( var j = 0; j < mapZoomLevel + 1; j++ ) {
      var sum = [
        Math.min(Math.max(i + mapPosition[0] - mapZoomLevel / 2,0),map[0].length - 1),
        Math.min(Math.max(j + mapPosition[1] - mapZoomLevel / 2,0),map.length - 1)
      ];
      if ( gymx >= 0 && sum[0] >= gymx && sum[0] <= gymx + 5 && sum[1] >= gymy && sum[1] <= gymy + 7 ) {
        var rx = Math.floor(sum[0] - gymx)
        var ry = Math.floor(sum[1] - gymy);
        if ( ! ((rx == 0 || rx == 4) && ry == 0) ) {
          ctx.fillStyle = (rx == 2 && ry == 4) ? "red" : "black";
          ctx.fillRect(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0]))) - 1,unit * (j - (mapPosition[1] - Math.floor(mapPosition[1]))) - 1,unit + 2,unit + 2);
          if ( rx != 2 || ry != 4 ) {
            ctx.fillStyle = (rx == 2 && ry >= 5) ? "black" : "rgb(83,47,14)";
            ctx.fillRect(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0]))) - 1,unit * (j - (mapPosition[1] - Math.floor(mapPosition[1]))) - 1,unit + 2,(unit * 0.5) + 2);
          }
        } else if ( rx == 0 && ry == 0 ) {
          ctx.fillStyle = "rgb(83,47,14)";
          ctx.beginPath();
          ctx.moveTo(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0])) + 1),unit * (j - (mapPosition[1] - Math.floor(mapPosition[1]))),unit + 2,unit + 2);
          ctx.lineTo(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0]))),unit * (j - (mapPosition[1] - Math.floor(mapPosition[1])) + 1),unit + 2,unit + 2);
          ctx.lineTo(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0])) + 1),unit * (j - (mapPosition[1] - Math.floor(mapPosition[1])) + 1),unit + 2,unit + 2);
          ctx.closePath();
          ctx.fill();
        } else if ( rx == 4 && ry == 0 ) {
          ctx.fillStyle = "rgb(83,47,14)";
          ctx.beginPath();
          ctx.moveTo(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0]))),unit * (j - (mapPosition[1] - Math.floor(mapPosition[1]))),unit + 2,unit + 2);
          ctx.lineTo(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0])) + 1),unit * (j - (mapPosition[1] - Math.floor(mapPosition[1])) + 1),unit + 2,unit + 2);
          ctx.lineTo(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0]))),unit * (j - (mapPosition[1] - Math.floor(mapPosition[1])) + 1),unit + 2,unit + 2);
          ctx.closePath();
          ctx.fill();
        }
      }
      if ( pcx >= 0 && sum[0] >= pcx && sum[0] <= pcx + 5 && sum[1] >= pcy && sum[1] <= pcy + 3 ) {
        var rx = Math.floor(sum[0] - pcx)
        var ry = Math.floor(sum[1] - pcy);
        ctx.fillStyle = "#eeeeee";
        ctx.fillRect(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0]))) - 1,unit * (j - (mapPosition[1] - Math.floor(mapPosition[1]))) - 1,unit + 2,unit + 2);
        if ( rx == 3 && ry != 0 ) {
          ctx.fillStyle = "black";
          ctx.fillRect(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0]))) - 1,unit * (j - (mapPosition[1] - Math.floor(mapPosition[1]))) - 1,unit + 2,unit + 2);
        }
        ctx.fillStyle = "red";
        if ( rx == 0 ) ctx.fillRect(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0]))) - 1,unit * (j - (mapPosition[1] - Math.floor(mapPosition[1]))) - 1,(unit * 0.1) + 2,unit + 2);
        if ( rx == 4 ) ctx.fillRect(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0])) + 0.9) - 1,unit * (j - (mapPosition[1] - Math.floor(mapPosition[1]))) - 1,(unit * 0.1) + 2,unit + 2);
        if ( ry == 0 ) ctx.fillRect(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0]))) - 1,unit * (j - (mapPosition[1] - Math.floor(mapPosition[1]))) - 1,unit + 2,(unit * 0.1) + 2);
        if ( rx == 3 && ry == 1 ) {
          ctx.fillStyle = "black";
          ctx.strokeStyle = "black";
          ctx.font = (unit * 0.5) + "px Menlo";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("S",unit * (i - (mapPosition[0] - Math.floor(mapPosition[0])) - 0.75) - 1,unit * (j - (mapPosition[1] - Math.floor(mapPosition[1])) + 0.25) - 1);
          ctx.fillText("C",unit * (i - (mapPosition[0] - Math.floor(mapPosition[0])) - 0.25) - 1,unit * (j - (mapPosition[1] - Math.floor(mapPosition[1])) + 0.75) - 1);
          ctx.beginPath();
          ctx.moveTo(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0]))) - 1,unit * (j - (mapPosition[1] - Math.floor(mapPosition[1]))) - 1);
          ctx.lineTo(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0])) - 1) - 1,unit * (j - (mapPosition[1] - Math.floor(mapPosition[1])) + 1) - 1);
          ctx.stroke();
        }
      }
    }
  }
  for ( var i = 0; i < mapObjects.length; i++ ) {
    if ( ! mapObjects[i].exists ) continue;
    ctx.strokeStyle = i == 0 ? "gold" : "black";
    ctx.fillStyle = "black";
    var sum = [
      mapObjects[i].x == -1 ? mapZoomLevel / 2 : mapObjects[i].x - mapPosition[0] + (mapZoomLevel / 2),
      mapObjects[i].y == -1 ? mapZoomLevel / 2 : mapObjects[i].y - mapPosition[1] + (mapZoomLevel / 2)
    ];
    ctx.save();
    ctx.beginPath();
    ctx.arc(unit * (sum[0] + 0.5),unit * (sum[1] + 0.5),unit / 2,0,2 * Math.PI);
    ctx.stroke();
    ctx.clip();
    if ( mapObjects[i].colored ) {
      var flag = flags[mapObjects[i].country];
      for ( var j = 0; j < flag.length; j++ ) {
        var pixelPosition = [
          (Math.floor(j / 3) - 1.5) * (unit / 3),
          (j % 3 - 1.5) * (unit / 3)
        ];
        ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flag[j]];
        ctx.fillRect(unit * (sum[0] + 0.5) + pixelPosition[0],unit * (sum[1] + 0.5) + pixelPosition[1],unit / 3,unit / 3);
      }
    }
    ctx.restore();
    var directions = [[0.5,0.8,0.4],[0.375,0.675,0.525],[0.5,0.2,0.4],[0.375,0.675,0.3]];
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(unit * (sum[0] + directions[mapObjects[i].direction][0]),unit * (sum[1] + directions[mapObjects[i].direction][2]),unit / 7,0,2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(unit * (sum[0] + directions[mapObjects[i].direction][1]),unit * (sum[1] + directions[mapObjects[i].direction][2]),unit / 7,0,2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
  // internal game code
  var triggered = false;
  var warps = mapMetadata[mapIndex][mapMetadataID].warps;
  for ( var i = 0; i < warps.length; i++ ) {
    if ( Math.round(mapPosition[0]) == warps[i].inloc[0] && Math.round(mapPosition[1]) == warps[i].inloc[1] ) {
      if ( mapCheckTriggerMaps.indexOf(warps[i].world) <= -1 || mapCheckTriggerMaps.indexOf(mapIndex) <= -1 || (completedGyms.us || completedGyms.eu || completedGyms.ru || completedGyms.ch) ) {
        openNewMap(warps[i].world,warps[i].outloc,warps[i].metaID);
      } else {
        if ( ! npcTextDrawing && ! mapInvincible && ! mapKeypresses.down ) {
          npcData = {
            type: 3,
            dialogue: "Try beating a gym before continuing."
          }
          npcDialogueItem = 0;
          npcCharDrawn = 0;
          npcActiveResult = 0;
          npcTextDrawing = true;
        }
        triggered = true;
      }
    }
  }
  if ( mapCanMove ) {
    var speed = mapKeypresses.x ? 0.0825 : 0.045;
    var walls = mapMetadata[mapIndex][mapMetadataID].tileData.walls;
    var gymtrigger = [
      ! (mapPosition[0] >= gymx - 1 && mapPosition[0] <= gymx + 5 && mapPosition[1] >= gymy && mapPosition[1] <= gymy + 7) || Math.round(mapPosition[0]) == gymx + 2,
      ! (mapPosition[0] >= gymx - 1 && mapPosition[0] <= gymx + 5 && mapPosition[1] >= gymy - 1 && mapPosition[1] <= gymy + 6),
      ! (mapPosition[0] >= gymx && mapPosition[0] <= gymx + 5 && mapPosition[1] >= gymy - 1 && mapPosition[1] <= gymy + 7),
      ! (mapPosition[0] >= gymx - 1 && mapPosition[0] <= gymx + 4 && mapPosition[1] >= gymy - 1 && mapPosition[1] <= gymy + 7),
    ];
    var pctrigger = [
      ! (mapPosition[0] >= pcx - 1 && mapPosition[0] <= pcx + 5 && mapPosition[1] >= pcy && mapPosition[1] <= pcy + 3) || Math.round(mapPosition[0]) == pcx + 3,
      ! (mapPosition[0] >= pcx - 1 && mapPosition[0] <= pcx + 5 && mapPosition[1] >= pcy - 1 && mapPosition[1] <= pcy + 2),
      ! (mapPosition[0] >= pcx && mapPosition[0] <= pcx + 5 && mapPosition[1] >= pcy - 1 && mapPosition[1] <= pcy + 3),
      ! (mapPosition[0] >= pcx - 1 && mapPosition[0] <= pcx + 4 && mapPosition[1] >= pcy - 1 && mapPosition[1] <= pcy + 3)
    ];
    if ( mapMetadata[mapIndex][mapMetadataID].onScreenObjects.gym.x <= -1 ) gymtrigger = [true,true,true,true];
    if ( mapMetadata[mapIndex][mapMetadataID].onScreenObjects.pc.x <= -1 ) pctrigger = [true,true,true,true];
    if ( mapKeypresses.up && walls.indexOf(map[Math.floor(mapPosition[1])][Math.round(mapPosition[0])]) <= -1 && gymtrigger[0] && pctrigger[0] ) mapPosition[1] -= speed;
    if ( mapKeypresses.down && walls.indexOf(map[Math.ceil(mapPosition[1])][Math.round(mapPosition[0])]) <= -1 && gymtrigger[1] && pctrigger[1] ) mapPosition[1] += speed;
    if ( mapKeypresses.left && walls.indexOf(map[Math.round(mapPosition[1])][Math.floor(mapPosition[0])]) <= -1 && gymtrigger[2] && pctrigger[2] ) mapPosition[0] -= speed;
    if ( mapKeypresses.right && walls.indexOf(map[Math.round(mapPosition[1])][Math.ceil(mapPosition[0])]) <= -1 && gymtrigger[3] && pctrigger[3] ) mapPosition[0] += speed;
  }
  for ( var i = 1; i < mapObjects.length; i++ ) {
    if ( ! mapObjects[i].exists ) continue;
    if ( mapObjects[i].battleData.trigger ) {
      if (
        Math.sqrt(
          Math.pow(Math.abs(mapPosition[0] - mapObjects[i].x),2) +
          Math.pow(Math.abs(mapPosition[1] - mapObjects[i].y),2)
        ) <= 3 && ! mapInExit && mapObjects[0].battleData.faintedCountries < mapObjects[0].battleData.party.length
      ) {
        if ( ! mapInvincible ) mapBattleTrainer(i);
        triggered = true;
      }
    } else if ( mapObjects[i].npcData.trigger ) {
      if (
        Math.sqrt(
          Math.pow(Math.abs(mapPosition[0] - mapObjects[i].x),2) +
          Math.pow(Math.abs(mapPosition[1] - mapObjects[i].y),2)
        ) <= 2 && ! mapInExit
      ) {
        if ( ! mapInvincible && ! npcTextDrawing ) {
          npcData = mapObjects[i].npcData;
          npcDialogueItem = 0;
          npcCharDrawn = 0;
          npcActiveResult = 0;
          npcTextDrawing = true;
          mapKeypresses = {
            up: false,
            down: false,
            left: false,
            right: false
          }
        }
        triggered = true;
      }
    } else if ( mapObjects[i].enterBossFight ) {
      if (
        Math.sqrt(
          Math.pow(Math.abs(mapPosition[0] - mapObjects[i].x),2) +
          Math.pow(Math.abs(mapPosition[1] - mapObjects[i].y),2)
        ) <= 2 && ! mapInExit
      ) {
        if ( ! mapInvincible ) mapEnterBossFight(i);
        triggered = true;
      }
    }
  }
  if ( ! triggered ) mapInvincible = false;
}

function openNewMap(index,newloc,metaid) {
  if ( mapInExit ) return;
  mapCanMove = false;
  mapInExit = true;
  blurActive = 1;
  setTimeout(function() {
    mapIndex = index;
    mapMetadataID = metaid;
    mapPosition[0] = newloc[0];
    mapPosition[1] = newloc[1];
    mapObjects = [mapObjects[0]].concat(mapMetadata[mapIndex][mapMetadataID].trainers);
    setTimeout(function() {
      mapCanMove = true;
      mapInExit = false;
    },1250);
  },1250);
}

function mapBattleTrainer(index) {
  mapInExit = true;
  mapCanMove = false;
  mapObjects[0].colored = false;
  if ( mapObjects[index] ) mapObjects[index].colored = false;
  battlePlayers = [mapObjects[0].battleData,mapMetadata[mapIndex][mapMetadataID].trainers[index - 1].battleData];
  mapCurrentBattle = index;
  setTimeout(function() {
    blurActive = 1;
    setTimeout(function() {
      battleSwapTime = 1.5;
      battleSwapDirection = 1;
      battleSwapPlayer = -1;
      gamemode = "battle";
      mapCanMove = true;
      mapInExit = false;
    },1250);
  },1250);
}

function mapEnterBossFight(index) {
  mapInExit = true;
  mapCanMove = false;
  mapObjects[0].colored = false;
  if ( mapObjects[index] ) mapObjects[index].colored = false;
  bossPlayer = mapObjects[0].battleData;
  bossAttackCountry = mapObjects[index].country;
  bossPlayerX = canvas.width * 0.25;
  bossPlayerY = canvas.height * 0.9;
  setTimeout(function() {
    blurActive = 1;
    setTimeout(function() {
      gamemode = "bossfight";
      mapCanMove = true;
      mapInExit = false;
    },1250);
  },1250);
}

function mapTrainerComplete(winner) {
  blurActive = 1;
  setTimeout(function() {
    gamemode = "map";
    if ( winner == 0 ) {
      mapObjects[mapCurrentBattle].exists = false;
      mapMetadata[mapIndex][mapMetadataID].trainers[mapCurrentBattle - 1].exists = false;
    } else {
      mapInvincible = true;
      mapObjects[mapCurrentBattle].colored = true;
      mapMetadata[mapIndex][mapMetadataID].trainers[mapCurrentBattle - 1].colored = true;
    }
    mapObjects[0].colored = true;
    mapKeypresses = {
      up: false,
      down: false,
      left: false,
      right: false
    }
    battleWinner = -1;
    mapBattlePoints = winner == 0 ? 1 : -1;
  },1250);
}

function handleKeyboardMap(key,down) {
  if ( key == "ArrowUp" ) mapKeypresses.up = down;
  if ( key == "ArrowDown" ) mapKeypresses.down = down;
  if ( key == "ArrowLeft" ) mapKeypresses.left = down;
  if ( key == "ArrowRight" ) mapKeypresses.right = down;
  if ( key == "x" ) mapKeypresses.x = down;
  var index = ["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].indexOf(key);
  if ( index > -1 && down ) mapObjects[0].direction = index;
}
