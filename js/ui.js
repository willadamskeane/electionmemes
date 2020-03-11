var activeCandidate = 0;
var progressInterval;
var progress = 0;

function preload() {
  quoteFont = loadFont("fonts/chunkfive.otf");
}

function setup() {
  var myCanvas = createCanvas(1080, 1080);
  console.log(myCanvas);
  document.getElementById("defaultCanvas0").style.width = "100%";
  document.getElementById("defaultCanvas0").style.height = "auto";
  // document.getElementById('defaultCanvas0').style.display='none';
  myCanvas.parent("quote");
  textSize(60);
  stroke(5);
  strokeJoin(ROUND);
  textFont(quoteFont);
  textStyle(BOLD);
  fill(color(255, 255, 255));

  strokeWeight(10);
  noLoop();
  background(50);
}

function generateKeyPress(e) {
  // look for window.event in case event isn't passed in
  e = e || window.event;
  if (e.keyCode == 13) {
    document.getElementById("generate").click();
    return false;
  }
  return true;
}

function draw(candidateIndex, shouldGenerateCaption) {
  clear();
  // document.getElementById('defaultCanvas0').className='';
  // document.getElementById('defaultCanvas0').style.display='none';
  // setTimeout(function(){
  //       document.getElementById('defaultCanvas0').style.display='';
  //       document.getElementById('defaultCanvas0').className=' animated slideInDown';
  // },50);

  if (false && window.location.hash && candidateIndex == null) {
    if (window.location.hash.substr(1, 1) == "_") {
      var decodedData = JSON.parse(
        decodeURIComponent(atob(window.location.hash.substr(2)))
      );
      console.log("decoded data", decodedData);
      candidateIndex = decodedData.c;
      var candidateImageIndex = decodedData.i;
      var savedCaption = decodedData.t;
    } else {
      var candidateName = window.location.hash.substring(1);
      console.log(candidateName);
      for (var i = 0; i < candidates.length; i++) {
        if (
          candidateName.toLowerCase() == candidates[i].shortName.toLowerCase()
        ) {
          candidateIndex = i;
          break;
        }
      }
    }
  }

  if (candidateIndex == null) candidateIndex = 0;
  if (candidateIndex == -1)
    candidateIndex = Math.floor(Math.random() * candidates.length);

  var previousCandidate = candidates[activeCandidate];
  activeCandidate = candidateIndex;
  console.log(candidateIndex);
  var candidate = candidates[candidateIndex];
  document.body.className = candidate.party;
  document.getElementById("logo").src = "img/logo_" + candidate.party + ".png";

  if (previousCandidate != activeCandidate) {
    document.getElementById(previousCandidate.shortName).className = "";
  }

  // window.history.pushState("object or string", "Title", '#' + candidate.shortName);
  ga("send", {
    hitType: "event",
    eventAction: "generate",
    eventLabel: "Generated " + candidate.name
  });

  document.getElementById(candidate.shortName).className = "active";
  console.log(document.getElementById("candidate_" + candidateIndex));
  if (!candidateImageIndex)
    var candidateImageIndex = Math.floor(
      Math.random() * candidate.images.length
    );
  var candidateImage = candidate.images[candidateImageIndex];
  textAlign(candidateImage.textAlign == "left" ? LEFT : RIGHT);

  var prefix = document.getElementById("prefix").value;
  var bg = loadImage(
    "candidates/" + candidate.shortName + "/" + candidateImage.fileName,
    function() {
      tint(255, 255);
      image(bg, 0, 0);
      var watermark = loadImage("img/watermark.png", function() {
        tint(255, 127);
        image(watermark, candidateImage.watermarkX, candidateImage.watermarkY);
      });

      if (!shouldGenerateCaption) return;

      clearInterval(progressInterval);
      progress = 0;
      document.getElementById("progress").style.width = "0%";
      progressInterval = setInterval(function() {
        progress += 1;
        document.getElementById("progress").style.width = progress + "%";
      }, 180);

      generateCaption(candidate, prefix, function(caption) {
        // window.history.pushState("object or string", "Title", "/electionmemes/index.html#" + btoa(encodeURIComponent(caption)));

        progress = 0;
        document.getElementById("progress").style.width = "0%";
        clearInterval(progressInterval);

        //   if (savedCaption) caption = savedCaption;

        //   var encodedData = btoa(
        //     encodeURIComponent(
        //       JSON.stringify({
        //         c: candidateIndex,
        //         i: candidateImageIndex,
        //         t: caption
        //       })
        //     )
        //   );

        //   window.history.pushState(
        //     "object or string",
        //     "Title",
        //     "#_" + encodedData
        //   );

        //   console.log(encodedData);

        //   var decodedData = JSON.parse(decodeURIComponent(atob(encodedData)));

        //   console.log(decodedData);

        document.getElementById("defaultCanvas0").style.visibility = "";
        textSize(60);
        if (caption.length > 120) {
          var fontSize = 60 - (caption.length - 120) / 4;
          if (fontSize < 40) fontSize = 40;
          textSize(fontSize);
        }
        text(
          caption,
          candidateImage.captionX,
          candidateImage.captionY,
          candidateImage.captionWidth,
          candidateImage.captionHeight
        );
      });
    }
  );
  background(bg);
}
