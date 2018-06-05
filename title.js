var titleMode = 0;
var titleCountryX = 0;
var titleMoving = 0;

function renderTitle() {
  // rendering code
  ctx.globalAlpha = 1;
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  var image = document.getElementById("image");
  ctx.drawImage(image,0,0,canvas.width,canvas.height);
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#000099";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.globalAlpha = 1;
  ctx.font = canvas.width * 0.125 + "px Menlo";
  ctx.strokeStyle = "white";
  ctx.textAlign = "center";
  ctx.strokeText("PokeCountry",canvas.width * 0.5,canvas.height * 0.25);
  ctx.strokeStyle = "white";
  var radius = canvas.width * 0.11;
  for ( var i = 0; i < names.length; i++ ) {
    if ( names[i] == "Switzerland" ) continue;
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5 + radius * 2.5 * (i - titleCountryX),canvas.height * 0.7,radius,0,2 * Math.PI);
    ctx.clip();
    for ( var j = 0; j < flags[i].length; j++ ) {
      var pos = [Math.floor(j / 3),j % 3];
      var pixelPosition = [(pos[0] - 1.5) * (radius / 1.5),(pos[1] - 1.5) * (radius / 1.5)];
      ctx.globalAlpha = Math.abs(titleCountryX - i) < 0.99 ? 1 : 0.5;
      ctx.fillStyle = ["red","orange","yellow","green","blue","purple","black","white"][flags[i][j]];
      ctx.fillRect(canvas.width * 0.5 + radius * 2.5 * (i - titleCountryX) + pixelPosition[0],canvas.height * 0.7 + pixelPosition[1],radius / 1.5,radius / 1.5);
    }
    ctx.restore();
  }
  // internal game code
  if ( titleMoving != 0 ) {
    titleCountryX += titleMoving * 0.05;
    if ( Math.abs(titleCountryX - Math.round(titleCountryX)) < 0.01 ) titleMoving = 0;
  }
}
