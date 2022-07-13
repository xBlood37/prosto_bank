'use strict';

const modalWindow = document.querySelector('.modal-window');
const overlay = document.querySelector('.overlay');
const btnCloseModalWindow = document.querySelector('.btn--close-modal-window');
const btnsOpenModalWindow = document.querySelectorAll(
  '.btn--show-modal-window'
);
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

///////////////////////////////////////
// Modal window
const openModalWindow = function (e) {
  e.preventDefault();
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModalWindow.forEach(button =>
  button.addEventListener('click', openModalWindow)
);

// for (let i = 0; i < btnsOpenModalWindow.length; i++)
//   btnsOpenModalWindow[i].addEventListener('click', openModalWindow);

btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});

//cookie message
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'Мы используем cookie! <button class="btn btn--close-cookie"> Ок </button>';

const header = document.querySelector('.header');
header.prepend(message);
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

//cookie message style
message.style.backgroundColor = '#076785';
message.style.width = '50%';
message.style.height = '60px';

// scroll element
btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  const section1Coords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
});

//smooth navigator
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const href = e.target.getAttribute('href');
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  }
});

//tab operation
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function (e) {
  const clickedButton = e.target.closest('.operations__tab');
  // console.log(clickedButton);
  if (!clickedButton) {
    return;
  }

  //active
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clickedButton.classList.add('operations__tab--active');

  //content
  tabContents.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clickedButton.dataset.tab}`)
    .classList.add('operations__content--active');
});

//nav animation
const navLinkAnimation = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const clickedLink = e.target;
    const siblingLinks = clickedLink
      .closest('.nav__links')
      .querySelectorAll('.nav__link');
    const logo = clickedLink.closest('nav').querySelector('img');
    const logoText = clickedLink.closest('.nav').querySelector('.nav__text');

    siblingLinks.forEach(el => {
      if (el != clickedLink) {
        el.style.opacity = opacity;
      }
      logo.style.opacity = opacity;
      logoText.style.opacity = opacity;
    });
  }
};

const nav = document.querySelector('.nav');
nav.addEventListener('mouseover', function (e) {
  navLinkAnimation(e, 0.8);
});

nav.addEventListener('mouseout', function (e) {
  navLinkAnimation(e, 1);
});

//sticky
const navHeight = nav.getBoundingClientRect().height;
const getStickyNav = function (entries) {
  const entry = entries[0];
  // console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(getStickyNav, {
  root: null,
  treshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//hidden section
const sectionAll = document.querySelectorAll('.section');

const apearanceSection = function (entries, observe) {
  const entry = entries[0];
  // console.log(entry);
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    // observe.unobserve(entry.target);
  } else {
    entry.target.classList.add('section--hidden');
    // observe.unobserve(entry.target);
  }
};

const sectionObserver = new IntersectionObserver(apearanceSection, {
  root: null,
  threshold: 0.2,
});

sectionAll.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//lazy img
const lazyImg = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observe) {
  const entry = entries[0];

  if (!entry.isIntersecting) {
    return;
  } else {
    entry.target.src = entry.target.dataset.src;
    // entry.target.classList.remove('lazy-img');
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observe.unobserve(entry.target);
  }
};

const lazyImgObserv = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.5,
});
lazyImg.forEach(image => lazyImgObserv.observe(image));

//slide
const slides = document.querySelectorAll('.slide');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');
let currentSlide = 0;
const slideNum = slides.length;
const slider = document.querySelector('.slider');
const dots = document.querySelector('.dots');
// slider.style.transform = 'scale(0.4) translateX(1300px)';
// slider.style.overflow = 'visible';

//moveslide
const moveToSlide = function (slide) {
  slides.forEach(
    (s, index) => (s.style.transform = `translateX(${(index - slide) * 100}%)`)
  );
};

moveToSlide(0);

//dots
const createDots = function () {
  slides.forEach(function (_, index) {
    dots.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide ="${index}"></button>`
    );
  });
};
createDots();

const activateCurrentDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

activateCurrentDot(0);
//keydown
dots.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    moveToSlide(slide);
    activateCurrentDot(slide);
  }
});

//slide function
const nextSlide = function () {
  if (currentSlide === slideNum - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};

const previosSlide = function () {
  if (currentSlide === 0) {
    currentSlide = slideNum - 1;
  } else {
    currentSlide--;
  }
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};

//slide btn
sliderBtnRight.addEventListener('click', nextSlide);
sliderBtnLeft.addEventListener('click', previosSlide);

document.addEventListener('keydown', function (e) {
  console.log(e);
  if (e.key === 'ArrowRight') {
    nextSlide();
  }
  if (e.key === 'ArrowLeft') {
    previosSlide();
  }
});
