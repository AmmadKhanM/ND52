
// gsap animate .hero-image video, .c-overlay, .brand-guidlines, .celebration-kit from to x 0 and opacity 1
const tl = gsap.timeline();
tl.to('.c-header', {
  duration: .75,
  y: 0,
  opacity: 1,
  ease: "ease-in",
})

// if has class .c-hero-section
if (document.querySelector('.c-hero-section')) {
  tl.to('.c-hero-section .left-column', {
    duration: .75,
    x: 0,
    opacity: 1,
    ease: "ease-in",
  }).to('.hero-image', {
    duration: .75,
    x: 0,
    opacity: 1,
    ease: "ease-in",
  }, '-=0.75s')
    .to('.brand-guidlines', {
      duration: .75,
      x: 0,
      opacity: 1,
      ease: "ease-in",
    }, '-=0.6s')
    .to('.celebration-kit', {
      duration: .75,
      x: 0,
      opacity: 1,
      ease: "ease-in",
    }, '-=0.7s')
    .to('.c-overlay', {
      duration: .75,
      x: 0,
      opacity: 1,
      ease: "ease-in",
    }, '-=0.5s');
} else if (document.querySelector('.c-experience-sec')) {
  tl.to('.c-experience-sec .init-frame .background', {
    duration: .75,
    opacity: 1,
    ease: "ease-in",
  }, '-=0.75s').to('.c-experience-sec .init-frame .if_content', {
    duration: .75,
    y: 0,
    opacity: 1,
    ease: "ease-in",
  }, '-=0.1s')
}
if (document.querySelector('.privacy-popup')) {
  tl.to('.privacy-popup', {
    duration: .5,
    y: 0,
    opacity: 1,
    ease: "ease-in",
  }, '-=0.2s')
}

// end tl animation if is mobile
if (window.innerWidth < 768) {
  // move timeline directly to end
  tl.progress(1).pause();
  // remove all inline styles
  tl.clear();
  gsap.set('.privacy-popup', {
    y: 0,
    xPercent: -50,
    opacity: 1,
  });


}

// sticky header
window.stickyHeader = function () {
  const headerSticky = document.querySelector('.js-header-sticky');
  const headerStickyPlaceholder = document.querySelector('.js-header-sticky-placeholder');
  headerStickyPlaceholder.style.height = headerSticky.offsetHeight + 'px';
  document.body.classList.add('has-sticky-header');

  // add this in css variables as well
  const headerStickyHeight = headerSticky.offsetHeight;
  document.documentElement.style.setProperty('--header-sticky-height', `${headerStickyHeight}px`);
}

stickyHeader();


// Check if the policy was already accepted
if (!localStorage.getItem('privacyPolicyAccepted')) {
  var privacyPopup = document.getElementById('privacy-popup');
  if (privacyPopup) {
    privacyPopup.style.display = 'block';
    // #not-allow click
    var notAllowButton = document.getElementById('not-allow');
    if (notAllowButton) {
      notAllowButton.addEventListener('click', declinePrivacyPolicy);
    }
    // #allow click
    var allowButton = document.getElementById('allow');
    if (allowButton) {
      allowButton.addEventListener('click', acceptPrivacyPolicy);
    }
  }
}

// .js-not-allow-policy click
document.querySelectorAll('.js-not-allow-policy').forEach(element => {
  element.addEventListener('click', declinePrivacyPolicy);
});



function acceptPrivacyPolicy() {
  // Save to localStorage
  localStorage.setItem('privacyPolicyAccepted', 'true');
  animatePrivacyPopupOut();
}

function declinePrivacyPolicy(e) {
  e.preventDefault();
  animatePrivacyPopupOut();
}

function animatePrivacyPopupOut() {
  gsap.to('#privacy-popup', {
    duration: .5,
    x: isRTL ? -100 : 100,
    opacity: 0,
    ease: "ease-in",
    onComplete: function () {
      document.getElementById('privacy-popup').style.display = 'none';
    }
  });
}
