/**
 * Main JavaScript for Jason Rae's commercial analytics and applied AI website
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavLink();
  updateDefaultConsultationLabels();
  initConsultationLinks();
  initEventTracking();
  initPrintButtons();
  initFormHandling();
  initContactInquiryPrefill();
  initThemeToggle();
  initBackToTopButton();
  initCopyrightYear();
  initYearBasedExperienceCounters();
  loadDecisionFieldExperience();
});

function initYearBasedExperienceCounters() {
  const currentYear = new Date().getFullYear();

  document.querySelectorAll("[data-years-since]").forEach((element) => {
    const startYear = Number(element.getAttribute("data-years-since"));
    const suffix = element.getAttribute("data-years-suffix") || "+";

    if (!Number.isFinite(startYear)) {
      return;
    }

    const elapsedYears = Math.max(0, currentYear - startYear);
    element.textContent = `${elapsedYears}${suffix}`;
  });
}

function loadDecisionFieldExperience() {
  if (typeof window.initDecisionFieldExperience === "function") {
    window.initDecisionFieldExperience();
    return;
  }

  if (window.__decisionFieldScriptLoading) {
    return;
  }

  window.__decisionFieldScriptLoading = true;

  const script = document.createElement("script");
  script.src = "/js/decision-network.js";
  script.async = true;
  script.onload = () => {
    window.__decisionFieldScriptLoading = false;
    if (typeof window.initDecisionFieldExperience === "function") {
      window.initDecisionFieldExperience();
    }
  };
  script.onerror = () => {
    window.__decisionFieldScriptLoading = false;
  };

  document.head.appendChild(script);
}

function updateDefaultConsultationLabels() {
  document.querySelectorAll(".nav-cta").forEach((anchor) => {
    setAnchorLabel(anchor, "Book Fit Call");
  });

  document.querySelectorAll('a[href*="contact.html"]').forEach((anchor) => {
    const href = anchor.getAttribute("href") || "";
    if (/service=/i.test(href)) {
      return;
    }

    const label = normalizeConsultationText(anchor.textContent);
    if (
      // Legacy CTA labels retained so stale pages still normalize cleanly.
      label === "Book Health Check" ||
      label === "Book a Commercial Analytics Health Check" ||
      label === "Organise Consultation" ||
      label === "Book a Strategy Call" ||
      label === "Book a BI Strategy Call" ||
      label === "Book a Finance Analytics Review" ||
      label === "Book an AI Enablement Workshop" ||
      label === "Book an LLM Architecture Session" ||
      label === "Start an Architecture Review" ||
      label === "Schedule a Workshop" ||
      label === "Start the Conversation"
    ) {
      setAnchorLabel(anchor, "Book Fit Call");
    }
  });
}

function initConsultationLinks() {
  const currentPath = window.location.pathname || "/";
  const sourcePage = currentPath.split("/").pop() || "index.html";

  document.querySelectorAll('a[href*="contact.html"]').forEach((anchor) => {
    try {
      const url = new URL(anchor.getAttribute("href"), window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }

      if (!/\/contact\.html$/i.test(url.pathname)) {
        return;
      }

      const normalizedService = normalizeOfferId(
        url.searchParams.get("service") || url.searchParams.get("offer"),
      );
      if (normalizedService) {
        url.searchParams.set("service", normalizedService);
      }

      const ctaLabel = normalizeConsultationText(
        anchor.getAttribute("data-track-label") ||
          anchor.textContent ||
          anchor.getAttribute("aria-label") ||
          "Contact CTA",
      );
      const offerId = inferOfferId(anchor, normalizedService);
      const sourceSection = getNearestSectionLabel(anchor);

      if (!url.searchParams.has("source")) {
        url.searchParams.set("source", sourcePage);
      }
      if (!url.searchParams.has("source_path")) {
        url.searchParams.set("source_path", currentPath);
      }
      if (ctaLabel && !url.searchParams.has("cta")) {
        url.searchParams.set("cta", ctaLabel.slice(0, 90));
      }
      if (offerId) {
        url.searchParams.set("offer", offerId);
      }
      if (sourceSection && !url.searchParams.has("section")) {
        url.searchParams.set("section", sourceSection.slice(0, 90));
      }

      anchor.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
    } catch (error) {
      console.warn("Unable to annotate contact CTA:", error);
    }
  });
}

function normalizeOfferId(value) {
  const key = normalizeConsultationText(value).toLowerCase();
  const offerMap = {
    "fit-call": "fit-call",
    "diagnostic-review": "diagnostic-review",
    "health-check": "diagnostic-review",
    "commercial analytics health check": "diagnostic-review",
    "commercial analytics diagnostic review": "diagnostic-review",
    "vendor-diligence": "vendor-diligence",
    "ai-software": "vendor-diligence",
    "ai software & vendor due diligence": "vendor-diligence",
    "ai software and vendor due diligence": "vendor-diligence",
    "prioritization-sprint": "prioritization-sprint",
    strategy: "prioritization-sprint",
    roadmap: "prioritization-sprint",
    "decision opportunity prioritization sprint": "prioritization-sprint",
    "foundation-fix": "foundation-fix",
    foundation: "foundation-fix",
    "commercial analytics foundation fix": "foundation-fix",
    "workflow-deployment": "workflow-deployment",
    automation: "workflow-deployment",
    "use-case": "workflow-deployment",
    "commercial workflow deployment": "workflow-deployment",
    "team-enablement": "team-enablement",
    training: "team-enablement",
    enablement: "team-enablement",
    "commercial team enablement": "team-enablement",
    "download-checklist": "download-checklist",
    job: "hiring-conversation",
    jobs: "hiring-conversation",
    hiring: "hiring-conversation",
    "job-opportunity": "hiring-conversation",
    "hiring-conversation": "hiring-conversation",
  };

  return offerMap[key] || "";
}

function inferOfferId(anchor, serviceParam) {
  const directMap = {
    "diagnostic-review": "diagnostic-review",
    "vendor-diligence": "vendor-diligence",
    "prioritization-sprint": "prioritization-sprint",
    "foundation-fix": "foundation-fix",
    "workflow-deployment": "workflow-deployment",
    "team-enablement": "team-enablement",
    "download-checklist": "download-checklist",
    "hiring-conversation": "hiring-conversation",
  };

  const normalizedService = normalizeOfferId(serviceParam);
  if (normalizedService && directMap[normalizedService]) {
    return directMap[normalizedService];
  }

  const explicit = anchor.getAttribute("data-offer");
  if (explicit) {
    const normalizedExplicit = normalizeOfferId(explicit);
    if (normalizedExplicit) {
      return normalizedExplicit;
    }
  }

  const label = normalizeConsultationText(anchor.textContent).toLowerCase();
  const labelMap = [
    [/health check|diagnostic review|discovery/, "diagnostic-review"],
    [/vendor|diligence|software/, "vendor-diligence"],
    [/roadmap|sprint|prioritization/, "prioritization-sprint"],
    [/foundation|kpi|reporting repair/, "foundation-fix"],
    [/workflow|automation|document intelligence|compliance workflow|build/, "workflow-deployment"],
    [/enablement|workshop|training/, "team-enablement"],
    [/checklist|download/, "download-checklist"],
    [/audit/, "diagnostic-review"],
    [/job|hiring|role/, "hiring-conversation"],
    [/fit call|consultation|contact/, "fit-call"],
  ];

  const matched = labelMap.find(([pattern]) => pattern.test(label));
  return matched ? matched[1] : "fit-call";
}

function getNearestSectionLabel(anchor) {
  const scope = anchor.closest("section, article, aside, .card, .cta-card");
  if (!scope) {
    return "";
  }

  const heading = scope.querySelector(
    "h1, h2, h3, .section-title, .contact-title, .card-title, .section-label",
  );
  return heading ? normalizeConsultationText(heading.textContent) : "";
}

function setAnchorLabel(anchor, label) {
  if (!anchor) {
    return;
  }

  const icon = anchor.querySelector("i");
  anchor.innerHTML = icon ? `${icon.outerHTML} ${label}` : label;
}

function normalizeConsultationText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function initEventTracking() {
  bootstrapTrackingLayer();
  initClickTracking();
}

function bootstrapTrackingLayer() {
  if (typeof window.jrTrackEvent === "function") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.__jrTrackingLog = window.__jrTrackingLog || [];

  window.jrTrackEvent = function jrTrackEvent(eventName, detail = {}) {
    const payload = {
      event: eventName,
      event_name: eventName,
      source_page: window.location.pathname.split("/").pop() || "index.html",
      source_path: window.location.pathname || "/",
      timestamp: new Date().toISOString(),
      ...detail,
    };

    window.__jrTrackingLog.push(payload);
    window.dataLayer.push(payload);

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
    }

    window.dispatchEvent(
      new CustomEvent("jr:track", {
        detail: payload,
      }),
    );

    return payload;
  };
}

function initClickTracking() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("a, button");
    if (!target) {
      return;
    }

    const payload = buildTrackingPayload(target);
    if (!payload) {
      return;
    }

    window.jrTrackEvent(payload.eventName, payload.detail);
  });
}

function buildTrackingPayload(target) {
  const href = target.getAttribute("href") || "";
  const urlDetails = parseTrackingUrl(href);
  const label = normalizeConsultationText(
    target.getAttribute("data-track-label") ||
      target.textContent ||
      target.getAttribute("aria-label") ||
      target.getAttribute("title") ||
      "CTA",
  );
  const section =
    target.getAttribute("data-section") || getNearestSectionLabel(target) || "";
  const explicitTrack = target.getAttribute("data-track") || "";
  const offer =
    normalizeOfferId(target.getAttribute("data-offer") || "") ||
    normalizeOfferId(urlDetails.offer || urlDetails.service || "") ||
    inferOfferId(target, urlDetails.offer || urlDetails.service || "");
  const destination = urlDetails.pathname || (href ? safelyResolvePathname(href) : "");

  if (
    explicitTrack === "lead-magnet-download" ||
    /AI-Vendor-Due-Diligence-Checklist\.pdf/i.test(href)
  ) {
    return {
      eventName: "checklist_download",
      detail: {
        label,
        href,
        destination,
        section,
        offer: offer || "download-checklist",
        track_type: explicitTrack || "download",
        content_pillar: target.getAttribute("data-content-pillar") || "",
        follow_up_intent: target.getAttribute("data-follow-up-intent") || "",
      },
    };
  }

  if (/contact\.html/i.test(href) || target.classList.contains("nav-cta")) {
    return {
      eventName: "cta_click",
      detail: {
        label,
        href,
        destination,
        section,
        offer,
        track_type: explicitTrack || "contact-cta",
      },
    };
  }

  return null;
}

function safelyResolvePathname(href) {
  try {
    return new URL(href, window.location.href).pathname;
  } catch (error) {
    return href;
  }
}

function parseTrackingUrl(href) {
  try {
    const url = new URL(href, window.location.href);
    return {
      pathname: url.pathname,
      offer: url.searchParams.get("offer") || "",
      service: url.searchParams.get("service") || "",
    };
  } catch (error) {
    return {
      pathname: "",
      offer: "",
      service: "",
    };
  }
}

function initBackToTopButton() {
  if (document.getElementById("back-to-top")) {
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.id = "back-to-top";
  button.className = "back-to-top";
  button.setAttribute("aria-label", "Back to top");
  button.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const toggleVisibility = () => {
    button.classList.toggle("is-visible", window.scrollY > 520);
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  toggleVisibility();
  document.body.appendChild(button);
}

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
            "Something went wrong. Please email Jason_C_Rae@Outlook.com.",
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
  const serviceParam = normalizeOfferId(
    params.get("service") || params.get("offer"),
  );
  if (!serviceParam) return;

  const optionMap = {
    "diagnostic-review": "diagnostic-review",
    "vendor-diligence": "vendor-diligence",
    "prioritization-sprint": "prioritization-sprint",
    "foundation-fix": "foundation-fix",
    analytics: "power-bi",
    forecasting: "forecasting",
    pricing: "pricing",
    margin: "margin",
    crm: "crm",
    "power-bi": "power-bi",
    "workflow-deployment": "workflow-deployment",
    "team-enablement": "team-enablement",
    "hiring-conversation": "job-opportunity",
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

