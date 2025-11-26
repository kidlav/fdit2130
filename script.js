gsap.registerPlugin(Observer, ScrollToPlugin);

// Собираем секции (они остаются обычными, в нормальном флоу)
const sections = gsap.utils.toArray(".hero, .s-1, .s-2, .s-3, footer");
let currentIndex = 0;
let animating = false;

function gotoSection(nextIndex, direction) {
  if (animating) return;
  animating = true;

  nextIndex = gsap.utils.wrap(0, sections.length, nextIndex);

  const current = sections[currentIndex];
  const next = sections[nextIndex];

  const d = direction; // 1 вниз, -1 вверх

  const tl = gsap.timeline({
    defaults: { duration: 1, ease: "power2.inOut" },
    onComplete: () => {
      currentIndex = nextIndex;
      animating = false;
    }
  });

  // Прокрутка к нужной секции (без absolute)
  tl.to(window, {
    scrollTo: {
      y: next,
      autoKill: false
    }
  }, 0);

  // Анимация ухода текущей секции
  tl.fromTo(current, {
    yPercent: 0,
    opacity: 1
  }, {
    yPercent: -20 * d,  // легкий чижок вверх/вниз
    opacity: 0,
    duration: 0.8
  }, 0);

  // Анимация появления следующей секции
  tl.fromTo(next, {
    yPercent: 20 * d,
    opacity: 0
  }, {
    yPercent: 0,
    opacity: 1,
    duration: 0.8
  }, 0.1);
}

Observer.create({
  type: "wheel,touch,pointer",
  wheelSpeed: 1,
  preventDefault: true,
  tolerance: 15,
  onDown: () => gotoSection(currentIndex + 1, 1),
  onUp: () => gotoSection(currentIndex - 1, -1)
});