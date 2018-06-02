var menuActive = true;
var menuTextList = ["","PARTY","ITEMS","NEW GAME",5,6,7,8,9];
var menuSubList = [];
var menuConfirm = false;
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
  if ( menuSubSelected > -1 ) {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    drawRoundedRect(10,canvas.width * 0.2 + 10,canvas.height * 0.1 * menuMainSelected + 10,canvas.width * 0.4 - 10,canvas.height * 0.333);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = "black";
    for ( var i = 0; i < menuSubList.length; i++ ) {
      var y = canvas.height * 0.1 * (i + menuMainSelected + 1) + 10;
      ctx.fillText(menuSubList[i],canvas.width * 0.27,y);
      if ( menuSubSelected == i ) {
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.2375,y);
        ctx.lineTo(canvas.width * 0.26,y - canvas.height * 0.025);
        ctx.lineTo(canvas.width * 0.2375,y - canvas.height * 0.05);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
}

function handleKeyboardMenu(key) {
  if ( (key == "ArrowUp" || key == "ArrowDown") && menuActive ) {
    if ( menuSubSelected < 0 ) {
      if ( key == "ArrowUp" && menuMainSelected > (menuMode == 0 ? 1 : 0) ) menuMainSelected--;
      if ( key == "ArrowDown" && menuMainSelected < menuTextList.length - 1 ) menuMainSelected++;
    } else {
      if ( key == "ArrowUp" && menuSubSelected > (menuMode == 0 ? 1 : 0) ) menuSubSelected--;
      if ( key == "ArrowDown" && menuSubSelected < menuSubList.length - 1 ) menuSubSelected++;
    }
  }
  if ( key == " " ) {
    if ( menuMode == 0 && menuMainSelected < 3 ) {
      menuMode = menuMainSelected;
      menuMainSelected = 0;
      menuTextList = [
        ["ERROR"],
        mapObjects[0].battleData.party.map(item => names[item.country].toUpperCase())
      ][menuMode];
      menuSubList = [
        ["ERROR"],
        ["MOVE UP","MOVE DOWN","RELEASE"].slice(0,mapObjects[0].battleData.party.length > 1 ? 3 : 2)
      ][menuMode];
    } else if ( menuMode == 0 && menuMainSelected == 3 ) {
      // run new game code
    } else if ( menuSubSelected <= -1 ) {
      menuSubSelected = 0;
    } else {
      if ( menuMode == 1 ) {
        var party = mapObjects[0].battleData.party;
        if ( ! menuConfirm ) {
          if ( menuSubSelected == 0 ) party.splice(menuMainSelected - 1,0,party.splice(menuMainSelected,1)[0]);
          else if ( menuSubSelected == 1 ) party.splice(menuMainSelected + 1,0,party.splice(menuMainSelected,1)[0]);
        } else {
          if ( menuSubSelected == 0 ) party.splice(menuMainSelected,1);
        }
        menuTextList = [
          ["ERROR"],
          mapObjects[0].battleData.party.map(item => names[item.country].toUpperCase())
        ][menuMode];
        if ( menuSubSelected < 2 ) {
          menuSubSelected = -1;
          menuMainSelected = 0;
          menuSubList = ["MOVE UP","MOVE DOWN","RELEASE"].slice(0,mapObjects[0].battleData.party.length > 1 ? 3 : 2);
          menuConfirm = false;
        } else {
          menuSubSelected = 0;
          menuSubList = ["RELEASE","CANCEL"];
          menuConfirm = true;
        }
      }
    }
  }
}
