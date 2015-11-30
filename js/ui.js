function setup() {
      var myCanvas = createCanvas(1080, 1080);
      console.log(myCanvas);
      document.getElementById('defaultCanvas0').style.width = "100%";
      document.getElementById('defaultCanvas0').style.height = "auto";
      // document.getElementById('defaultCanvas0').style.display='none';
      myCanvas.parent('quote');
      textSize(50);
       stroke(5);
       strokeJoin(ROUND);
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
      if (!candidateIndex)
            candidateIndex = Math.floor(Math.random() * candidates.length);
      console.log(candidateIndex);
      var candidate = candidates[candidateIndex];
      var candidateImage = candidate.images[Math.floor(Math.random() * candidate.images.length)];
      textAlign((candidateImage.textAlign == 'left' ? LEFT : RIGHT));
      var bg = loadImage('candidates/' + candidate.shortName + '/' + candidateImage.fileName, function () {
            image(bg, 0, 0);
            generateCaption(candidate, function (caption) {
                  console.log(candidateImage);
                        document.getElementById('defaultCanvas0').style.visibility = "";
                  text(caption, candidateImage.captionX, candidateImage.captionY, candidateImage.captionWidth, candidateImage.captionHeight);
            });
      });
      background(bg);
}

