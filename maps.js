var maps = [
  `00000000000000000000
   00000000000000000000
   00113111111111111100
   00111111111111111100
   00111111444444444400
   00111111411111111400
   00111111411111111400
   00111111411111111400
   00111111111111111400
   00111111444444444400
   00222222222222222200
   00222222222222222200
   00222222222222222200
   00222222222222222200
   00000000000000000000
   00000000000000000000`,
  `00000
   01110
   01130
   01110
   00000`
].map(item => item.split("\n").map(jtem => jtem.trim().split("").map(ktem => parseInt(ktem))));
// Groups: 0-3 [US,Russia,Europe,China]
// Limit move levels to 1 <= x <= 5, except SURRENDER = 0
var mapMetadata = [
  {
    trainers: [
      {
        country: 4,
        x: 2,
        y: 10,
        direction: 0,
        colored: true,
        exists: true,
        battleData: {
          trigger: true,
          country: 4,
          visibleCountry: 4,
          active: -1,
          hp: [100],
          pp: [100,100,100,100],
          skill: 0.4,
          party: [
            {
              country: 5,
              group: 2,
              moves: [
                [4,1],
                [5,2],
                [6,0],
              ],
              hp: [100],
              pp: [100,100,100,100],
            },
            {
              country: 6,
              group: 2,
              moves: [
                [4,1],
                [5,2],
                [6,0],
              ],
              hp: [100],
              pp: [100,100,100,100],
            }
          ],
          onDefeat: function() {
            console.log("finished");
          }
        },
        npcData: {
          trigger: false
        }
      },
      {
        country: 4,
        x: 5,
        y: 10,
        direction: 0,
        colored: true,
        exists: true,
        battleData: {
          trigger: true,
          country: 4,
          visibleCountry: 4,
          active: -1,
          hp: [100],
          pp: [100,100,100,100],
          skill: 0.4,
          party: [
            {
              country: 5,
              group: 2,
              moves: [
                [4,1],
                [5,2],
                [6,0],
              ],
              hp: [100],
              pp: [100,100,100,100],
            },
            {
              country: 6,
              group: 2,
              moves: [
                [4,1],
                [5,2],
                [6,0],
              ],
              hp: [100],
              pp: [100,100,100,100],
            }
          ],
          onDefeat: function() {
            console.log("finished");
          }
        },
        npcData: {
          trigger: false
        }
      },
      {
        country: 8,
        x: 5,
        y: 5,
        direction: 0,
        exists: true,
        colored: true,
        battleData: {
          trigger: false
        },
        npcData: {
          trigger: true,
          type: 2,
          dialogue: null,
          trade: [1,4,[
            [4,1],
            [5,2],
            [6,0],
          ]]
        }
      }
    ],
    warps: [
      {
        inloc: [4,2],
        outloc: [2,2],
        world: 1
      }
    ],
    reset: [5,2]
  },
  {
    trainers: [],
    warps: [
      {
        inloc: [3,2],
        outloc: [2,2],
        world: 0
      }
    ],
    reset: [2,2]
  }
];

var mapObjects = [
  {
    country: 0,
    x: -1,
    y: -1,
    direction: 0,
    colored: true,
    exists: true,
    battleData: {
      country: 0,
      visibleCountry: 0,
      faintedCountries: 0,
      active: -1,
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
  }
];
var mapPosition = [2,2];
var mapIndex = 0;
var mapBattlePoints = 0;
var mapCurrentBattle;
var mapCanMove = true;
var mapInExit = false;
var mapInvincible = false;
var mapKeypresses = {
  up: false,
  down: false,
  left: false,
  right: false
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
      ctx.fillStyle = ["lightblue","green","white","black","brown"][map[Math.floor(sum[1])][Math.floor(sum[0])]];
      ctx.fillRect(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0]))) - 1,unit * (j - (mapPosition[1] - Math.floor(mapPosition[1]))) - 1,unit + 2,unit + 2);
      if ( mapEnableGrid ) {
        ctx.strokeRect(unit * (i - (mapPosition[0] - Math.floor(mapPosition[0]))),unit * (j - (mapPosition[1] - Math.floor(mapPosition[1]))),unit,unit);
      }
    }
  }
  for ( var i = 0; i < mapObjects.length; i++ ) {
    if ( ! mapObjects[i].exists ) continue;
    ctx.fillStyle = "#000000";
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
  var warps = mapMetadata[mapIndex].warps;
  for ( var i = 0; i < warps.length; i++ ) {
    if ( Math.round(mapPosition[0]) == warps[i].inloc[0] && Math.round(mapPosition[1])  == warps[i].inloc[1] ) {
      openNewMap(warps[i].world,warps[i].outloc);
    }
  }
  if ( mapCanMove ) {
    if ( mapKeypresses.up && maps[mapIndex][Math.floor(mapPosition[1])][Math.round(mapPosition[0])] != 4 ) mapPosition[1] -= 0.04;
    if ( mapKeypresses.down && maps[mapIndex][Math.ceil(mapPosition[1])][Math.round(mapPosition[0])] != 4 ) mapPosition[1] += 0.04;
    if ( mapKeypresses.left && maps[mapIndex][Math.round(mapPosition[1])][Math.floor(mapPosition[0])] != 4 ) mapPosition[0] -= 0.04;
    if ( mapKeypresses.right && maps[mapIndex][Math.round(mapPosition[1])][Math.ceil(mapPosition[0])] != 4 ) mapPosition[0] += 0.04;
  }
  if ( map[Math.round(mapPosition[1])][Math.round(mapPosition[0])] == 0 && ! mapInExit ) {
    mapCanMove = false;
    mapInExit = true;
    blurActive = 1;
    setTimeout(function() {
      mapPosition[0] = mapMetadata[mapIndex].reset[0];
      mapPosition[1] = mapMetadata[mapIndex].reset[1];
      setTimeout(function() {
        mapCanMove = true;
        mapInExit = false;
      },1250);
    },1250);
  }
  var triggered = false;
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
    } else {
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
    }
  }
  if ( ! triggered ) mapInvincible = false;
}

function openNewMap(index,newloc) {
  if ( mapInExit ) return;
  mapCanMove = false;
  mapInExit = true;
  blurActive = 1;
  setTimeout(function() {
    mapIndex = index;
    mapPosition[0] = newloc[0];
    mapPosition[1] = newloc[1];
    mapObjects = [mapObjects[0]].concat(mapMetadata[mapIndex].trainers);
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
  battlePlayers = [mapObjects[0].battleData,mapMetadata[mapIndex].trainers[index - 1].battleData];
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

function mapTrainerComplete(winner) {
  blurActive = 1;
  setTimeout(function() {
    gamemode = "map";
    if ( winner == 0 ) {
      mapObjects[mapCurrentBattle].exists = false;
      mapMetadata[mapIndex].trainers[mapCurrentBattle - 1].exists = false;
    } else {
      mapInvincible = true;
      mapObjects[mapCurrentBattle].colored = true;
      mapMetadata[mapIndex].trainers[mapCurrentBattle - 1].colored = true;
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
  var index = ["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].indexOf(key);
  if ( index > -1 && down ) mapObjects[0].direction = index;
}
