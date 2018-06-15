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

var flags = [
  `440440070`, // US
  `602602602`, // Germany
  `740740740`, // Russia
  `200000000`, // China
  `000707000`, // Canada
  `444777000`, // France
  `777003003`, // Belarus
  `000020000`, // Vietnam
  `000707000`, // Canada
  `444777000`, // France
  `777003003`, // Belarus
  `000020000`, // Vietnam
  `000707000`, // Canada
  `444777000`, // France
  `777003003`, // Belarus
  `000020000`, // Vietnam
  `070777070`  // Switzerland
].map(item => item.split("").map(jtem => parseInt(jtem)));
var names =  ["USA","Germany","Russia","China","Canada","France","Belarus","Vietnam","Canada","France","Belarus","Vietnam","Canada","France","Belarus","Vietnam","Switzerland"];
var groups = [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,-1];
var moves = [
  {
    name: "WWI",
    power: [3,2,1,2],
    selfInflict: 0,
    missChance: 0.25,
    onUse: function(object,party,player) {}
  },
  {
    name: "WWII",
    power: [3,2,1,2],
    selfInflict: 0,
    missChance: 0.25,
    onUse: function(object,party,player) {}
  },
  {
    name: "DIVIDE",
    power: [3,2,1,2],
    selfInflict: 0.5,
    missChance: 0,
    onUse: function(object,party,player) {
      if ( party.length < 8 ) party.push(player);
    }
  },
  {
    name: "EU",
    power: [2,3,1,2],
    selfInflict: 0,
    missChance: 0.33,
    onUse: function(object,party,player) {}
  },
  {
    name: "FREE FRANCE",
    power: [3,3,1,3],
    selfInflict: 0.25,
    missChance: 0.5,
    onUse: function(object,party,player) {}
  },
  {
    name: "GUILLOTINE",
    power: [3,1,1,1],
    selfInflict: 0,
    missChance: 0,
    onUse: function(object,party,player) {}
  },
  {
    name: "SURRENDER",
    power: [3,3,3,3],
    selfInflict: 1,
    missChance: 1,
    onUse: function(object,party,player) {}
  }
];
var initialBattleData = [
  {
    country: 0,
    visibleCountry: 0,
    faintedCountries: 0,
    active: -1,
    hp: [100],
    pp: [100,100,100,100],
    hexaballs: [0,0,0],
    party: [
      {
        country: 0,
        group: 1,
        moves: [
          [0,1],
          [1,2],
          [2,3],
          [3,4]
        ],
        hp: [100],
        pp: [100,100,100,100]
      }
    ]
  }
]

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
    else if ( gamemode != "stop" ) throw new Error("Invalid gamemode");
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
