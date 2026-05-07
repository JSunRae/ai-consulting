// Shared form handling logic for Formspree-powered lead capture.
// Contact and newsletter endpoints are configured below.
(function () {
  const SCAFFOLD_FORMSPREE_ID = "xeqkyzoq";
  // Contact and newsletter currently share the same live Formspree endpoint.
  // If newsletter signups should use a separate endpoint later, replace only
  // FORMSPREE_ID_NEWSLETTER with that form's 8-character ID.
  const FORMSPREE_ID = "mgodlwlv";
  const FORMSPREE_ID_NEWSLETTER = "mgodlwlv";
  const FORMSPREE_BASE_URL = "https://formspree.io/f/";
  const DEFAULT_RATE_SECONDS = 45;

  document.addEventListener("DOMContentLoaded", () => {
    warnIfPlaceholdersActive();
    initFormspreeForms();
    initFormResetButtons();
    prefillInquiryFromQuery();
  });

  function initFormspreeForms() {
    const forms = document.querySelectorAll(
      'form[data-form-handler="formspree"]',
    );
    forms.forEach((form) => {
      const formspreeId = getFormspreeId(form);
      if (formspreeId && !isScaffoldFormspreeId(formspreeId)) {
        form.action = FORMSPREE_BASE_URL + formspreeId;
      } else {
        form.removeAttribute("action");
      }

      bindFieldValidation(form);

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        handleFormspreeSubmit(form);
      });
    });
  }

  function handleFormspreeSubmit(form) {
    clearStatus(form);
    if (!validateForm(form)) {
      updateStatus(
        form,
        "Please fix the highlighted fields before submitting.",
        "error",
      );
      return;
    }

    const formspreeId = getFormspreeId(form);
    if (!formspreeId || isScaffoldFormspreeId(formspreeId)) {
      if (handleFallbackSubmission(form)) {
        return;
      }
      updateStatus(
        form,
        "Form submission is not live yet. Please email jason@jasonrae.ai while the production endpoint is being configured.",
        "error",
      );
      return;
    }

    if (honeypotTriggered(form)) {
      return;
    }

    const rateKey = form.dataset.rateLimitKey || form.id || "form";
    const windowSeconds = parseInt(
      form.dataset.rateLimitWindow || DEFAULT_RATE_SECONDS,
      10,
    );
    if (isRateLimited(rateKey, windowSeconds)) {
      updateStatus(
        form,
        `Please wait ${windowSeconds} seconds before submitting again.`,
        "error",
      );
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const loadingText =
      submitButton?.getAttribute("data-loading-text") || "Sending...";
    toggleButtonState(submitButton, true, loadingText);
    updateStatus(form, "Sending your details securely…", "info");

    const formData = new FormData(form);
    formData.append("submitted_from", window.location.href);

    fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json().catch(() => ({}));
        }
        const errorData = await response.json().catch(() => ({}));
        const message =
          errorData?.errors?.[0]?.message ||
          form.dataset.errorMessage ||
          "Something went wrong.";
        throw new Error(message);
      })
      .then(() => {
        markSubmission(rateKey);
        showSuccessState(form);
      })
      .catch((error) => {
        console.error("Form submission failed:", error);
        updateStatus(
          form,
          error.message ||
            form.dataset.errorMessage ||
            "Submission failed. Please try again.",
          "error",
        );
      })
      .finally(() => {
        toggleButtonState(submitButton, false);
      });
  }

  function getFormspreeId(form) {
    const explicitTarget = form.dataset.formspreeTarget;
    if (explicitTarget === "newsletter") {
      return FORMSPREE_ID_NEWSLETTER;
    }
    if (explicitTarget === "contact") {
      return FORMSPREE_ID;
    }
    if (
      form.id === "newsletter-form" ||
      form.querySelector('input[name="list"][value="newsletter"]')
    ) {
      return FORMSPREE_ID_NEWSLETTER;
    }
    return FORMSPREE_ID;
  }

  function handleFallbackSubmission(form) {
    const fallbackMode = form.dataset.fallbackMode;
    if (fallbackMode !== "mailto") {
      return false;
    }

    const recipient = form.dataset.fallbackEmail || "jason@jasonrae.ai";
    const formData = new FormData(form);
    const subject =
      formData.get("subject") || form.dataset.fallbackSubject || "Website inquiry";
    const body = buildFallbackEmailBody(formData);
    const mailtoUrl =
      `mailto:${encodeURIComponent(recipient)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    updateStatus(
      form,
      "Opening your email client with a draft containing your inquiry…",
      "info",
    );
    window.location.href = mailtoUrl;
    return true;
  }

  function buildFallbackEmailBody(formData) {
    const lines = [];
    for (const [key, rawValue] of formData.entries()) {
      if (
        !rawValue ||
        key === "subject" ||
        key === "form_name" ||
        key === "source_page" ||
        key === "contact-company" ||
        key === "list"
      ) {
        continue;
      }

      const value = String(rawValue).trim();
      if (!value) continue;

      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/[-_]+/g, " ")
        .replace(/^./, (char) => char.toUpperCase())
        .trim();
      lines.push(`${label}: ${value}`);
    }

    return lines.join("\n");
  }

  function isScaffoldFormspreeId(formspreeId) {
    return formspreeId === SCAFFOLD_FORMSPREE_ID;
  }

  function showSuccessState(form) {
    const successMessage =
      form.dataset.successMessage || "Thanks for reaching out!";
    clearValidationState(form);
    updateStatus(form, successMessage, "success");
    const successSelector = form.dataset.successTarget;
    const successBlock = successSelector
      ? document.querySelector(successSelector)
      : null;

    if (successBlock) {
      form.classList.add("hidden");
      successBlock.classList.add("show");
    } else {
      form.reset();
    }
  }

  function updateStatus(form, message, state) {
    const statusEl = getStatusElement(form);
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove("is-success", "is-error", "is-visible");
    if (state === "success") {
      statusEl.classList.add("is-success");
    } else if (state === "error") {
      statusEl.classList.add("is-error");
    }
    if (message) {
      statusEl.classList.add("is-visible");
    }
  }

  function clearStatus(form) {
    const statusEl = getStatusElement(form);
    if (!statusEl) return;
    statusEl.textContent = "";
    statusEl.classList.remove("is-success", "is-error", "is-visible");
  }

  function honeypotTriggered(form) {
    const honeypotName = form.dataset.honeypotField;
    if (!honeypotName) return false;
    const trapField = form.querySelector(`[name="${honeypotName}"]`);
    return Boolean(trapField && trapField.value.trim());
  }

  function toggleButtonState(button, isLoading, loadingText) {
    if (!button) return;
    if (isLoading) {
      button.dataset.originalLabel = button.innerHTML;
      button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText || "Sending..."}`;
      button.disabled = true;
    } else {
      if (button.dataset.originalLabel) {
        button.innerHTML = button.dataset.originalLabel;
      }
      button.disabled = false;
    }
  }

  function isRateLimited(key, windowSeconds) {
    try {
      const storageKey = `form-rate-${key}`;
      const last = parseInt(localStorage.getItem(storageKey) || "0", 10);
      if (!last) return false;
      const now = Date.now();
      return now - last < windowSeconds * 1000;
    } catch (error) {
      console.warn("Rate limit storage unavailable:", error);
      return false;
    }
  }

  function markSubmission(key) {
    try {
      const storageKey = `form-rate-${key}`;
      localStorage.setItem(storageKey, Date.now().toString());
    } catch (error) {
      console.warn("Unable to persist rate limit timestamp:", error);
    }
  }

  function initFormResetButtons() {
    document.querySelectorAll("[data-form-reset]").forEach((button) => {
      button.addEventListener("click", () => {
        const selector = button.getAttribute("data-form-reset");
        if (!selector) return;
        const form = document.querySelector(selector);
        const successContainer = button.closest("[data-form-success]");
        if (form) {
          form.classList.remove("hidden");
          form.reset();
          clearStatus(form);
          clearValidationState(form);
          const firstField = form.querySelector("input, textarea, select");
          firstField?.focus();
        }
        if (successContainer) {
          successContainer.classList.remove("show");
        }
      });
    });
  }

  function prefillInquiryFromQuery() {
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

  function getStatusElement(form) {
    return (
      form.querySelector("[data-form-status]") ||
      (form.dataset.feedbackTarget
        ? document.querySelector(form.dataset.feedbackTarget)
        : null)
    );
  }

  function bindFieldValidation(form) {
    const fields = form.querySelectorAll("input, textarea, select");
    fields.forEach((field) => {
      field.addEventListener("input", () => {
        if (field.dataset.dirty !== "true" && getFieldValue(field)) {
          field.dataset.dirty = "true";
        }
        if (field.dataset.dirty === "true") {
          validateFieldUI(field);
        }
        clearStatus(form);
      });

      field.addEventListener("blur", () => {
        field.dataset.dirty = "true";
        validateFieldUI(field);
      });
    });
  }

  function validateForm(form) {
    if (typeof runFormValidation === "function") {
      return runFormValidation(form);
    }

    const fields = Array.from(form.querySelectorAll("input, textarea, select"));
    let isValid = true;

    fields.forEach((field) => {
      if (!validateFieldUI(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      focusFirstInvalidField(form);
    }

    return isValid;
  }

  function clearValidationState(form) {
    if (typeof clearValidationStates === "function") {
      clearValidationStates(form);
      return;
    }

    form.querySelectorAll(".form-group.has-error").forEach((group) => {
      group.classList.remove("has-error");
    });
    form.querySelectorAll(".form-error").forEach((errorEl) => {
      errorEl.textContent = "";
    });
    form.querySelectorAll('[aria-invalid="true"]').forEach((field) => {
      field.removeAttribute("aria-invalid");
    });
  }

  function validateFieldUI(field) {
    if (typeof validateField === "function") {
      return validateField(field);
    }

    if (!field || field.disabled || field.type === "hidden") return true;

    const isRequired = field.hasAttribute("required");
    const type = field.getAttribute("type");
    const value = getFieldValue(field);
    let message = "";

    if (isRequired && !value) {
      message = field.dataset.requiredMessage || "This field is required.";
    } else if (value && type === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value.toLowerCase())) {
        message =
          field.dataset.invalidMessage || "Enter a valid email address.";
      }
    }

    if (message) {
      setFieldErrorState(field, message);
      return false;
    }

    clearFieldErrorState(field);
    return true;
  }

  function setFieldErrorState(field, message) {
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

  function clearFieldErrorState(field) {
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

  function focusFirstInvalidField(form) {
    const errorField = form.querySelector(
      '.form-group.has-error input, .form-group.has-error select, .form-group.has-error textarea',
    );
    errorField?.focus();
  }

  function getFieldValue(field) {
    if (field.type === "checkbox") {
      return field.checked ? field.value : "";
    }
    return field.value.trim();
  }

  // ---------------------------------------------------------------------------
  // Placeholder / dev-mode hardening
  // ---------------------------------------------------------------------------

  /**
   * Called once on DOMContentLoaded.
   * - Shows a sticky red banner (+ console error) if the scaffold Formspree ID
   *   is still active, so the site never silently ships with test endpoints.
   * - Wires up console warnings for Calendly links marked data-placeholder="true"
   *   when running outside the production hostname.
   */
  function warnIfPlaceholdersActive() {
    const issues = [];
    const forms = Array.from(
      document.querySelectorAll('form[data-form-handler="formspree"]'),
    );
    const productionHosts = ["jasonrae.ai", "www.jasonrae.ai"];
    const isProduction = productionHosts.includes(window.location.hostname);

    const formsUsingScaffoldFallback = forms.filter((form) => {
      const formspreeId = getFormspreeId(form);
      return (
        (!formspreeId || isScaffoldFormspreeId(formspreeId)) &&
        form.dataset.fallbackMode === "mailto"
      );
    });

    const hasUnprotectedScaffoldForm = forms.some((form) => {
      const formspreeId = getFormspreeId(form);
      return (
        (!formspreeId || isScaffoldFormspreeId(formspreeId)) &&
        form.dataset.fallbackMode !== "mailto"
      );
    });

    if (FORMSPREE_ID === SCAFFOLD_FORMSPREE_ID && hasUnprotectedScaffoldForm) {
      issues.push(
        'FORMSPREE_ID in <code style="background:rgba(0,0,0,.25);padding:1px 4px;border-radius:3px;">js/forms.js</code> ' +
          "still uses the scaffold Formspree ID — replace it before launch.",
      );
      console.error(
        `%c[DEV WARNING] FORMSPREE_ID is still set to the scaffold ID "${SCAFFOLD_FORMSPREE_ID}". ` +
          "Update FORMSPREE_ID in js/forms.js before going live.",
        "background:#ff3b30;color:#fff;font-size:14px;font-weight:bold;padding:4px 8px;",
      );
    }

    if (
      FORMSPREE_ID_NEWSLETTER === SCAFFOLD_FORMSPREE_ID &&
      hasUnprotectedScaffoldForm
    ) {
      issues.push(
        'FORMSPREE_ID_NEWSLETTER in <code style="background:rgba(0,0,0,.25);padding:1px 4px;border-radius:3px;">js/forms.js</code> ' +
          "still uses the scaffold Formspree ID — replace it if newsletter signups should go to a separate form.",
      );
      console.warn(
        `[DEV WARNING] FORMSPREE_ID_NEWSLETTER is still set to the scaffold ID "${SCAFFOLD_FORMSPREE_ID}". ` +
          "Update it if newsletter signups should use a different Formspree form.",
      );
    }

    // Scan every Formspree form whose action is already hardcoded in HTML and flag
    // actions that still carry the known-placeholder ID used during scaffolding.
    forms.forEach((form) => {
      const formspreeId = getFormspreeId(form);
      const label = form.id || form.getAttribute("name") || "unknown form";
      if (!formspreeId || !isScaffoldFormspreeId(formspreeId)) {
        return;
      }

      if (form.dataset.fallbackMode === "mailto") {
        if (!isProduction) {
          console.info(
            `[DEV INFO] Form "${label}" is using mailto fallback while Formspree remains scaffold-backed.`,
            form,
          );
        }
        return;
      }

      issues.push(
        `Form <strong>${label}</strong> still uses the scaffold Formspree ID ` +
          `(<code style="background:rgba(0,0,0,.25);padding:1px 4px;border-radius:3px;">${SCAFFOLD_FORMSPREE_ID}</code>) — ` +
          "verify this is the correct production endpoint.",
      );
      console.warn(
        `[DEV WARNING] Form "${label}" action still references the scaffold Formspree ID "${SCAFFOLD_FORMSPREE_ID}". ` +
          "Confirm this is the correct production endpoint before launch.",
        form,
      );
    });

    if (issues.length && !isProduction) {
      injectDevWarningBanner(
        "&#9888;&#xFE0F; <strong>DEV WARNING — forms need attention before launch:</strong> " +
          issues.map((i) => `<br>&nbsp;&nbsp;• ${i}`).join(""),
      );
    }

    if (!issues.length && formsUsingScaffoldFallback.length && !isProduction) {
      console.info(
        "[DEV INFO] Formspree placeholder IDs remain in use, but every public form has a working mailto fallback.",
      );
    }

    initCalendlyWarnings(isProduction);
  }

  /**
   * Prepends a dismissible sticky banner to <body> with the given HTML message.
   * @param {string} htmlMessage - Inner HTML for the banner text.
   */
  function injectDevWarningBanner(htmlMessage) {
    if (document.getElementById("dev-warning-banner")) return; // already present
    const banner = document.createElement("div");
    banner.id = "dev-warning-banner";
    banner.setAttribute("role", "alert");
    banner.style.cssText = [
      "position:fixed",
      "top:0",
      "left:0",
      "right:0",
      `z-index:${getComputedStyle(document.documentElement).getPropertyValue("--z-dev-banner").trim() || "99999"}`,
      "background:#ff3b30",
      "color:#fff",
      "font-family:monospace,monospace",
      "font-size:13px",
      "padding:10px 56px 10px 16px",
      "text-align:center",
      "box-shadow:0 2px 8px rgba(0,0,0,.45)",
      "line-height:1.5",
    ].join(";");
    banner.innerHTML = htmlMessage;

    const dismissButton = document.createElement("button");
    dismissButton.type = "button";
    dismissButton.setAttribute("aria-label", "Dismiss dev warning");
    dismissButton.innerHTML = "&#10005;";
    dismissButton.style.cssText =
      "position:absolute;right:12px;top:50%;transform:translateY(-50%);" +
      "background:transparent;border:1px solid rgba(255,255,255,.6);color:#fff;" +
      "border-radius:4px;padding:2px 8px;cursor:pointer;font-size:12px;";
    dismissButton.addEventListener("click", () => {
      banner.remove();
    });
    banner.appendChild(dismissButton);
    document.body.prepend(banner);
  }

  /**
   * Attaches click-time console warnings to every Calendly anchor tagged with
   * data-placeholder="true", but only when NOT on the production hostname.
   * This avoids noise in production while making dev/staging issues obvious.
   */
  function initCalendlyWarnings(isProduction) {
    if (isProduction) return;

    document
      .querySelectorAll('a[data-placeholder="true"][href*="calendly.com"]')
      .forEach((link) => {
        link.addEventListener("click", () => {
          console.warn(
            "[DEV WARNING] Calendly link clicked in a non-production environment. " +
              "Verify that the URL below is the correct live Calendly handle before launch:",
            link.href,
          );
        });
      });
  }
})();
