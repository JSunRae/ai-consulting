(() => {
  const TRANSITION_DURATION = 300; // matches var(--transition-normal) for smooth fades

  const onReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  const splitCategories = (card) =>
    (card.dataset.category || "")
      .split(/\s+/)
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);

  const showCard = (card) => {
    if (card.dataset.visible === "true") return;

    card.dataset.visible = "true";
    card.setAttribute("aria-hidden", "false");
    card.style.display = "";
    card.style.pointerEvents = "";
    card.style.opacity = "0";
    card.style.transform = "translateY(12px)";

    requestAnimationFrame(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    });
  };

  const hideCard = (card) => {
    if (card.dataset.visible === "false") return;

    card.dataset.visible = "false";
    card.setAttribute("aria-hidden", "true");
    card.style.pointerEvents = "none";

    const finalizeHide = () => {
      card.style.display = "none";
      card.removeEventListener("transitionend", onTransitionEnd);
    };

    const onTransitionEnd = (event) => {
      if (event.propertyName === "opacity") {
        finalizeHide();
      }
    };

    card.addEventListener("transitionend", onTransitionEnd);
    setTimeout(finalizeHide, TRANSITION_DURATION + 100);

    requestAnimationFrame(() => {
      card.style.opacity = "0";
      card.style.transform = "translateY(12px)";
    });
  };

  const filterProjects = (cards, filter) => {
    const normalizedFilter = (filter || "all").toLowerCase();

    cards.forEach((card) => {
      const categories = splitCategories(card);
      const shouldShow =
        normalizedFilter === "all" || categories.includes(normalizedFilter);

      if (shouldShow) {
        showCard(card);
      } else {
        hideCard(card);
      }
    });
  };

  const setActiveButton = (buttons, targetButton) => {
    buttons.forEach((button) => {
      const isActive = button === targetButton;
      button.classList.toggle("active", isActive);
      button.classList.toggle("btn-primary", isActive);
      button.classList.toggle("btn-secondary", !isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const setupKeyboardNavigation = (buttons) => {
    const focusByOffset = (currentIndex, offset) => {
      const nextIndex =
        (currentIndex + offset + buttons.length) % buttons.length;
      buttons[nextIndex].focus();
    };

    buttons.forEach((button, index) => {
      button.addEventListener("keydown", (event) => {
        switch (event.key) {
          case "ArrowRight":
          case "ArrowDown":
            event.preventDefault();
            focusByOffset(index, 1);
            break;
          case "ArrowLeft":
          case "ArrowUp":
            event.preventDefault();
            focusByOffset(index, -1);
            break;
          case "Home":
            event.preventDefault();
            buttons[0].focus();
            break;
          case "End":
            event.preventDefault();
            buttons[buttons.length - 1].focus();
            break;
          default:
            break;
        }
      });
    });
  };

  onReady(() => {
    const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
    const projectCards = Array.from(document.querySelectorAll(".project-card"));

    if (!filterButtons.length && !projectCards.length) return;

    if (!projectCards.length) {
      // Projects are rendered as static HTML — no cards means a rendering or content issue.
      // Show a human-readable fallback rather than a silent empty state.
      const grid = document.querySelector(
        ".projects-grid, .portfolio-grid, #projects-container",
      );
      if (grid) {
        const fallback = document.createElement("p");
        fallback.className = "portfolio-fallback-message";
        fallback.innerHTML =
          'Portfolio projects are temporarily unavailable. Please <a href="contact.html">book a fit call</a> or get in touch to discuss project details.';
        fallback.style.cssText =
          "text-align:center;color:var(--color-text-secondary,#8892b0);padding:2rem 0;grid-column:1/-1;";
        grid.appendChild(fallback);
      }
      return;
    }

    if (!filterButtons.length) return;

    const buttonGroup = filterButtons[0].parentElement;
    if (buttonGroup) {
      buttonGroup.setAttribute("role", "group");
      buttonGroup.setAttribute("aria-label", "Project filters");
    }

    projectCards.forEach((card) => {
      const isHidden = card.style.display === "none";
      card.dataset.visible = isHidden ? "false" : "true";
      card.setAttribute("aria-hidden", isHidden ? "true" : "false");
      card.style.opacity = isHidden ? "0" : "1";
      if (isHidden) {
        card.style.pointerEvents = "none";
      }
    });

    setupKeyboardNavigation(filterButtons);

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setActiveButton(filterButtons, button);
        filterProjects(projectCards, button.dataset.filter);
      });
    });

    const initialButton =
      filterButtons.find((button) => button.classList.contains("active")) ||
      filterButtons[0];
    setActiveButton(filterButtons, initialButton);
    filterProjects(projectCards, initialButton.dataset.filter);
  });
})();
