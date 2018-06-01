var menuActive = true;
var menuTextList = ["","PARTY","ITEMS","NEW GAME","5","6","7","8"];
var menuMode = 0;
var menuMainSelected = 0;
var menuSubSelected = -1;

function renderMenu() {
  if ( ! menuActive ) return;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  drawRoundedRect(10,canvas.width * 0.625,10,canvas.width * 0.375 - 10,canvas.height - 20);
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.font = canvas.width * 0.06 + "px Menlo";
  for ( var i = 0; i < menuTextList.length; i++ ) {
    ctx.fillText(menuTextList[i],canvas.width * 0.675,canvas.height * 0.1 * (i + 1) + 10);
  }
}
