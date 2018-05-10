var npcTextToDraw;
var npcCharDrawn = 0;
var npcTextDrawing = false;
var npcFlashingToggle = 0;
var npcReturnState = 1;

/*
 * NPC types:
 * 0 - Nurse Swiss
 * 1 - Pokeball Seller
 * 2 - Trader
 * 3 - One-liner
 */

function renderNPC() {
  if ( npcTextToDraw && npcTextDrawing ) {
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    drawRoundedRect(10,1,canvas.height * 0.75,canvas.width - 2,canvas.height * 0.25 - 1);
    ctx.stroke();
    ctx.fill();
    ctx.font = canvas.height * 0.08 + "px Menlo";
    var sliceOn = npcTextToDraw.length;
    var splitWords = npcTextToDraw.split(" ");
    for ( var i = 0; i < splitWords.length + 1; i++ ) {
      if ( splitWords.slice(0,i).join(" ").length >= 20 ) {
        sliceOn = splitWords.slice(0,i - 1).join(" ").length;
        break;
      }
    }
    if ( npcTextToDraw.indexOf("\n") > -1 ) sliceOn = npcTextToDraw.indexOf("\n");
    ctx.fillStyle = "black";
    ctx.fillText(npcTextToDraw.slice(0,Math.min(Math.floor(npcCharDrawn),sliceOn)),canvas.width * 0.01,canvas.height * 0.85);
    ctx.fillText(npcTextToDraw.slice(sliceOn + 1,Math.floor(npcCharDrawn)),canvas.width * 0.01,canvas.height * 0.97);
    if ( npcCharDrawn <= npcTextToDraw.length ) npcCharDrawn += 0.1;
    if ( npcFlashingToggle > 1 ) {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.9,canvas.height * 0.9);
      ctx.lineTo(canvas.width * 0.98,canvas.height * 0.9);
      ctx.lineTo(canvas.width * 0.94,canvas.height * 0.98);
      ctx.closePath();
      ctx.fill();
    }
    npcFlashingToggle += 0.025;
    if ( npcFlashingToggle >= 2 ) npcFlashingToggle = 0;
  }
}

function handleKeyboardNPC(key) {
  if ( key == "ArrowDown" ) {
    if ( npcReturnState == 0 ) {

    } else {
      npcTextDrawing = false;
    }
  }
}
