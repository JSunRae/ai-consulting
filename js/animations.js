/**
 * Scroll Animations for Jason Rae's Website
 * Reveals elements as they enter the viewport
 */

class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll(".reveal");
    this.observer = null;
    this.init();
  }

  init() {
    // Respect the OS/browser reduced-motion accessibility preference.
    // Immediately reveal all elements and skip animation setup.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.elements.forEach((el) => el.classList.add("active"));
      return;
    }

    // Check for IntersectionObserver support
    if ("IntersectionObserver" in window) {
      this.createObserver();
    } else {
      // Fallback: show all elements immediately
      this.elements.forEach((el) => el.classList.add("active"));
    }

    // Initialize skill bar animations
    this.initSkillBars();

    // Initialize counter animations
    this.initCounters();
  }

  createObserver() {
    const options = {
      root: null, // viewport
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          // Optionally unobserve after revealing
          // this.observer.unobserve(entry.target);
        }
      });
    }, options);

    this.elements.forEach((el) => this.observer.observe(el));
  }

  /**
   * Animate skill bars when they come into view
   */
  initSkillBars() {
    const skillBars = document.querySelectorAll(".skill-bar-fill");

    if (!skillBars.length) return;

    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            const targetWidth = fill.style.width;
            fill.style.width = "0";

            // Trigger animation after a small delay
            setTimeout(() => {
              fill.style.width = targetWidth;
            }, 100);

            skillObserver.unobserve(fill);
          }
        });
      },
      { threshold: 0.5 },
    );

    skillBars.forEach((bar) => skillObserver.observe(bar));
  }

  /**
   * Animate number counters
   */
  initCounters() {
    const counters = document.querySelectorAll(
      ".stat-value, .achievement-value",
    );

    if (!counters.length) return;

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            this.animateCounter(counter);
            counterObserver.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /**
   * Animate a single counter element
   */
  animateCounter(element) {
    const text = element.textContent;

    // Check if it's a number we can animate
    const match = text.match(/^([\d,.]+)(.*)$/);
    if (!match) return;

    const target = parseFloat(match[1].replace(/,/g, ""));
    const suffix = match[2] || "";
    const isDecimal = text.includes(".");
    const hasComma = text.includes(",");

    if (isNaN(target)) return;

    const duration = 1500; // ms
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, target);

      let displayValue;
      if (isDecimal) {
        displayValue = current.toFixed(1);
      } else {
        displayValue = Math.round(current);
        if (hasComma) {
          displayValue = displayValue
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      }

      element.textContent = displayValue + suffix;

      if (step >= steps) {
        clearInterval(timer);
        element.textContent = text; // Ensure final value is exact
      }
    }, duration / steps);
  }
}

/**
 * Parallax effect for hero section
 */
class ParallaxEffect {
  constructor() {
    this.hero = document.querySelector(".hero");
    if (!this.hero) return;

    this.init();
  }

  init() {
    // Parallax involves constant motion — skip entirely for reduced-motion users.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only apply on larger screens
    if (window.innerWidth < 768) return;

    window.addEventListener("scroll", () => {
      requestAnimationFrame(() => this.update());
    });
  }

  update() {
    const scrolled = window.pageYOffset;
    const heroHeight = this.hero.offsetHeight;

    if (scrolled > heroHeight) return;

    const rate = scrolled * 0.5;
    const heroContent = this.hero.querySelector(".hero-content");

    if (heroContent) {
      heroContent.style.transform = `translateY(${rate * 0.3}px)`;
      heroContent.style.opacity = 1 - (scrolled / heroHeight) * 0.8;
    }
  }
}

/**
 * Tilt effect for cards (on hover)
 */
class TiltEffect {
  constructor() {
    this.cards = document.querySelectorAll(".project-card, .stack-item");
    if (!this.cards.length) return;

    this.init();
  }

  init() {
    // Only apply on devices with hover and without reduced-motion preference
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    this.cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => this.handleMove(e, card));
      card.addEventListener("mouseleave", (e) => this.handleLeave(e, card));
    });
  }

  handleMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  }

  handleLeave(e, card) {
    card.style.transform = "";
  }
}

/**
 * Smooth scroll progress indicator
 */
class ScrollProgress {
  constructor() {
    this.progressBar = document.getElementById("scroll-progress");
    if (!this.progressBar) {
      this.createProgressBar();
    }
    this.init();
  }

  createProgressBar() {
    this.progressBar = document.createElement("div");
    this.progressBar.id = "scroll-progress";
    this.progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: var(--gradient-primary, linear-gradient(135deg, #64ffda 0%, #3b82f6 100%));
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(this.progressBar);
  }

  init() {
    window.addEventListener("scroll", () => {
      requestAnimationFrame(() => this.update());
    });
  }

  update() {
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / scrollHeight) * 100;
    this.progressBar.style.width = `${scrolled}%`;
  }
}

/**
 * Text typing effect
 *
 * Respects prefers-reduced-motion: when the user has opted out of animations,
 * the first text string is rendered immediately with no looping.
 *
 * Call destroy() to stop the loop (e.g. before removing the element from the DOM).
 */
class TypeWriter {
  constructor(element, texts, speed = 100, deleteSpeed = 50, pauseTime = 2000) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this._timer = null;
    this._stopped = false;

    if (!this.element || !this.texts.length) return;

    // Accessibility: skip animation for users who prefer reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.element.textContent = this.texts[0];
      return;
    }

    this.type();
  }

  type() {
    if (this._stopped) return;

    const currentText = this.texts[this.textIndex];

    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let delay = this.isDeleting ? this.deleteSpeed : this.speed;

    if (!this.isDeleting && this.charIndex === currentText.length) {
      delay = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      delay = 500;
    }

    this._timer = setTimeout(() => this.type(), delay);
  }

  /** Stop the loop and clear the pending timer. Safe to call multiple times. */
  destroy() {
    this._stopped = true;
    if (this._timer !== null) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
}

// Initialize all animations when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ScrollAnimations();
  new ParallaxEffect();
  // new TiltEffect(); // Optional: Can be enabled for card hover effects
  new ScrollProgress();

  // Optional: Initialize typing effect on hero title
  // const heroTitle = document.querySelector('.hero-title');
  // if (heroTitle) {
  //   new TypeWriter(heroTitle, [
  //     'I transform businesses with AI.',
  //     'I build intelligent solutions.',
  //     'I unlock the power of data.'
  //   ]);
  // }
});
