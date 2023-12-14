// if html has dir=rtl then isRTL variable should be true
var isRTL = false;

if (document.documentElement.dir == 'rtl') {
    isRTL = true;
}

var currentFrameIndex = 0;
var audioPlaying = 0;
var audioSelector = ['#audio-0', '#audio-1', '#audio-2', '#audio-0', '#audio-1', '#audio-2'];
let enableExPScroll = false;
let expPageAutoAudioPlayed = false;

// remove all audio tags if this is iOS device
if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
    const audioTags = document.querySelectorAll('audio');
    audioTags.forEach(audio => {
        audio.remove();
    });
    // remove .audio-icon-sec as well
    const audioIconSec = document.querySelector('.audio-icon-sec');
    if (audioIconSec) {
        audioIconSec.remove();
    }
}

// on js-start-exp-btn click
const startExpBtn = document.querySelector('.js-start-exp-btn');
if (startExpBtn) {
    startExpBtn.addEventListener('click', function (e) {
        e.preventDefault();
        enableExPScroll = true;

        // create a timeline
        const tl = gsap.timeline();

        // animate .init-frame out of view with gsap
        tl.to('.init-frame', {
            duration: 1,
            opacity: 0,
            ease: "ease-in",
            onComplete: function () {
                // remove .init-frame
                document.querySelector('.init-frame').remove();
                // add class .is--active-frame-0 to html
                document.querySelector('html').classList.add('is--active-frame-0');
            }
        })
            // keep the .frame.frame--0 .c-title-5 & .mouse-icon animation in
            .to('.frame.frame--0 .c-title-5', {
                duration: 1,
                opacity: 1,
                y: 0,
                ease: "ease-in",
            }, '-=0.5s')
            // deco-1, deco-2, deco-3
            .to('.frame.frame--0 .deco-1', {
                duration: 0.5,
                opacity: 1,
                x: 0,
                ease: "ease-in",
            }, '-=.4s')
            .to('.frame.frame--0 .deco-2', {
                duration: 0.6,
                x: 0,
                opacity: 1,
                ease: "ease-in",
            }, '-=0.4s')
            .to('.frame.frame--0 .deco-3', {
                duration: 0.7,
                x: 0,
                opacity: 1,
                ease: "ease-in",
            }, '-=0.6s')
            .to('.frame.frame--0 .mouse-icon', {
                duration: 0.5,
                opacity: 1,
                y: 0,
                ease: "ease-in",
            }, '-=1.5s')
            // keep the .frame.frame--0 .c-title-5 & .mouse-icon init state
            .set('.frame.frame--0 .c-title-5', {
                opacity: 0,
                y: '-20px',
            }, 0)
            .set('.frame.frame--0 .deco-1', {
                x: '-20px',
                opacity: 0,
            }, 0)
            .set('.frame.frame--0 .deco-2', {
                x: '-30px',
                opacity: 0,
            }, 0)
            .set('.frame.frame--0 .deco-3', {
                x: '20px',
                opacity: 0,
            }, 0)
            .set('.frame.frame--0 .mouse-icon', {
                opacity: 0,
                y: '20px',
            }, 0);
    });
}

// on .js-menu-toggle click add/remove .js-menu-open class to body
const menuToggle = document.querySelector('.js-menu-toggle');
const navLinks = document.querySelectorAll('.nav ul li a');

menuToggle.addEventListener('click', function () {
    document.body.classList.toggle('menu-is-open');
});

navLinks.forEach(link => {
    // Ensure the contact us link is excluded from this click listener
    // if (!link.classList.contains('js-open-contact')) {
    link.addEventListener('click', () => {
        if (document.body.classList.contains('menu-is-open')) {
            document.body.classList.remove('menu-is-open');
        }
    });
    // }
});

window.addEventListener('load', function () {

    // add .past-critical-state to html tag
    document.querySelector('html').classList.add('past-critical-state');

    // ==============================
    // Marquee

    var marquee = document.getElementById("marquee");
    // if marquee exists
    if (marquee) {
        var speed = 1;  // Speed of the animation.
        var inc = 1;  // Increment (px per frame).

        setInterval(function () {
            var bgPos = window.getComputedStyle(marquee, null)
                .getPropertyValue("background-position").split(' ')[0];
            var newPos = parseInt(bgPos) + (isRTL ? -inc : inc);
            marquee.style.backgroundPosition = newPos + "px 0px";
        }, 30 / speed);
    }

    // Marquee - end
    // ==============================

    // ==============================
    // tabs
    var tabLinks = document.querySelectorAll('.tab-links a');
    for (var i = 0; i < tabLinks.length; i++) {
        var tabLink = tabLinks[i];
        tabLink.addEventListener('click', function (event) {
            event.preventDefault();

            // Get the unique identifier for this tab section
            var tabName = this.dataset.tabName;

            // Select only the tab links and content areas within the same tab section
            var tabLinksInSet = document.querySelectorAll('.tab-links a[data-tab-name="' + tabName + '"]');
            var contentAreas = document.querySelectorAll('.tab-content-area[data-tab-name="' + tabName + '"]');

            // Remove 'active' class from all tab links within the same set
            for (var i = 0; i < tabLinksInSet.length; i++) {
                tabLinksInSet[i].classList.remove('active');
            }

            // Add 'active' class to this tab link
            this.classList.add('active');

            // Get tabID of clicked tab
            var tabID = this.dataset.tabId;

            // Remove 'active' class from all tab content areas within the same set
            for (var i = 0; i < contentAreas.length; i++) {
                contentAreas[i].classList.remove('active');
            }

            // Find content area that matches tabID and add 'active' class
            var contentArea = document.querySelector('.tab-content-area[data-tab-id="' + tabID + '"][data-tab-name="' + tabName + '"]');
            if (contentArea) {
                contentArea.classList.add('active');
            }
        });
    }
    // tabs - end
    // ==============================


    const accordionTitles = Array.from(document.querySelectorAll('.accordion-title'))
    accordionTitles.forEach(title => {
        title.addEventListener('click', () => {
            const content = title.nextElementSibling;
            title.parentElement.classList.toggle('active');

            if (title.parentElement.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = 0;
            }
        });
    });

    // click first accordion-title in each .js-is-accordion -- removing cause tabs have display none.
    // const accordionGroups = Array.from(document.querySelectorAll('.js-is-accordion'));
    // accordionGroups.forEach(group => {
    //     const firstTitle = group.querySelector('.accordion-title');
    //     firstTitle.click();
    // });
});

function vhHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
vhHeight();

// on width resize only re-trigger vhHeight()
let windWidthInit = window.innerWidth;
window.addEventListener('resize', function () {
    if (windWidthInit != window.innerWidth) {
        vhHeight();
        windWidthInit = window.innerWidth;
    }
});
//color change header active:link

function toSoftLink(href) {
    // GSAP fade out animation
    gsap.to('body', {
        duration: 0.75, // Duration of the fade out
        opacity: 0,
        pointerEvents: 'none',
        onComplete: () => {
            // Redirect to the link after the animation
            window.location.href = href;
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    // ==============================
    // Select all elements with the class '.js-soft-link-click'
    const softLinks = document.querySelectorAll('.js-soft-link-click');

    softLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            // Prevent the default link behavior
            event.preventDefault();

            // Get the href attribute
            const href = this.getAttribute('href');

            toSoftLink(href);
        });
    });
    // ==============================

    // add space '\xA0' before last word in .c-title-5
    // const contentTags = document.querySelectorAll('h1, h2, h2 span, h3, h4, h5, p');
    // contentTags.forEach(title => {
    //     // not if it has a span tag in the end
    //     if (title.lastElementChild && title.lastElementChild.tagName == 'SPAN') {
    //         return;
    //     }

    //     if (title) {
    //         const titleText = title.textContent;
    //         // Trim the text to remove any trailing white spaces
    //         const trimmedTitleText = titleText.trim();
    //         // Split the trimmed text by space
    //         const titleTextArray = trimmedTitleText.split(' ');
    //         // Replace the space before the last word with a non-breaking space
    //         titleTextArray[titleTextArray.length - 2] += '\xA0';
    //         // Remove the last word and join the array back into a string
    //         const lastWord = titleTextArray.pop();
    //         title.textContent = titleTextArray.join(' ') + lastWord;
    //     }
    // });

    // Get the "What's On" link element
    const whatsOnLink = document.querySelector('[href="#whatson"]');
    // Get the "How to Participate" link element
    const participateLink = document.querySelector('[href="#howtoparticipate"]');

    // Get the "About Us" link element
    const aboutUsLink = document.querySelector('[data-scroll-target="about-us-link"]');
    // // Get the "About Us" section
    const aboutUsSection = document.getElementById("about-us");

    // Get the "What's On" section
    const whatsOnSection = document.getElementById("whatson");
    // Get the "How to Participate" section
    const participateSection = document.getElementById("howtoparticipate");


    function handleAboutUsScroll() {
        // if (aboutUsSection) {
        //     const scrollThresholdStart = aboutUsSection.offsetTop;
        //     const scrollThresholdEnd = scrollThresholdStart + aboutUsSection.clientHeight; // Compute the end of "About Us" section

        //     if (window.scrollY >= scrollThresholdStart && window.scrollY < scrollThresholdEnd) { // window.scrollY should be between start and end of "About Us" section
        //         const colorVariable = getComputedStyle(document.documentElement).getPropertyValue('--secondary-pressed');
        //         aboutUsLink.style.color = colorVariable;
        //     } else {
        //         const colorVariable = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
        //         aboutUsLink.style.color = "";
        //     }
        // }
    }


    // Function to handle the link click event for the "About Us" link
    function handleAboutUsClick(event) {
        event.preventDefault(); // Prevent the default link behavior

        // Get the URL from the "data-scroll" attribute of the link
        const aboutUsPageURL = aboutUsLink.getAttribute('href');

        // Redirect the user to the "About Us" page
        window.location.href = aboutUsPageURL;
    }

    // Add click event listener for the "About Us" link
    if (aboutUsLink) {
        aboutUsLink.addEventListener("click", handleAboutUsClick); // Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')
    }

    // Add scroll event listeners for the "About Us" link
    window.addEventListener("scroll", handleAboutUsScroll);

    // Function to handle the scroll event for the "What's On" link
    function handleWhatsOnScroll() {
        if (whatsOnSection && whatsOnLink) {
            const scrollThreshold = whatsOnSection.offsetTop;
            if (window.scrollY >= scrollThreshold) {
                // Access the custom property value --secondary-pressed
                const colorVariable = getComputedStyle(document.documentElement).getPropertyValue('--secondary-pressed');
                whatsOnLink.style.color = colorVariable;
            } else {
                whatsOnLink.style.color = "";
            }
            if (window.scrollY >= scrollThreshold + (whatsOnSection.clientHeight || 0)) {
                whatsOnLink.style.color = "";
            }
        }
    }

    // Function to handle the scroll event for the "How to Participate" link
    function handleParticipateScroll() {
        if (participateSection && participateLink) {
            const scrollThreshold = participateSection.offsetTop;
            if (scrollThreshold) {
                if (window.scrollY >= scrollThreshold) {
                    const colorVariable = getComputedStyle(document.documentElement).getPropertyValue('--secondary-pressed');
                    participateLink.style.color = colorVariable;
                } else {
                    participateLink.style.color = "";
                }
                if (window.scrollY >= scrollThreshold + (participateSection.clientHeight || 0)) {
                    participateLink.style.color = "";
                }
            }
        }
    }

    // Function to handle the link click event for the "What's On" link
    function handleWhatsOnClick(event) {
        event.preventDefault();
        // Access the custom property value --secondary-pressed
        const colorVariable = getComputedStyle(document.documentElement).getPropertyValue('--secondary-pressed');
        whatsOnLink ? whatsOnLink.style.color = colorVariable : '';
        if (whatsOnSection) {
            const offsetTop = whatsOnSection.offsetTop;
            if (offsetTop) {
                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth"
                });
            }
        }
    }

    // Function to handle the link click event for the "How to Participate" link
    function handleParticipateClick(event) {
        event.preventDefault();
        // Access the custom property value --secondary-pressed
        const colorVariable = getComputedStyle(document.documentElement).getPropertyValue('--secondary-pressed');
        participateLink.style.color = colorVariable;
        if (participateSection) {
            const offsetTop = participateSection.offsetTop;
            if (offsetTop) {
                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth"
                });
            }
        }
    }

    // Add scroll event listeners for both links
    window.addEventListener("scroll", handleWhatsOnScroll);
    window.addEventListener("scroll", handleParticipateScroll);

    // Add click event listeners for both links
    whatsOnLink && whatsOnLink.addEventListener("click", handleWhatsOnClick);
    participateLink && participateLink.addEventListener("click", handleParticipateClick);
});






//slick-slide-wrapper transition fadein
document.addEventListener("DOMContentLoaded", function () {
    const slideItems = document.querySelectorAll(".slide-item");
    let currentIndex = 0; // Set the initial index to 0

    // Determine the layout direction based on the 'dir' attribute of the HTML document
    const isRTL = document.documentElement.getAttribute("dir") === "rtl";

    if (isRTL) {
        currentIndex = slideItems.length - 1; // Set the initial index to the last slide for RTL (Arabic)
    }

    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.2 // Adjust this threshold as needed
    };

    const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    const slide = slideItems[currentIndex];
                    if (slide) {
                        slide.style.opacity = 1;
                        slide.style.transform = 'translateX(0)';

                        if (isRTL) {
                            currentIndex--;
                        } else {
                            currentIndex++;
                        }

                        observer.unobserve(entry.target);

                        if ((isRTL && currentIndex >= 0) || (!isRTL && currentIndex < slideItems.length)) {
                            setTimeout(() => {
                                observer.observe(slideItems[currentIndex]);
                            }, 300); // Adjust the delay as needed
                        }
                    }
                }, 300); // Adjust the initial delay as needed
            }
        });
    }, options);
    if (slideItems && slideItems.length > 0) {
        observer.observe(slideItems[currentIndex]);
    }
});








// Start observing the first slide
//     if (slideItems.length > 0) {
//       observer.observe(slideItems[currentIndex]);
//     }
//   });




// slick slider counter
const slidesArry = [3, 2, 1];
const slidesResArry = [1200, 1050]

function trigger_and_maintain() {
    if (typeof window.stickyHeader === 'function') {
        window.stickyHeader();
    }
    vhHeight();
}

trigger_and_maintain();
window.addEventListener('resize', trigger_and_maintain);
window.addEventListener('DOMContentLoaded', trigger_and_maintain);

// vanila js version of $(document).ready(function () { bloew
document.addEventListener("DOMContentLoaded", function () {
    const audioToggle = document.querySelector('.js-audio-toggle');
    if (audioToggle) {
        audioToggle.addEventListener('click', function () {
            const audio = document.querySelector('#audio-1');
            if (!audio) return;
            audioPlaying = 0;
            if (audio.paused) {
                audio.play();
                audioPlaying = 1;
                audioToggle.classList.add('is--playing');
            } else {
                audio.pause();
                audioToggle.classList.remove('is--playing');
            }
        });
    }

    // const audioToggle = document.querySelector('.js-audio-toggle');
    if (audioToggle) {
        audioToggle.addEventListener('click', function () {
            // audioSelector.forEach((audio, index) => {
            //     let audioEle = document.querySelector(audio);
            //     if (!audioEle) return;
            //     if (index === currentFrameIndex) {
            //         if (audioEle.paused) {
            //             audioEle.play();
            //             audioPlaying = 1;
            //             audioToggle.classList.add('is--playing');
            //         } else {
            //             audioEle.pause();
            //             audioPlaying = 0;
            //             audioToggle.classList.remove('is--playing');
            //         }
            //     } else {
            //         audioEle.pause();
            //     }
            // });
        });
    }

    // get .js-header-sticky height value and assign to .js-header-sticky-placeholder
    function setSliderCounter(slick, currentSlide) {
        const totalDots = slick.$dots[0].querySelectorAll('li').length - 1;
        // base slides already visible
        window.baseSlides = 3;
        // below 1200 it is 2
        if (window.innerWidth < 1050) {
            window.baseSlides = 1;
        }else if (window.innerWidth < 1200) {
            window.baseSlides = 2;
        }
        var slideNumber = currentSlide + window.baseSlides;
        var totalSlides = totalDots + window.baseSlides;
        $('.slide-counter').text(
            (slideNumber < 10 ? '0' : '') + slideNumber.toString() + ' / ' +
            (totalSlides < 10 ? '0' : '') + totalSlides.toString()
        );
    }
    function canSlideNext(slick) {
        return slick.currentSlide < slick.slideCount - slick.options.slidesToShow;
    }
    $('.slick-slider').on('init', function (event, slick) {
        setTimeout(function () {
            setSliderCounter(slick, 0);
            // add is--disabled class to .slide-prev
            $('.slide-prev').addClass('is--disabled');
        }, 100)
    });
    $('.slick-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        centerMode: false,
        rtl: isRTL,
        variableWidth: false,
        infinite: false,

        responsive: [
            {
                breakpoint: slidesResArry[0],
                settings: {
                    slidesToShow: slidesArry[1],
                }
            },
            {
                breakpoint: slidesResArry[1],
                settings: {
                    slidesToShow: slidesArry[2],
                }
            },
        ],
    });

    $('.slide-next').click(function () {
        $('.slick-slider').slick('slickNext');
        const currentSlide = $('.slick-slider').slick('slickCurrentSlide');
        const slideCount = $('.slick-slider').slick('getSlick').slideCount;
        if (currentSlide === slideCount - 1) {
            $('.slide-next').addClass('is--disabled');
        }
        if (currentSlide > 0) {
            $('.slide-prev').removeClass('is--disabled');
        }

    });

    $('.slide-prev').click(function () {
        $('.slick-slider').slick('slickPrev');
        const currentSlide = $('.slick-slider').slick('slickCurrentSlide');
        if (currentSlide === 0) {
            $('.slide-prev').addClass('is--disabled');
        }
        if (currentSlide < $('.slick-slider').slick('getSlick').slideCount - 1) {
            $('.slide-next').removeClass('is--disabled');
        }

    });

    $('.slick-slider').on('afterChange', function (event, slick, currentSlide) {
        // manage arrows disable class
        if (currentSlide === 0) {
            $('.slide-prev').addClass('is--disabled');
        } else {
            $('.slide-prev').removeClass('is--disabled');
        }

        if (canSlideNext(slick)) {
            $('.slide-next').removeClass('is--disabled');
        } else {
            $('.slide-next').addClass('is--disabled');
        }

        setSliderCounter(slick, currentSlide);
    });

    //Set the initial counter
    $(".slide-counter").text('01 / 0' + $('.slick-slider').slick('getSlick').slideCount);

    const popup = $('#popup');
    const overlay = $('.popup-overlay');

    $('.js-open-contact').on('click', function (e) {
        e.preventDefault();
        popup.addClass('visible');
        overlay.addClass('visible');
        $('body').addClass('body-fixed');
    });
    ///closing form
    $(document).on('click', function (e) {
        // check if contactForm exists
        const contactForm = $('.js-contact-form');
        if (!contactForm) return;
        if (!contactForm.is(e.target) && contactForm.has(e.target).length === 0) {
            // closeContactForm();
        }
    });

    $('.js-close-contact').on('click', function (e) {
        e.preventDefault();
        popup.removeClass('visible');
        overlay.removeClass('visible');
        $('body').removeClass('body-fixed');
    });

    // close poup on key press escape
    $(document).keyup(function (e) {
        if (e.keyCode === 27) {
            $('.js-close-contact').click();
            // close video popup
            $('.js-close-video-popup').click();
        }
    });
});

// exp section
let activeExpSlide = 0,
    animatingExp;
const framesLen = document.querySelectorAll('.c-experience-sec .frame').length;


masterThreadsTimeline_duration = .75;
document.addEventListener("DOMContentLoaded", function () {
    window.masterThreadsTimeline = gsap.timeline({ paused: true, repeat: 0, yoyo: true, repeatDelay: 0.2 });
    if (document.body.classList.contains('is--exp-page')) {

        let startY = 0;
        let isDragging = false;

        let lastInvocationTime = 0;
        const throttleInterval = 2000; // Time in milliseconds

        function throttleWheelEvent(event) {
            let currentTime = new Date().getTime();
            if (currentTime - lastInvocationTime > throttleInterval) {
                lastInvocationTime = currentTime;
                handleWheelEvent(event);
            }
        }

        function handleWheelEvent(event) {
            if (event.deltaY > 0) {
                handleScrollDirection('down');
            } else if (event.deltaY < 0) {
                handleScrollDirection('up');
            }
        }

        document.addEventListener('wheel', throttleWheelEvent, { passive: true });



        //left-right arrow click events:
        // Get the sections and backgrounds
        var leftArrow = document.getElementById('js-leftArrow');

        // Add a click event listener to the left arrow
        leftArrow.addEventListener('click', function () {
            if (animatingExp) return; // Check if animation is in progress
            if (activeExpSlide > 0) {
                activeExpSlide--; // Decrement active slide to go to the previous one
                animatingExp = true;
                updateClassesForFrames(); // Update classes to reflect the new active slide
                setTimeout(function () {
                    animatingExp = false;
                }, 350); // Delay the animation for 1000 milliseconds (1 second)
            }
        });



        // var rightArrow = document.getElementById('js-rightArrow');

        // // Add a click event listener to the right arrow
        // rightArrow.addEventListener('click', function () {
        //     if (animatingExp) return; // Check if animation is in progress
        //     if (activeExpSlide < framesLen - 1) {
        //         incActiveExpSlide(); // Increment active slide to go to the next one
        //         animatingExp = true;
        //         updateClassesForFrames(); // Update classes to reflect the new active slide
        //         setTimeout(function () {
        //             animatingExp = false;
        //         }, 350); // Delay the animation for 1000 milliseconds (1 second)
        //     }
        // });

        //updated code to redirect to whatson page on last slide
        var rightArrow = document.getElementById('js-rightArrow');

        // Add a click event listener to the right arrow
        rightArrow.addEventListener('click', function () {
            if (animatingExp) return; // Check if animation is in progress
            incActiveExpSlide(); // Increment active slide to go to the next one
            if (activeExpSlide < framesLen) {
                animatingExp = true;
                updateClassesForFrames(); // Update classes to reflect the new active slide
                setTimeout(function () {
                    animatingExp = false;
                }, 350); // Delay the animation for 350 milliseconds
            }
        });


        //     var rightArrow = document.getElementById('rightArrow');

        //   // Add a click event listener to the right arrow
        //   rightArrow.addEventListener('click', function() {
        //     alert('Right arrow clicked!'); // Display an alert when clicked
        //   });









        gsap.registerPlugin(MorphSVGPlugin);

        // Select the element you want to apply the gestures on
        var touchArea = document.querySelector('.c-experience-sec'); // Replace with your element ID

        // Create a Hammer instance on the touchArea
        var hammer = new Hammer(touchArea);

        // Set up options, if needed
        hammer.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });

        // Handle the pan (drag) event
        hammer.on('pan', function (ev) {
            // You can use ev.deltaY to get the vertical movement
            if (ev.deltaY > 5) {
                handleScrollDirection('up');
            } else if (ev.deltaY < -5) {
                handleScrollDirection('down');
            }
        });

        // Handle the panend event
        hammer.on('panend', function () {
            // Reset isDragging and other flags if needed
            isDragging = false;
        });

        function handleScrollDirection(direction) {
            if (!enableExPScroll) return;
            if (animatingExp) return;

            if (direction === 'down') {
                // if framesLen wwont be exeded
                incActiveExpSlide();
                if (activeExpSlide === framesLen) return;
                animatingExp = true;
                setTimeout(() => {
                    animatingExp = false;
                }, 1000);
            } else {
                if (activeExpSlide === 0) return;
                activeExpSlide--;
                animatingExp = true;
                setTimeout(() => {
                    animatingExp = false;
                }, 1000);
            }
            updateClassesForFrames();
        }

        function incActiveExpSlide() {
            activeExpSlide++;
            // if its last active Exp slide then add class .is--last-active-frame
            if (activeExpSlide === framesLen) {
                goToHomePage();
            }
        }

        const labels = ['a', 'b', 'c', 'd', 'e', 'f'];
        const maxPath = 12;
        const duration = .75;
        let offset = 0;
        for (let i = 0; i < labels.length - 1; i++) {
            offset = 0;
            for (let j = 1; j <= maxPath; j++) {
                const fromPath = "#path-" + labels[0] + "-" + j;
                const toPath1 = "#path-" + labels[i + 1] + "-" + j;
                const path = document.querySelector(toPath1).getAttribute("d");
                masterThreadsTimeline.add(
                    gsap.to(fromPath, { duration: duration, morphSVG: path, ease: "linear" }),
                    `-=${offset}s`
                );
                offset = duration;
            }
            masterThreadsTimeline.addLabel(`label${i + 1}`, `-=0s`); // Adds label at the end of each letter
        }

        // set initial state to label1
        masterThreadsTimeline.tweenTo(`label1`, { duration: 0, ease: "power1.inOut" });
        function updateAudio() {
            // let audioToggle = document.querySelector('.js-audio-toggle');
            // if (!audioToggle) return;
            // if (audioToggle.classList.contains('is--playing')) {
            //     audioSelector.forEach((audioo, index) => {
            //         const audio = document.querySelector('#audio-' + index);
            //         if (!audio) return;
            //         if (index === currentFrameIndex) {
            //             if (audio.paused) {
            //                 audio.play();
            //                 audioPlaying = 1;
            //             } else {
            //                 audio.pause();
            //             }
            //         } else {
            //             audio.pause();
            //         }
            //     });
            // }
        }
        function updateClassesForFrames() {
            // add class to .c-experience-sec .is--active-frame-{activeExpSlide}
            const expSec = document.querySelector('.c-experience-sec');
            const body = document.querySelector('html');
            // remove all classes that has .is--active-frame- and .is--gone-frame-
            for (let i = 0; i < framesLen; i++) {
                expSec.classList.remove(`is--active-frame-${i}`);
                body.classList.remove(`is--active-frame-${i}`);
                expSec.classList.remove(`is--gone-frame-${i}`);
                body.classList.remove(`is--gone-frame-${i}`);
            }
            // Add the active frame class
            expSec.classList.add(`is--active-frame-${activeExpSlide}`);
            body.classList.add(`is--active-frame-${activeExpSlide}`);
            currentFrameIndex = activeExpSlide;
            updateAudio();
        
            // Add the gone frame class for all frames less than the active frame
            for (let i = 0; i < activeExpSlide; i++) {
                expSec.classList.add(`is--gone-frame-${i}`);
                body.classList.add(`is--gone-frame-${i}`);
            }
        
            // move master animation to
            if (activeExpSlide > 0) {
                masterThreadsTimeline.tweenTo(`label${activeExpSlide}`, { duration: masterThreadsTimeline_duration, ease: "power1.inOut" });
            } else {
                masterThreadsTimeline.tweenTo(`label1`, { duration: masterThreadsTimeline_duration, ease: "power1.inOut" });
            }
        
            // if activeExpSlide is 1 then play first audio and change var expPageAutoAudioPlayed to true
            if (activeExpSlide === 1 && !expPageAutoAudioPlayed) {
                expPageAutoAudioPlayed = true;
                // click .js-audio-toggle
                const audioToggle = document.querySelector('.js-audio-toggle');
                if (audioToggle) {
                    audioToggle.click();
                }
            }
        }

        let paths = document.querySelectorAll('.c-threads .st2'); // select all the paths

        for (let i = 0; i < paths.length; i++) {
            paths[i].addEventListener('click', function (event) { // add click listener for each path

                let idStr = event.target.id;
                let frameNo = idStr.split("-")[2] - 7; // calculate frameNo based on id (path-a-7 is frame 0, path-a-8 is frame 1, ...)
                // trigger update class function
                activeExpSlide = frameNo;
                updateClassesForFrames();
            });
        }

        // To navigate to a label
        // master.tweenTo("label1");

        // on .js-to-frames click
        const toFrames = document.querySelector('.js-to-frames');
        if (toFrames) {
            toFrames.addEventListener('click', function (e) {
                e.preventDefault();
                document.body.classList.add('is--frames-page');
                // add class .is--active-frame-0
                const expSec = document.querySelector('.c-experience-sec');
                expSec.classList.add(`is--active-frame-0`);
            });
        }
    }
});


// document.querySelector('#countries').addEventListener('change', function(e) {
//     let imgSrc = e.target.options[e.target.selectedIndex].getAttribute('data-img-src');
//     let img = document.querySelector('#flag-image');
//     img.src = imgSrc;
//     img.style.display = 'block';
//   });

var textarea = document.getElementById('txtarea');
var charCount = document.getElementById('charCount');

textarea.addEventListener('input', function () {
    var remaining = 400 - this.value.length;
    if (remaining < 0) {
        this.value = this.value.substr(0, 400);
        remaining = 0;
    }
    charCount.textContent = remaining;
});


//live button condition

// id of element to validate
// first_name, last_name, phone, email, txtarea

// messages for validation
let validationMsgsEn = {
    first_name: 'Please enter a valid name',
    last_name: 'Please enter a valid name',
    phone: 'Please enter a valid phone number',
    email: 'Please enter a valid email address',
    txtarea: 'Please enter a valid message',
}

let validationMsgsAr = {
    first_name: 'الرجاء إدخال اسم صالح',
    last_name: 'الرجاء إدخال اسم صالح',
    phone: 'الرجاء إدخال رقم هاتف صالح',
    email: 'الرجاء إدخال عنوان بريد إلكتروني صالح',
    txtarea: 'الرجاء إدخال رسالة صالحة',
}

let validationMsgs = validationMsgsEn;

// if html has dir=rtl then isRTL variable should be true
if (document.documentElement.dir == 'rtl') {
    validationMsgs = validationMsgsAr;
}

function addCustomValidMsg(query, msg) {
    // check if query exists
    const nameInput = document.querySelectorAll(query)[0];
    if (!nameInput) return;

    nameInput.addEventListener('input', function () {
        this.setCustomValidity('');
    });

    nameInput.addEventListener('invalid', function () {
        if (this.validity.patternMismatch) {
            this.setCustomValidity(msg);
        } else {
            this.setCustomValidity(msg);
        }
    });

    // if field is empty
    nameInput.addEventListener('empty', function () {
        this.setCustomValidity(msg);
    });
}

// add custom validation messages
addCustomValidMsg('#first_name', validationMsgs.first_name);
addCustomValidMsg('#last_name', validationMsgs.last_name);
addCustomValidMsg('#phone', validationMsgs.phone);
addCustomValidMsg('#email', validationMsgs.email);
addCustomValidMsg('#txtarea', validationMsgs.txtarea);

const form = document.querySelector('.js-contact-form');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.value = input.value.trim();
        });
        // form.submit();
    });

    // trim inputs on blur
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', function (e) {
            e.target.value = e.target.value.trim();
        });
    });
}
window.addEventListener("load", function () {

    // for ".man-flag"
    if (document.querySelector('.man-flag')) {
        gsap.fromTo(".man-flag", {
            yPercent: 20,
        }, {
            yPercent: -15,
            ease: "ease-in",
            scrollTrigger: {
                trigger: ".man-flag",
                scrub: true
            },
        });
    }

    // for ".tree"
    if (document.querySelector('.tree')) {
        gsap.fromTo(".tree", {
            yPercent: 0,
        }, {
            yPercent: -60,
            ease: "ease-in",
            scrollTrigger: {
                trigger: ".tree",
                scrub: true
            },
        });
    }

    let seaShell = [{
        yPercent: -30,
    }, {
        yPercent: -60,
        ease: "ease-in",
        scrollTrigger: {
            trigger: ".sea-shell",
            scrub: true
        },
    }];

    let decoStars = [{
        yPercent: -15,
    }, {
        yPercent: -85,
        ease: "linear",
        scrollTrigger: {
            trigger: ".deco-stars",
            scrub: true
        },
    }];

    if (window.innerWidth < 1200) {
        seaShell[0].yPercent = 10;
        seaShell[1].yPercent = -10;
        decoStars[0].yPercent = -30;
        decoStars[1].yPercent = -75;
    }

    if (document.querySelector('.sea-shell')) {
        gsap.fromTo(".sea-shell", seaShell[0], seaShell[1]);
    }
    if (document.querySelector('.deco-stars')) {
        gsap.fromTo(".deco-stars", decoStars[0], decoStars[1]);
    }

    if (document.querySelector('.wavy-bg')) {
        gsap.fromTo(".wavy-bg", {
            yPercent: 50,
        }, {
            yPercent: -60,
            ease: "ease-in",
            scrollTrigger: {
                trigger: ".wavy-bg",
                scrub: true
            },
        });
    }
    if (document.querySelector('.brand-pattern')) {
        gsap.fromTo(".brand-pattern", {
            yPercent: 50,
        }, {
            yPercent: -60,
            ease: "ease-in",
            scrollTrigger: {
                trigger: ".brand-pattern",
                scrub: true
            },
        });
    }
    if (document.querySelector('.camels-group')) {
        gsap.fromTo(".camels-group", {
            yPercent: 50,
        }, {
            yPercent: -60,
            ease: "ease-in",
            scrollTrigger: {
                trigger: ".camels-group",
                scrub: true
            },
        });
    }
});
function toBaseURL(url) {
    // Create a URL object from the given string
    const urlObj = new URL(url);

    if (urlObj.pathname.indexOf('/experience/') > -1) {
        urlObj.pathname = urlObj.pathname.replace('/experience/', '/');
    }

    // Split the pathname into segments
    const pathSegments = urlObj.pathname.split('/').filter(segment => segment);

    // Identify if it's a staging server
    const isStagingServer = urlObj.hostname.includes('stagingserver');

    // Determine how many segments to keep based on the server type
    // For staging server, keep additional segments to maintain the structure
    const segmentsToKeep = isStagingServer ? 4 : (pathSegments[0] === 'en' || pathSegments[0] === 'ar') ? 1 : 0;

    // Rebuild the pathname from the required segments
    urlObj.pathname = '/' + pathSegments.slice(0, segmentsToKeep).join('/') + '/';

    let urlStr = urlObj.toString().split('#')[0];

    // remove // at the end of urlObj if any
    if (urlStr[urlStr.length - 1] === '/' && urlStr[urlStr.length - 2] === '/') {
        urlStr = urlStr.slice(0, -1);
    }

    // Return the modified URL string
    return urlStr;
}

function goToHomePage() {
    let toUrl = toBaseURL(location.href)
    toSoftLink(toUrl)
}


const phone = document.querySelector('#phone')
// remove space from the end of phone value
phone.value = phone.value.trim();
const phoneCode = phone.value.includes(' ') ? phone.value.split(' ')[0] : '';
if (phone) {
    if (phoneCode) {
        phone.value = phone.value.split(' ')[0] + ' ';
    } else {
        phone.value = '';
    }
}


window.addEventListener("DOMContentLoaded", function () {
    var links = document.links;

    for (var i = 0, linksLength = links.length; i < linksLength; i++) {
        if (links[i].hostname !== window.location.hostname) {
            links[i].target = '_blank';
            // add rel=nofollow to prevent SEO issues
            links[i].rel = 'nofollow noopener noreferrer';
        }
    }
});

$('.js-content_slider').slick({
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    adaptiveHeight: true,
    dots: false,
    swipe: false,
    responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
          },
        },
        {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
            },
          },
      ],
  });