var battlePlayers = [];
var battleSwapTime = 0;
var battleSwapDirection = 0;

function renderBattle() {
  // rendering code
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  var size = canvas.width * 0.3;
  ctx.beginPath();
  ctx.arc(canvas.width * (0.25 - battleSwapTime),canvas.height * 0.75,size,0,2 * Math.PI);
  ctx.stroke();
  ctx.save();
  ctx.clip();
  var flag = flags[battlePlayers[0].country];
  for ( var j = 0; j < flag.length; j++ ) {
    var pixelPosition = [
      (Math.floor(j / 3) - 1.5) * (size / 1.5),
      (j % 3 - 1.5) * (size / 1.5)
    ];
    ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flag[j]];
    ctx.fillRect(canvas.width * (0.25 - battleSwapTime) + pixelPosition[0],canvas.height * 0.75 + pixelPosition[1],size / 1.5,size / 1.5);
  }
  ctx.restore();
  ctx.beginPath();
  ctx.arc(canvas.width * (0.75 + battleSwapTime),canvas.height * 0.25,size,0,2 * Math.PI);
  ctx.stroke();
  ctx.save();
  ctx.clip();
  var flag = flags[battlePlayers[1].country];
  for ( var j = 0; j < flag.length; j++ ) {
    var pixelPosition = [
      (Math.floor(j / 3) - 1.5) * (size / 1.5),
      (j % 3 - 1.5) * (size / 1.5)
    ];
    ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flag[j]];
    ctx.fillRect(canvas.width * (0.75 + battleSwapTime) + pixelPosition[0],canvas.height * 0.25 + pixelPosition[1],size / 1.5,size / 1.5);
  }
  ctx.restore();
  // internal game code
}
