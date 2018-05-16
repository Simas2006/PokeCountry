var npcData;
var npcTextToDraw;
var npcCharDrawn = 0;
var npcTextDrawing = false;
var npcFlashingToggle = 0;
var npcDialogueItem;
var npcReturnState = 0;
var npcActiveResult = 0;
var npcHexaballType = 0;
var npcHexaballCount = 0;
var npcDialogue = [
  [`Welcome to SWISS CLINIC!`,`May we heal\nyour army?`,[`Well, thanks for coming anyway!`,`..........`],`All done! Thank you for coming!`],
  [`Welcome to SWISS CLINIC!`,`Do you want\na hexaball?`,[`Well, thanks for coming anyway!`,"What kind?"],`How many?`,`something something`],
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
      if ( selected instanceof Array ) npcTextToDraw = selected[npcActiveResult + 1];
      else npcTextToDraw = selected;
      if ( npcData.type == 1 && (npcDialogueItem == 2 || npcDialogueItem == 3) ) {
        var price = [2,4,6][npcHexaballType] * [1,3,6][npcHexaballCount];
        npcTextToDraw += `\n(${price}BP for ${[1,3,6][npcHexaballCount]})`;
      }
      if ( npcDialogueItem + 1 >= npcDialogue[npcData.type].length || npcActiveResult == -1 ) npcReturnState = 1;
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
    if ( npcDialogueItem == 1 || ((npcDialogueItem == 2 || npcDialogueItem == 3) && npcData.type == 1 && npcReturnState == 0) ) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = "black";
      drawRoundedRect(10,canvas.width * 0.6,canvas.height * 0.75 + 10,canvas.width * 0.4 - 5,canvas.height * 0.25 - 20);
      ctx.stroke();
      ctx.save();
      ctx.clip();
      ctx.lineWidth = 10;
      if ( npcDialogueItem == 1 ) {
        ctx.strokeStyle = npcActiveResult == 0 ? "gold" : "green";
        ctx.fillStyle = npcActiveResult == 0 ? "#fff1b3" : "#99ff99";
        ctx.fillRect(canvas.width * 0.6 + 1,canvas.height * 0.75 + 10,canvas.width * 0.2 - 5,canvas.height * 0.25 - 20);
        ctx.strokeRect(canvas.width * 0.6 + 1,canvas.height * 0.75 + 10,canvas.width * 0.2 - 5,canvas.height * 0.25 - 20);
        ctx.strokeStyle = npcActiveResult == -1 ? "gold" : "red";
        ctx.fillStyle = npcActiveResult == -1 ? "#fff1b3" : "#ff9999";
        ctx.fillRect(canvas.width * 0.8 - 1,canvas.height * 0.75 + 10,canvas.width * 0.2 - 5,canvas.height * 0.25 - 20);
        ctx.strokeRect(canvas.width * 0.8 - 1,canvas.height * 0.75 + 10,canvas.width * 0.2 - 5,canvas.height * 0.25 - 20);
        ctx.font = canvas.height * 0.06 + "px Menlo";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillText("YES",canvas.width * 0.7 - 1,canvas.height * 0.875);
        ctx.fillText("NO",canvas.width * 0.9 - 4,canvas.height * 0.875);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.8 - 3,canvas.height * 0.75 + 10);
        ctx.lineTo(canvas.width * 0.8 - 3,canvas.height - 10);
        ctx.stroke();
      } else {
        var int = npcDialogueItem == 2 ? npcHexaballType : npcHexaballCount;
        ctx.strokeStyle = int == 0 ? "gold" : "red";
        ctx.fillStyle = int == 0 ? "#fff1b3" : "#ff9999";
        ctx.fillRect(canvas.width * 0.6 + 1,canvas.height * 0.75 + 10,canvas.width * 0.4 - 5,canvas.height * 0.125 - 12);
        ctx.strokeRect(canvas.width * 0.6 + 1,canvas.height * 0.75 + 10,canvas.width * 0.4 - 5,canvas.height * 0.125 - 12);
        ctx.strokeStyle = int == 1 ? "gold" : "green";
        ctx.fillStyle = int == 1 ? "#fff1b3" : "#99ff99";
        ctx.fillRect(canvas.width * 0.6 + 1,canvas.height * 0.875 + 2,canvas.width * 0.2 - 6,canvas.height * 0.125 - 13);
        ctx.strokeRect(canvas.width * 0.6 + 1,canvas.height * 0.875 + 2,canvas.width * 0.2 - 6,canvas.height * 0.125 - 13);
        ctx.strokeStyle = int == 2 ? "gold" : "blue";
        ctx.fillStyle = int == 2 ? "#fff1b3" : "#9999ff";
        ctx.fillRect(canvas.width * 0.8,canvas.height * 0.875 + 2,canvas.width * 0.2 - 4,canvas.height * 0.125 - 13);
        ctx.strokeRect(canvas.width * 0.8,canvas.height * 0.875 + 2,canvas.width * 0.2 - 4,canvas.height * 0.125 - 13);
        ctx.font = canvas.height * 0.06 + "px Menlo";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillText(npcDialogueItem == 2 ? "HEXABALL" : "1",canvas.width * 0.8 - 3,canvas.height * 0.8425 - 4);
        ctx.font = canvas.height * 0.05 + "px Menlo";
        ctx.fillText(npcDialogueItem == 2 ? "ULTRA" : "6",canvas.width * 0.9 - 3,canvas.height * 0.9625 - 10);
        ctx.fillText(npcDialogueItem == 2 ? "MASTER" : "3",canvas.width * 0.7 - 1,canvas.height * 0.9625 - 10);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.6,canvas.height * 0.875);
        ctx.lineTo(canvas.width - 4,canvas.height * 0.875);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.8 - 3,canvas.height * 0.875);
        ctx.lineTo(canvas.width * 0.8 - 3,canvas.height - 1);
        ctx.stroke();
      }
      ctx.restore();
      ctx.lineWidth = 2;
    }
    npcFlashingToggle += 0.025;
    if ( npcFlashingToggle >= 2 ) npcFlashingToggle = 0;
  }
}

function handleKeyboardNPC(key) {
  if ( key == "ArrowDown" && npcDialogueItem != 1 && ! ((npcDialogueItem == 2 || npcDialogueItem == 3) && npcData.type == 1) ) {
    if ( npcReturnState == 0 ) {
      npcCharDrawn = 0;
      npcDialogueItem++;
    } else {
      mapInvincible = true;
      npcTextDrawing = false;
    }
  }
  if ( npcDialogueItem == 1 ) {
    if ( key == "ArrowLeft" || key == "ArrowRight" ) {
      npcActiveResult = npcActiveResult == 0 ? -1 : 0;
    } else if ( key == " " ) {
      npcCharDrawn = 0;
      npcDialogueItem++;
    }
  } else if ( npcDialogueItem == 2 && npcData.type == 1 ) {
    if ( key == "ArrowUp" || key == "ArrowDown" ) {
      npcHexaballType = [1,0,0][npcHexaballType];
    } else if ( key == "ArrowLeft" || key == "ArrowRight" ) {
      npcHexaballType = [0,2,1][npcHexaballType];
    } else if ( key == " " ) {
      npcCharDrawn = 0;
      npcDialogueItem++;
    }
  } else if ( npcDialogueItem == 3 && npcData.type == 1 ) {
    if ( key == "ArrowUp" || key == "ArrowDown" ) {
      npcHexaballCount = [1,0,0][npcHexaballCount];
    } else if ( key == "ArrowLeft" || key == "ArrowRight" ) {
      npcHexaballCount = [0,2,1][npcHexaballCount];
    } else if ( key == " " ) {
      npcCharDrawn = 0;
      npcDialogueItem++;
    }
  }
}
