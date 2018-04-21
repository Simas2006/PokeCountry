var flags = [
  `440440070`, // US
  `602602602`, // Germany
  `740740740`, // Russia
  `220220000`, // China
  `000707000`, // Canada
  `444777000`, // France
  `777003003`, // Belarus
  `000020000`  // Vietnam
].map(item => item.split("").map(jtem => parseInt(jtem)));
var maps = [
  `00000000000000000000
   00000000000000000000
   00111111111111111100
   00111111111111111100
   00111111111111111100
   00111111111111111100
   00111111111111111100
   00111111111111111100
   00222222222222222200
   00222222222222222200
   00222222222222222200
   00222222222222222200
   00222222222222222200
   00222222222222222200
   00000000000000000000
   00000000000000000000`
].map(item => item.split("\n").map(jtem => jtem.trim().split("").map(ktem => parseInt(ktem))));
var mapMetadata = [
  {
    trainers: [
      {
        country: 7,
        x: 2,
        y: 2,
        direction: 0
      },
      {
        country: 6,
        x: 4,
        y: 4,
        direction: 0
      }
    ],
    warps: [
      {
        inloc: [4,2],
        outloc: [0,0],
        world: 1
      }
    ]
  }
];

var players = [
  {
    country: 0,
    x: -1,
    y: -1,
    direction: 0
  }
];
var mapPosition = [0,0];
var mapIndex = 0;
var zoomLevel = 12;
var enableGridInMap = true;

function renderMap() {
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext("2d");
  var map = maps[mapIndex];
  var unit = canvas.width / zoomLevel;
  for ( var i = 0; i < zoomLevel; i++ ) {
    for ( var j = 0; j < zoomLevel; j++ ) {
      var sum = [
        Math.min(Math.max(j + mapPosition[1] - zoomLevel / 2,0),map.length - 1),
        Math.min(Math.max(i + mapPosition[0] - zoomLevel / 2,0),map[0].length - 1)
      ];
      ctx.fillStyle = ["lightblue","green","white"][map[Math.round(sum[0])][Math.round(sum[1])]];
      ctx.fillRect(unit * i - 1,unit * j - 1,unit + 2,unit + 2);
      if ( enableGridInMap ) {
        ctx.strokeStyle = "black";
        ctx.strokeRect(unit * i,unit * j,unit,unit);
      }
    }
  }
  for ( var i = 0; i < players.length; i++ ) {
    ctx.fillStyle = "#000000";
    var sum = [
      players[i].x == -1 ? zoomLevel / 2 : players[i].x - mapPosition[0] + (zoomLevel / 2),
      players[i].y == -1 ? zoomLevel / 2 : players[i].y - mapPosition[1] + (zoomLevel / 2)
    ];
    ctx.save();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(unit * (sum[0] + 0.5),unit * (sum[1] + 0.5),unit / 2,0,2 * Math.PI);
    ctx.stroke();
    ctx.clip();
    var flag = flags[players[i].country];
    for ( var j = 0; j < flag.length; j++ ) {
      var pixelPosition = [
        (Math.floor(j / 3) - 1.5) * (unit / 3),
        (j % 3 - 1.5) * (unit / 3)
      ];
      ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flag[j]];
      ctx.fillRect(unit * (sum[0] + 0.5) + pixelPosition[0],unit * (sum[1] + 0.5) + pixelPosition[1],unit / 3,unit / 3);
    }
    ctx.restore();
    var directions = [[0.5,0.8,0.4],[0.375,0.675,0.525],[0.5,0.2,0.4],[0.375,0.675,0.3]];
    ctx.fillStyle = "white";
    ctx.lineWidth = "2";
    ctx.beginPath();
    ctx.arc(unit * (sum[0] + directions[players[i].direction][0]),unit * (sum[1] + directions[players[i].direction][2]),unit / 7,0,2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(unit * (sum[0] + directions[players[i].direction][1]),unit * (sum[1] + directions[players[i].direction][2]),unit / 7,0,2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
}
