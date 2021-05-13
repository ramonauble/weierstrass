$(document).ready(function() {
  //reference canvas & get/configure context for drawing
  const $weierCanv = $("#weierCanv");
  const weierCanvCtx = $weierCanv[0].getContext("2d");
  const wCanvW = weierCanv.width;
  const wCanvH = weierCanv.height;
  weierCanvCtx.fillStyle = "#5D2E7B";
  weierCanvCtx.lineWidth = .8;
  weierCanvCtx.strokeStyle = "#FFFFFF";
  weierCanvCtx.font = "30px monospace";
  weierCanvCtx.textAlign = "center";

  var weierCurve = [];
  var a = .69;
  var b = 7200;
  var locX;
  var max = 0;
  var samples = 2048.0;
  var xInc = wCanvW/samples;
  var xWidth = 16;

  var lastUpdate;
  var updateTime = 33.333333; //ms
  function drawCanvas(timestamp) {
    if (lastUpdate == undefined || (timestamp - lastUpdate) > updateTime) {
      lastUpdate = timestamp; //record latest update time
      for (let x = 0; x <= samples; x++) {
        locX = xWidth*(x/samples) - (xWidth/2); //normalize x to [-1, 1];
        weierCurve[x] = 0; //clear accumulator
        for (let n = 0; n < 8; n++) {
          weierCurve[x] += Math.pow(a, n) * Math.cos((b**n)*locX*Math.PI);
        }
        if (Math.abs(weierCurve[x]) > max) { //discern max for each frame
          max = Math.abs(weierCurve[x]);
        }
      }
      let wX = 0;
      let wY = 0;
      var xInc = wCanvW/samples;
      weierCanvCtx.beginPath();
      for (let c = 0; c <= samples; c++) {
        wY = wCanvH - (((weierCurve[c]/max) + 1)/2)*wCanvH;
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

  $("#aSlider").on("input", function() {
    let $this = $(this);
    a = $this.val();
  });
  $("#bSlider").on("input", function() {
    let $this = $(this);
    b = $this.val();
  });
  $("#xSlider").on("input", function() {
    let $this = $(this);
    xWidth = $this.val();
  });
  $("#depthSlider").on("input", function() {
    let $this = $(this);
    samples = $this.val();
  });
});
