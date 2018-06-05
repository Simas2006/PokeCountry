var titleMode = 0;

function renderTitle() {
  ctx.globalAlpha = 1;
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  var image = document.getElementById("image");
  ctx.drawImage(image,0,0,canvas.width,canvas.height);
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#000099";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}
