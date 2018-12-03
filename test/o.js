var birdContainer = document.getElementById("bird-container"),
    birdWrap = document.getElementById("bird-wrapper"),
    bird = document.getElementById("bird"),
    birdPos,
    head = document.getElementById("head"),
    iris = document.getElementById("iris"),
    irisPos,
    iX,
    iY,
    iBot,
    iMid,
    mouseX,
    mouse,
    cX,
    cY,
    cH,
    cA,
    length,
    threshold;

// Intro Anim
function introAnim() {
  var tlIn = new TimelineMax();
  tlIn.to(birdWrap, 0, {xPercent: -100}, 0);
  tlIn.set(bird, {className: '+=bird-active'}, 0);
  tlIn.to(birdWrap, 3, {xPercent: 0, ease: Elastic.easeOut.config(1, 0.6)}, 0);
  tlIn.add(setBird, 2);
}

introAnim();

function setBird() {
  birdPos = bird.getBoundingClientRect();
  irisPos = iris.getBoundingClientRect();
  iBot = irisPos.height / 3.5;
  iMid = irisPos.height / 2;
}

// Exit Anim
function exitAnim() {
  var tlOut = new TimelineMax();
  tlOut.to(birdWrap, 0.4, {xPercent: -10, ease: Power2.easeOut}, 0);
  tlOut.to(birdWrap, 0.4, {xPercent: 100, ease: Power2.easeIn}, 0.3);
  tlOut.set(bird, {className: '-=bird-active'});
}

// Click for anim
birdContainer.addEventListener("mousedown", function( e ) {
  if (bird.classList.contains('bird-active')){
    exitAnim();
  }
  else {
    introAnim();
  }
});

// Bird flap
TweenMax.to(birdWrap, 0.5, {y: -20, yoyo: true, repeat: -1, ease: Power1.easeInOut});
TweenMax.to(birdWrap, 3, {x: -50, yoyo: true, repeat: -1, ease: Power1.easeInOut});
TweenMax.fromTo(birdWrap, 4, {rotation: -5, yoyo: true, repeat: -1, ease: Power1.easeInOut}, {rotation: 2, yoyo: true, repeat: -1, ease: Power1.easeInOut});

// Random eye movement
if (length > threshold) {
  length = threshold;
  cX = Math.cos(cH) * length;
  cY = Math.sin(cH) * length;

  cX = cX + irisPos.width / 4.5;
  if (cY < iBot) {
    cY = cY * 1.2;
  }
    cY = cY + irisPos.width / 4;
  }

  // Constrain iris bottom
  if (cY > iBot) {
    cY = iBot
  }

function eye() {
  cX = ((Math.random() < 0.5 ? -1 : 1) * (Math.random() *13));
  if (cX < -4) {
    cX = -4;
  }
  cY = (Math.random() < 0.5 ? -1 : 1) * 5;
  // Random eye move time
  var cT = Math.random() * 0.75
  // console.log('asdasd')
  TweenMax.to(iris, cT, {x: cX, y: cY, onComplete: eyeLoop, ease: Power2.easeOut});
  // console.log('ye')
 }
  
var eyeLoop = function () {
  var rand = Math.round(Math.random() * 500);
  setTimeout(function() {
    eye();
  }, rand);
};
  
eye();

// Mouse tracking for non-touch devices
if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  // Blink
  function blink() {
    TweenMax.to(head, 0.07, {rotation: 90, transformOrigin: 'center', yoyo: true, repeat: 1, onComplete: blinkLoop, ease: Power2.easeOut});
  }
  
  var blinkLoop = function () {
    var rand = Math.round(Math.random() * 3000);
    setTimeout(function() {
      blink();
    }, rand);
  };
  
  blink();
  
  // Mouse tracking
  birdContainer.addEventListener("mousemove", function( e ) {
    iX = irisPos.x + (irisPos.width / 2);
    iY = irisPos.y + (irisPos.height / 2);
    
    mouseX = e.pageX;
    mouseY = e.pageY;
    cX = (mouseX - iX ) / 2;
    cY = (mouseY - iY) / 2;

    cH = Math.atan2(cY, cX);
    cA = cH * 180 / Math.PI;
    length = Math.sqrt((cX * cX) + (cY * cY))
    threshold = irisPos.width / 1.5;
    
    // Bird mouse follow
    TweenMax.to(bird, 5, {x: cX, y: cY, ease: Elastic.easeOut.config(1, 0.6)})
    
    // Constrain iris movement
    if (length > threshold) {
      length = threshold;
      cX = Math.cos(cH) * length;
      cY = Math.sin(cH) * length;

      cX = cX + irisPos.width / 4.5;
      if (cY < iBot) {
        cY = cY * 1.2;
      }
      cY = cY + irisPos.width / 4;
    }
    
    // Constrain iris bottom
    if (cY > iBot) {
      cY = iBot;
    }
    
    // Move eye
    TweenMax.to(iris, 0.5, {x: cX, y: cY, ease: Power2.easeOut});
    
    // Rotate bird
    if (cX > -irisPos.width) {
      cA = cA / 5;
      TweenMax.to(bird, 1, {rotation: cA, ease: Power2.easeOut});
    }
    else {
      TweenMax.to(bird, 1, {rotation: 0, ease: Power4.easeOut});
    }
  });

  // Reset
  birdContainer.addEventListener("mouseleave", function( e ) {
    TweenMax.to(iris, 1, {x: 0, y: 0, ease: Elastic.easeOut.config(1, 0.6)});
    TweenMax.to(bird, 5, {x: 0, y: 0,rotation: 0, ease: Elastic.easeOut.config(1, 0.6)});
    eye();
  });
}
