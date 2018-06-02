var menuActive = true;
var menuTextList = ["","PARTY","ITEMS","NEW GAME"];
var menuMode = 0;
var menuMainSelected = 1;
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
    var y = canvas.height * 0.1 * (i + 1) + 10;
    ctx.fillText(menuTextList[i],canvas.width * 0.675,y);
    if ( menuMainSelected == i ) {
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.64,y);
      ctx.lineTo(canvas.width * 0.665,y - canvas.height * 0.025);
      ctx.lineTo(canvas.width * 0.64,y - canvas.height * 0.05);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function handleKeyboardMenu(key) {
  if ( (key == "ArrowUp" || key == "ArrowDown") && menuActive ) {
    if ( key == "ArrowUp" && menuMainSelected > (menuMode == 0 ? 1 : 0) ) menuMainSelected--;
    if ( key == "ArrowDown" && menuMainSelected < menuTextList.length - 1 ) menuMainSelected++;
  }
}
