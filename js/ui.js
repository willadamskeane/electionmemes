function preload() {
      quoteFont = loadFont('fonts/chunkfive.otf');
}

function setup() {
      var myCanvas = createCanvas(1080, 1080);
      console.log(myCanvas);
      document.getElementById('defaultCanvas0').style.width = "100%";
      document.getElementById('defaultCanvas0').style.height = "auto";
      // document.getElementById('defaultCanvas0').style.display='none';
      myCanvas.parent('quote');
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

function draw(candidateIndex) {
      // document.getElementById('defaultCanvas0').className='';
      // document.getElementById('defaultCanvas0').style.display='none';
      // setTimeout(function(){
      //       document.getElementById('defaultCanvas0').style.display='';
      //       document.getElementById('defaultCanvas0').className=' animated slideInDown';
      // },50);
      if (candidateIndex==null)
            candidateIndex = Math.floor(Math.random() * candidates.length);
      console.log(candidateIndex);
      var candidate = candidates[candidateIndex];
      document.body.className=candidate.party;
      document.getElementById('logo').src = 'img/logo_'+candidate.party+'.png';
      var candidateImage = candidate.images[Math.floor(Math.random() * candidate.images.length)];
      textAlign((candidateImage.textAlign == 'left' ? LEFT : RIGHT));
      var bg = loadImage('candidates/' + candidate.shortName + '/' + candidateImage.fileName, function () {
            image(bg, 0, 0);
            generateCaption(candidate, function (caption) {
                  // window.history.pushState("object or string", "Title", "/electionmemes/index.html#" + btoa(encodeURIComponent(caption)));
                  console.log(candidateImage);
                  document.getElementById('defaultCanvas0').style.visibility = "";
                  textSize(60);
                  if (caption.length > 120) {
                        textSize(60 - ((caption.length - 120)/4));
                  }
                  text(caption, candidateImage.captionX, candidateImage.captionY, candidateImage.captionWidth, candidateImage.captionHeight);
            });
      });
      background(bg);
}

