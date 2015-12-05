var activeCandidate = 0;

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
      clear();
      // document.getElementById('defaultCanvas0').className='';
      // document.getElementById('defaultCanvas0').style.display='none';
      // setTimeout(function(){
      //       document.getElementById('defaultCanvas0').style.display='';
      //       document.getElementById('defaultCanvas0').className=' animated slideInDown';
      // },50);
            
      if (window.location.hash && candidateIndex == null) {
            var candidateName = window.location.hash.substring(1);
            console.log(candidateName);
            for (var i = 0; i < candidates.length; i++) {
                  if (candidateName.toLowerCase() == candidates[i].shortName.toLowerCase()) {

                        candidateIndex = i;
                        break;
                  }
            }
      }

      if (candidateIndex == null)
            candidateIndex = 0;
      // candidateIndex = Math.floor(Math.random() * candidates.length);

      var previousCandidate = candidates[activeCandidate];
      activeCandidate = candidateIndex;
      console.log(candidateIndex);
      var candidate = candidates[candidateIndex];
      document.body.className = candidate.party;
      document.getElementById('logo').src = 'img/logo_' + candidate.party + '.png';

      if (previousCandidate != activeCandidate) {
            document.getElementById(previousCandidate.shortName).className = '';
      }

      window.history.pushState("object or string", "Title", '#' + candidate.shortName);


      document.getElementById(candidate.shortName).className = 'active';
      console.log(document.getElementById('candidate_' + candidateIndex));
      var candidateImage = candidate.images[Math.floor(Math.random() * candidate.images.length)];
      textAlign((candidateImage.textAlign == 'left' ? LEFT : RIGHT));



      var bg = loadImage('candidates/' + candidate.shortName + '/' + candidateImage.fileName, function () {
            tint(255, 255);
            image(bg, 0, 0);
            var watermark = loadImage('img/watermark.png', function () {
                  tint(255, 127);
                  image(watermark, candidateImage.watermarkX, candidateImage.watermarkY);

            });
            generateCaption(candidate, function (caption) {
                  // window.history.pushState("object or string", "Title", "/electionmemes/index.html#" + btoa(encodeURIComponent(caption)));
                  console.log(candidateImage);
                  document.getElementById('defaultCanvas0').style.visibility = "";
                  textSize(60);
                  if (caption.length > 120) {
                        var fontSize = 60 - ((caption.length - 120) / 4);
                        if (fontSize < 40)
                              fontSize = 40;
                        textSize(fontSize);
                  }
                  text(caption, candidateImage.captionX, candidateImage.captionY, candidateImage.captionWidth, candidateImage.captionHeight);
            });
      });
      background(bg);
}

