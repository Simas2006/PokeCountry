var npcData;
var npcTextToDraw;
var npcCharDrawn = 0;
var npcTextDrawing = false;
var npcFlashingToggle = 0;
var npcDialogueItem;
var npcReturnState = 0;
var npcActiveResult = -1;
var npcDialogue = [
  [`Welcome to SWISS CLINIC!`,`May we heal\nyour army?`,[`All done! Thank you for coming!`,`Well, thanks for coming anyway!`]],
  [], // to be implemented
  [`Hey, I'll trade ya (P1) for (P2)!`,`Whattaya\nsay?`,[`Pleasure doing business with you!`,`Well, that's a shame...`]]
];

/*
 * NPC types:
 * 0 - Nurse Swiss
 * 1 - Pokeball Seller
 * 2 - Trader
 * 3 - One-liner
 */

function renderNPC() {
  if ( npcTextDrawing ) {
    if ( npcData.type < 3 ) {
      var selected = npcDialogue[npcData.type][npcDialogueItem];
      if ( npcData.trade ) {
        selected = selected.replace("(P1)",names[npcData.trade[0]].toUpperCase());
        selected = selected.replace("(P2)",names[npcData.trade[1]].toUpperCase());
      }
      if ( npcActiveResult > -1 ) npcTextToDraw = selected[npcActiveResult];
      else npcTextToDraw = selected;
      if ( npcDialogueItem + 1 >= npcDialogue[npcData.type].length ) npcReturnState = 1;
      else npcReturnState = 0;
    } else {
      npcTextToDraw = npcData.dialogue;
      npcReturnState = 1;
    }
  }
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
      npcCharDrawn = 0;
      npcDialogueItem++;
    } else {
      mapInvincible = true;
      npcTextDrawing = false;
    }
  }
}
