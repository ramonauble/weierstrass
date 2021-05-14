$(document).ready(function() {
  //reference canvas & get/configure context for drawing
  const $weierCanv = $("#weierCanv");
  const weierCanvCtx = $weierCanv[0].getContext("2d");
  const wCanvW = weierCanv.width;
  const wCanvH = weierCanv.height;
  weierCanvCtx.fillStyle = "#5D2E7B";
  weierCanvCtx.lineWidth = 1;
  weierCanvCtx.strokeStyle = "#c8a4de";
  weierCanvCtx.font = "30px monospace";
  weierCanvCtx.textAlign = "center";

  var weierCurve = [];
  var aBase = .69;
  var aMod = 0;
  var prevMod = 0;
  var prevMod2 = 0;
  var modBase = .025;
  var b = 8;
  var locX;
  var max = 0;
  var samples = 1920.0;
  var xInc = wCanvW/samples;
  var xWidth = 2;

  var lastUpdate;
  var updateTime = 16.66667; //ms
  function drawCanvas(timestamp) {
    if (lastUpdate == undefined || (timestamp - lastUpdate) > updateTime) {
      lastUpdate = timestamp; //record latest update time
      prevMod2 = prevMod;
      prevMod = aMod;
      aMod = (modBase*Math.random()) - modBase/2; //random bipolar modulation between [-30,30]
      for (let x = 0; x <= samples; x++) {
        locX = xWidth*(x/samples) - (xWidth/2); //normalize x to [-1, 1];
        weierCurve[x] = 0; //clear accumulator
        for (let n = 0; n < 8; n++) {
          weierCurve[x] += Math.pow((aBase + (aMod + prevMod + prevMod2)/3), n) * Math.cos((b**n)*locX*Math.PI);
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
        weierCanvCtx.moveTo(wX, wCanvH);
        weierCanvCtx.lineTo(wX, wY);
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
    aBase = parseFloat($this.val());
  });
  $("#bSlider").on("input", function() {
    let $this = $(this);
    b = parseFloat($this.val());
  });
  $("#xSlider").on("input", function() {
    let $this = $(this);
    xWidth = parseFloat($this.val());
  });
  $("#depthSlider").on("input", function() {
    let $this = $(this);
    samples = parseFloat($this.val());
  });
  $(document).keydown(function(event) {
    if (event.which == 39) { //right arrow - zoom out
      xWidth += xWidth/32.0;
    } else if (event.which == 37) { //left arrow - soom in
      xWidth -= xWidth/32.0;
    }
  });
});
