// vanila js version of $(document).ready(function () { bloew
const playerv = new Plyr('.c-popup-video #player', {
  controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
  fullscreen: false,
});

playerv.color = '#ff69b4';
let currentVideoId = null;

// Function to extract YouTube video ID from URL
function getYoutubeVideoId(url) {
  var regExp = /^.*(youtu\.be\/|live\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return null;
  }
}

// Event listener for opening video popups
$('.js-open-video-popup').on('click', function (e) {
  e.preventDefault();

  // Extract video ID from the href of the clicked link
  var videoUrl = $(this).attr('href');
  var videoId = getYoutubeVideoId(videoUrl);

  // set .popup-content-box to opacity 0, gsap
  gsap.set('.popup-content-box', {
    opacity: 0,
  });

  if (videoId && videoId !== currentVideoId) {
    // Update the data-plyr-embed-id attribute with the new video ID
    $('#player').attr('data-plyr-embed-id', videoId);

    // Reinitialize Plyr with the new video
    playerv.source = {
      type: 'video',
      sources: [{
        src: videoId,
        provider: 'youtube',
      }],
    };

    // Update the currentVideoId
    currentVideoId = videoId;

    // Add class to body and play the video
    $('body').addClass('video-popup-is-open');

    // on playerv ready
    playerv.on('ready', event => {
      // animate .popup-content-box to opacity 1, gsap
      gsap.to('.popup-content-box', {
        duration: .5,
        opacity: 1,
        ease: "ease-in",
      });
      // play plyr video
      playerv.play();
    });
  } else {
    // animate .popup-content-box to opacity 1, gsap
    gsap.to('.popup-content-box', {
      duration: .5,
      opacity: 1,
      ease: "ease-in",
    });
    playerv.play();
  }
});


// .js-close-video-popup
$('.c-popup-video .js-close-video-popup').on('click', function (e) {
  e.preventDefault();
  $('body').removeClass('video-popup-is-open');
  // pause plyr video
  playerv.pause();
});
const player = new Plyr('#player');
player.color = '#ff69b4';

// .js-open-video-popup
$('.js-open-video-popup').on('click', function (e) {
  e.preventDefault();
  $('body').addClass('video-popup-is-open');
  // play plyr video
  player.play();
});


// Initialize all video tags with .is-plyr class as plyr video
const plyrVideos = document.querySelectorAll('.is-plyr');
// Create a map to keep track of Plyr instances by the video element
const plyrInstances = new Map();

plyrVideos.forEach(video => {
  // Initialize Plyr for each video and store the instance in the map
  const player = new Plyr(video, {
    controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
    settings: [],
    fullscreen: false
  });
  player.color = '#ff69b4';
  plyrInstances.set(video, player);
  let isSeeking = false;
  player.on('seeking', event => {
    isSeeking = true;
  });
  player.on('seeked', event => {
    isSeeking = false;
  });
  // if the plyr has a init-frame class as parent then on pasuing it performe action
  player.on('pause', event => {
    if (isSeeking) {
      return;
    }
    // Find the closest parent with the 'init-frame' class and then find the video inside it
    const initFrame = $(event.target).closest('.init-frame');
    const videoInInitFrame = initFrame.find('.is-plyr').get(0);

    // Retrieve the Plyr instance from the map using the video element
    const player = plyrInstances.get(videoInInitFrame);

    // If the player instance exists
    if (player) {
      // gsap animate the .if_content from init-frame back into view
      const tl = gsap.timeline();

      initFrame.removeClass('is--video-playing');
      tl.to('.c-header', {
        duration: .5,
        translateY: '0%',
        ease: "ease-in",
        onComplete: function () {
          // remove class .is--video-playing from init-frame
        }
      })
        // animate .c-header back into view
        .to('.if_content', {
          duration: .5,
          opacity: 1,
          ease: "ease-in"
        }, '-=0.15s')
    }
  });
});

// Play video when .js-play-exp-init-frame-video is clicked
$('.js-play-exp-init-frame-video').on('click', function (e) {
  e.preventDefault();
  // Find the closest parent with the 'init-frame' class and then find the video inside it
  const initFrame = $(this).closest('.init-frame');
  const videoInInitFrame = initFrame.find('.is-plyr').get(0);

  // Retrieve the Plyr instance from the map using the video element
  const player = plyrInstances.get(videoInInitFrame);

  // gsap animate the .if_content from init-frame out of view
  const tl = gsap.timeline();
  tl.to('.if_content', {
    duration: .5,
    opacity: 0,
    ease: "ease-in"
  })
    // animate .c-header out of view
    .to('.c-header', {
      duration: .5,
      translateY: '-100%',
      ease: "ease-in",
      onComplete: function () {
        // add class .is--video-playing to init-frame
        initFrame.addClass('is--video-playing');
      }
    }, '-=0.15s')

  // If the player instance exists, play the video
  if (player) {
    player.play();
  }
});

$(".tab-select").selectize({
  // on change
  onChange: function (value) {
    // click on relative data-tab-id
    document.querySelector(`[data-tab-id="${value}"]`).click();
  },
  lock: true,
  create: false,
  maxItems: 1,
  openOnFocus: false,
});


let input = document.querySelector("#phone");
let dialCode = "+971 ";

let iti = window.intlTelInput(input, {
  separateDialCode: false,
  initialCountry: "ae",
  autoPlaceholder: "aggressive",
  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js"
});
iti.setNumber(dialCode);

input.addEventListener("countrychange", function () {
  let dialCodeNew = iti.getSelectedCountryData()['dialCode'];
  // keep revious number but update initial code
  // check if has old code
  if (input.value.indexOf(dialCode) > -1) {
    input.value = input.value.replace(dialCode, '+' + dialCodeNew + ' ');
  } else {
    input.value = '+' + dialCodeNew + ' ';
  }
  dialCode = dialCodeNew;
});