/**
 * Main JavaScript for Jason Rae's commercial analytics and applied AI website
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavLink();
  initPrintButtons();
  initFormHandling();
  initContactInquiryPrefill();
  initThemeToggle();
  initCopyrightYear();
});

/**
 * Header scroll effects
 */
function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class
    if (currentScroll > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Optional: Hide/show header on scroll
    // if (currentScroll > lastScroll && currentScroll > 200) {
    //   header.style.transform = 'translateY(-100%)';
    // } else {
    //   header.style.transform = 'translateY(0)';
    // }

    lastScroll = currentScroll;
  });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");
  let lastFocusedElement = null;

  const getFocusableElements = (container) => {
    if (!container) return [];
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(
      (element) =>
        !element.hasAttribute("hidden"),
    );
  };

  const trapFocus = (event, container) => {
    if (event.key !== "Tab") return;
    const focusable = getFocusableElements(container);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const setAriaExpanded = (el, expanded) => {
    if (!el) return;
    el.setAttribute("aria-expanded", expanded ? "true" : "false");
  };

  const setMenuState = (menuToggle, menu, isOpen) => {
    if (!menuToggle || !menu) return;

    menuToggle.classList.toggle("active", isOpen);
    menu.classList.toggle("active", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    setAriaExpanded(menuToggle, isOpen);

    const spans = menuToggle.querySelectorAll("span");
    if (spans.length >= 3) {
      if (isOpen) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    }

    if (isOpen) {
      lastFocusedElement = document.activeElement;
      getFocusableElements(menu)[0]?.focus();
    } else if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  };

  // Primary site nav (most pages)
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const isOpen = !navLinks.classList.contains("active");
      setMenuState(toggle, navLinks, isOpen);
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setMenuState(toggle, navLinks, false);
      });
    });

    navLinks.addEventListener("keydown", (event) => {
      if (!navLinks.classList.contains("active")) return;
      trapFocus(event, navLinks);
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        setMenuState(toggle, navLinks, false);
      }
    });

    return;
  }

  // Blog nav (different markup)
  const blogToggle = document.querySelector(".nav-toggle");
  const blogMenu =
    document.getElementById("blog-nav-menu") ||
    document.querySelector(".nav-menu");
  if (!blogToggle || !blogMenu) return;

  blogToggle.addEventListener("click", () => {
    const isOpen = !blogMenu.classList.contains("active");
    setMenuState(blogToggle, blogMenu, isOpen);
  });

  blogMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(blogToggle, blogMenu, false);
    });
  });

  blogMenu.addEventListener("keydown", (event) => {
    if (!blogMenu.classList.contains("active")) return;
    trapFocus(event, blogMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && blogMenu.classList.contains("active")) {
      setMenuState(blogToggle, blogMenu, false);
    }
  });
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * Set active nav link based on current page.
 * Falls back to marking Blog active for any page under /blog/ that
 * doesn't match a nav href directly (e.g. individual blog post pages).
 */
function initActiveNavLink() {
  const pathname = window.location.pathname;
  const currentPage = pathname.split("/").pop() || "index.html";
  const inBlogDir = pathname.includes("/blog/");

  // All relative hrefs that represent the Blog index in the nav
  const blogNavHrefs = ["index.html", "blog/index.html", "../blog/index.html"];

  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    const isDirectMatch =
      href === currentPage || (currentPage === "" && href === "index.html");
    const isBlogSectionMatch = inBlogDir && blogNavHrefs.includes(href);

    if (isDirectMatch || isBlogSectionMatch) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/**
 * Bind print actions without inline handlers so CSP can stay strict.
 */
function initPrintButtons() {
  document.querySelectorAll("[data-print-trigger]").forEach((button) => {
    button.addEventListener("click", () => {
      window.print();
    });
  });
}

/**
 * Form submission handling + validation
 */
function initFormHandling() {
  // Formspree-powered lead capture is handled by js/forms.js
  const forms = document.querySelectorAll(
    'form[data-form-handler]:not([data-form-handler="formspree"])',
  );
  if (!forms.length) return;

  initFormResetButtons();

  forms.forEach((form) => {
    const statusEl = form.querySelector("[data-form-status]");
    const submitBtn = form.querySelector('[type="submit"]');
    const successTargetSelector = form.dataset.successTarget;
    const successTarget = successTargetSelector
      ? document.querySelector(successTargetSelector)
      : null;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearFormStatus(statusEl);

      const isValid = runFormValidation(form);
      if (!isValid) {
        showFormStatus(
          statusEl,
          "Please fix the highlighted fields before submitting.",
          "error",
        );
        return;
      }

      setButtonLoading(submitBtn, true);

      const formData = new FormData(form);
      formData.append("page_url", window.location.href);

      try {
        const response = await fetch(form.getAttribute("action"), {
          method: form.getAttribute("method") || "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        if (response.ok) {
          form.reset();
          clearValidationStates(form);
          if (successTarget) {
            form.classList.add("is-hidden");
            successTarget.classList.add("show");
            clearFormStatus(statusEl);
          } else {
            showFormStatus(
              statusEl,
              form.dataset.successMessage ||
                "Thanks! I will be in touch shortly.",
              "success",
            );
          }
        } else {
          const data = await response.json().catch(() => ({}));
          const fallback =
            "Unable to submit the form right now. Please try again later.";
          const message =
            data.errors?.[0]?.message || form.dataset.errorMessage || fallback;
          showFormStatus(statusEl, message, "error");
        }
      } catch (error) {
        console.error("Form submission failed:", error);
        showFormStatus(
          statusEl,
          form.dataset.errorMessage ||
            "Something went wrong. Please email jason@jasonrae.ai.",
          "error",
        );
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });

    const fields = form.querySelectorAll("input, textarea, select");
    fields.forEach((field) => {
      field.addEventListener("input", () => {
        if (field.dataset.dirty !== "true" && field.value.trim()) {
          field.dataset.dirty = "true";
        }
        validateField(field);
      });

      field.addEventListener("blur", () => {
        field.dataset.dirty = "true";
        validateField(field);
      });
    });
  });

  initFormResetButtons();
}

function initFormResetButtons() {
  const resetButtons = document.querySelectorAll("[data-form-reset]");
  if (!resetButtons.length) return;

  resetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetSelector = button.getAttribute("data-form-reset");
      const targetForm = document.querySelector(targetSelector);
      if (!targetForm) return;

      const successTargetSelector = targetForm.dataset.successTarget;
      const successTarget = successTargetSelector
        ? document.querySelector(successTargetSelector)
        : null;

      targetForm.classList.remove("is-hidden");
      if (successTarget) {
        successTarget.classList.remove("show");
      }

      const statusEl = targetForm.querySelector("[data-form-status]");
      clearFormStatus(statusEl);
      clearValidationStates(targetForm);
      targetForm.scrollIntoView({ behavior: "smooth", block: "center" });
      targetForm.querySelector("input, textarea, select")?.focus();
    });
  });
}

function initContactInquiryPrefill() {
  const inquirySelect = document.getElementById("inquiry");
  if (!inquirySelect) return;

  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get("service");
  if (!serviceParam) return;

  const optionMap = {
    "health-check": "health-check",
    strategy: "roadmap",
    roadmap: "roadmap",
    foundation: "foundation",
    analytics: "power-bi",
    forecasting: "forecasting",
    pricing: "pricing",
    margin: "margin",
    crm: "crm",
    "power-bi": "power-bi",
    automation: "use-case",
    "use-case": "use-case",
    training: "training",
    job: "job-opportunity",
    jobs: "job-opportunity",
    hiring: "job-opportunity",
  };

  const mappedValue = optionMap[serviceParam.toLowerCase()];
  if (mappedValue) {
    inquirySelect.value = mappedValue;
  }
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    }
  };
}

/**
 * Form helper utilities
 */
function runFormValidation(form) {
  const fields = Array.from(form.querySelectorAll("input, textarea, select"));
  let isValid = true;

  fields.forEach((field) => {
    const fieldValid = validateField(field);
    if (!fieldValid) {
      isValid = false;
    }
  });

  if (!isValid) {
    focusFirstError(form);
  }

  return isValid;
}

function validateField(field) {
  if (!field) return true;
  const isRequired = field.hasAttribute("required");
  const type = field.getAttribute("type");
  const value =
    type === "checkbox"
      ? field.checked
        ? field.value
        : ""
      : field.value.trim();
  let message = "";

  if (isRequired && !value) {
    message = field.dataset.requiredMessage || "This field is required.";
  } else if (value && type === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value.toLowerCase())) {
      message = field.dataset.invalidMessage || "Enter a valid email address.";
    }
  }

  if (message) {
    setFieldError(field, message);
    return false;
  }

  clearFieldError(field);
  return true;
}

function setFieldError(field, message) {
  const group = field.closest(".form-group");
  if (!group) return;

  group.classList.add("has-error");
  const identifier = field.getAttribute("id") || field.getAttribute("name");
  if (identifier) {
    const errorEl = group.querySelector(
      `.form-error[data-error-for="${identifier}"]`,
    );
    if (errorEl) {
      errorEl.textContent = message;
    }
  }
  field.setAttribute("aria-invalid", "true");
}

function clearFieldError(field) {
  const group = field.closest(".form-group");
  if (!group) return;

  group.classList.remove("has-error");
  const identifier = field.getAttribute("id") || field.getAttribute("name");
  if (identifier) {
    const errorEl = group.querySelector(
      `.form-error[data-error-for="${identifier}"]`,
    );
    if (errorEl) {
      errorEl.textContent = "";
    }
  }
  field.removeAttribute("aria-invalid");
}

function clearValidationStates(form) {
  if (!form) return;
  form
    .querySelectorAll(".form-group.has-error")
    .forEach((group) => group.classList.remove("has-error"));
  form.querySelectorAll(".form-error").forEach((errorEl) => {
    errorEl.textContent = "";
  });
  form
    .querySelectorAll('[aria-invalid="true"]')
    .forEach((field) => field.removeAttribute("aria-invalid"));
}

function focusFirstError(form) {
  const errorField = form.querySelector(
    ".form-group.has-error input, .form-group.has-error select, .form-group.has-error textarea",
  );
  if (errorField) {
    errorField.focus();
  }
}

function showFormStatus(el, message, type = "success") {
  if (!el) {
    showToast(message);
    return;
  }
  el.textContent = message;
  el.classList.remove("success", "error");
  el.classList.add("is-visible");
  if (type === "error") {
    el.classList.add("error");
  } else {
    el.classList.add("success");
  }
}

function clearFormStatus(el) {
  if (!el) return;
  el.textContent = "";
  el.classList.remove("is-visible", "success", "error");
}

function setButtonLoading(button, isLoading) {
  if (!button) return;

  if (isLoading) {
    if (!button.dataset.originalContent) {
      button.dataset.originalContent = button.innerHTML;
    }
    button.disabled = true;
    const loadingText = button.dataset.loadingText || "Sending...";
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
  } else {
    if (button.dataset.originalContent) {
      button.innerHTML = button.dataset.originalContent;
    }
    button.disabled = false;
  }
}

/**
 * Copy text to clipboard
 * Prefers the modern async Clipboard API; falls back to a hidden textarea +
 * execCommand for contexts where the Clipboard API is unavailable (e.g. HTTP,
 * some WebViews). The textarea is positioned off-screen to avoid any scroll
 * jump or visual flash, and execCommand's boolean return value is checked so
 * silent failures still produce an actionable error toast.
 */
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        showToast("Copy failed — please select and copy manually.");
      });
    return;
  }

  // Legacy fallback: hidden off-screen textarea
  const textarea = document.createElement("textarea");
  textarea.value = text;
  // Position off-screen so there's no visible flash or scroll jump
  textarea.setAttribute("readonly", "");
  textarea.style.cssText =
    "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;";
  document.body.appendChild(textarea);
  textarea.select();
  let success = false;
  try {
    // eslint-disable-next-line no-document-execcommand -- legacy fallback only
    success = document.execCommand("copy");
  } catch (_) {
    success = false;
  }
  document.body.removeChild(textarea);
  if (success) {
    showToast("Copied to clipboard!");
  } else {
    showToast("Copy failed — please select and copy manually.");
  }
}

/**
 * Simple toast notification
 */
function showToast(message, duration = 3000) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color-bg-card, #172a45);
    color: var(--color-text-heading, #e6f1ff);
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 9999;
    animation: fadeInUp 0.3s ease;
    border: 1px solid var(--color-accent, #64ffda);
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Format number with commas
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Light / dark theme toggle
 * Priority order for initial theme:
 *   1. Explicit user choice stored in localStorage
 *   2. Default → dark
 *
 * js/theme-init.js applies the stored theme before first paint to avoid
 * flashes and keep the site in its intended dark presentation by default.
 */
function initThemeToggle() {
  const themeApi = window.siteTheme;
  const initial = themeApi?.getInitialTheme?.() ?? "dark";
  document.documentElement.setAttribute("data-theme", initial);

  // Inject toggle <li> into the main site nav, just before the CTA button
  const navLinks = document.getElementById("nav-links");
  if (!navLinks) return;

  const li = document.createElement("li");
  li.className = "nav-theme-toggle-item";
  li.innerHTML =
    '<button class="theme-toggle" id="theme-toggle" ' +
    'aria-label="Switch to light mode" title="Toggle light / dark mode">' +
    '<i class="fas fa-sun" aria-hidden="true"></i></button>';

  const ctaItem = navLinks.querySelector(".nav-cta-item");
  ctaItem ? navLinks.insertBefore(li, ctaItem) : navLinks.appendChild(li);

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "dark"
        : "light";
    themeApi?.applyTheme?.(next) ??
      document.documentElement.setAttribute("data-theme", next);
    themeApi?.setStoredTheme?.(next);
    updateThemeIcon();
  });

  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const isLight =
    document.documentElement.getAttribute("data-theme") === "light";
  const icon = btn.querySelector("i");
  if (icon) icon.className = isLight ? "fas fa-moon" : "fas fa-sun";
  btn.setAttribute(
    "aria-label",
    isLight ? "Switch to dark mode" : "Switch to light mode",
  );
  btn.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
  btn.setAttribute("aria-pressed", isLight ? "true" : "false");
}

// fadeOut keyframe lives in css/components.css

/**
 * Dynamic copyright year
 */
function initCopyrightYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
