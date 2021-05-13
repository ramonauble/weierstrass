$(document).ready(function() {
  //reference canvas & get/configure context for drawing
  const $weierCanv = $("#weierCanv");
  const weierCanvCtx = $weierCanv[0].getContext("2d");
  const wCanvW = weierCanv.width;
  const wCanvH = weierCanv.height;
  weierCanvCtx.fillStyle = "#5D2E7B";
  weierCanvCtx.lineWidth = 1;
  weierCanvCtx.strokeStyle = "#FFFFFF";
  weierCanvCtx.font = "30px monospace";
  weierCanvCtx.textAlign = "center";

  var weierCurve = [];
  var a = .24;
  var b = 2400;
  var locX;
  var max = 0;
  var xInc = wCanvW/2048.0;

  var lastUpdate;
  var updateTime = 33.333333; //ms
  function drawCanvas(timestamp) {
    if (lastUpdate == undefined || (timestamp - lastUpdate) > updateTime) {
      lastUpdate = timestamp; //record latest update time
      for (let x = 0; x < 2048; x++) {
        locX = 2*(x/2047) - 1; //normalize x to [-1, 1];
        weierCurve[x] = 0; //clear accumulator
        for (let n = 0; n < 16; n++) {
          weierCurve[x] += Math.pow(a, n) * Math.cos((b**n)*locX*Math.PI);
        }
        if (Math.abs(weierCurve[x]) > max) { //discern max for each frame
          max = Math.abs(weierCurve[x]);
        }
      }
      let wX = 0;
      let wY = 0;
      weierCanvCtx.beginPath();
      for (let c = 0; c < 2047; c++) {
        wY = (((weierCurve[c]/max) + 1)/2)*wCanvH;
        if (c == 0) {
          weierCanvCtx.moveTo(wX, wY);
        } else {
          weierCanvCtx.lineTo(wX, wY);
        }
        wX += xInc;
      }
      weierCanvCtx.fillRect(0, 0, wCanvW, wCanvH); //clear canvas
      weierCanvCtx.stroke();
      //console.log(wX + ", " + wY);
    }
    window.requestAnimationFrame(drawCanvas);
  }
  window.requestAnimationFrame(drawCanvas);
});
