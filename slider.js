// const slider = document.querySelector(".hero-slider");
// if (slider) {
//   let currentSlide = 0;
//   const dots = slider.querySelectorAll("slider-dot");
//   dots.forEach((dot) => {
//     const activeSlide = () => {
//     };
//   });
// }

// const slider = document.querySelector(".hero-slider");

// if (slider) {
//   const slides = Array.from(slider.querySelectorAll(".hero-slide"));
//   const dots = Array.from(slider.querySelectorAll(".slider-dot"));
//   const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
//   const autoplayDelay = 5000;
//   let currentSlide = 0;
//   let autoplayTimer;

//   const showSlide = (index) => {
//     currentSlide = (index + slides.length) % slides.length;

//     slides.forEach((slide, slideIndex) => {
//       slide.classList.toggle("is-active", slideIndex === currentSlide);
//     });

//     dots.forEach((dot, dotIndex) => {
//       const isActive = dotIndex === currentSlide;
//       dot.classList.toggle("is-active", isActive);
//       dot.setAttribute("aria-pressed", String(isActive));
//     });
//   };

//   const stopAutoplay = () => {
//     window.clearInterval(autoplayTimer);
//     autoplayTimer = undefined;
//   };

//   const startAutoplay = () => {
//     stopAutoplay();

//     if (slides.length > 1 && !reduceMotion.matches && !document.hidden) {
//       autoplayTimer = window.setInterval(() => {
//         showSlide(currentSlide + 1);
//       }, autoplayDelay);
//     }
//   };

//   dots.forEach((dot, dotIndex) => {
//     dot.addEventListener("click", () => {
//       showSlide(dotIndex);
//       startAutoplay();
//     });

//     dot.addEventListener("keydown", (event) => {
//       if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

//       event.preventDefault();
//       const direction = event.key === "ArrowRight" ? 1 : -1;
//       showSlide(currentSlide + direction);
//       dots[currentSlide].focus();
//       startAutoplay();
//     });
//   });

//   slider.addEventListener("pointerenter", stopAutoplay);
//   slider.addEventListener("pointerleave", startAutoplay);
//   slider.addEventListener("focusin", stopAutoplay);
//   slider.addEventListener("focusout", (event) => {
//     if (!slider.contains(event.relatedTarget)) startAutoplay();
//   });

//   document.addEventListener("visibilitychange", () => {
//     if (document.hidden) {
//       stopAutoplay();
//     } else {
//       startAutoplay();
//     }
//   });

//   reduceMotion.addEventListener("change", startAutoplay);

//   if (slides.length <= 1) {
//     slider.querySelector(".slider-dots")?.setAttribute("hidden", "");
//   }

//   showSlide(0);
//   startAutoplay();
// }
