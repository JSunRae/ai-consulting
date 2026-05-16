document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("social-post-grid");
  const summaryGrid = document.getElementById("social-summary-grid");
  const emptyState = document.getElementById("social-empty-state");
  const archiveMeta = document.getElementById("social-archive-meta");

  if (!grid || !summaryGrid || !emptyState) {
    return;
  }

  const platformButtons = document.querySelectorAll("[data-social-platform]");
  const kindButtons = document.querySelectorAll("[data-social-kind]");
  const state = {
    platform: "all",
    kind: "post",
    posts: [],
  };

  const statusLabels = {
    published: "Published",
  };

  const ctaLabels = {
    "book-fit-call": "Book Fit Call",
    "start-diagnostic-review": "Start Diagnostic Review",
    "download-checklist": "Download Checklist",
  };

  const kindLabels = {
    post: "Post",
    repost: "Repost",
    share: "Share",
    like: "Like",
  };

  const sortPosts = (posts) =>
    [...posts].sort((left, right) => {
      const leftDate = left.publishedDate || left.preparedDate || "";
      const rightDate = right.publishedDate || right.preparedDate || "";
      return rightDate.localeCompare(leftDate);
    });

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const formatDate = (value) => {
    if (!value) {
      return "Undated";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getCharacterCount = (value) => Array.from(value || "").length;

  const renderArchiveMeta = (payload) => {
    if (!archiveMeta) {
      return;
    }

    const postCount = Array.isArray(payload.posts) ? payload.posts.length : 0;
    if (!postCount) {
      archiveMeta.hidden = true;
      archiveMeta.innerHTML = "";
      return;
    }

    archiveMeta.hidden = false;
    archiveMeta.innerHTML = `
      <p>This page shows published short-form posts and imported historical activity only. Drafting, approval, and scheduling state remain private.</p>
    `;
  };

  const renderSummary = (posts, updatedAt) => {
    const published = posts.filter((post) => post.status === "published").length;
    const channels = new Set(
      posts.flatMap((post) =>
        (post.platforms || []).map((platform) => platform.name),
      ),
    ).size;
    const authoredPosts = posts.filter((post) => getPostKind(post) === "post").length;

    summaryGrid.innerHTML = `
      <article class="social-summary-card reveal">
        <p class="social-summary-label">Published Entries</p>
        <p class="social-summary-value">${published}</p>
      </article>
      <article class="social-summary-card reveal">
        <p class="social-summary-label">Authored Posts</p>
        <p class="social-summary-value">${authoredPosts}</p>
      </article>
      <article class="social-summary-card reveal">
        <p class="social-summary-label">Channels</p>
        <p class="social-summary-value">${channels || 0}</p>
      </article>
      <article class="social-summary-card reveal">
        <p class="social-summary-label">Last Updated</p>
        <p class="social-summary-value social-summary-date">${formatDate(updatedAt)}</p>
      </article>
    `;
  };

  const setButtonState = (buttons, activeButton) => {
    buttons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle("btn-primary", isActive);
      button.classList.toggle("btn-secondary", !isActive);
    });
  };

  function getPostKind(post) {
    switch (post.contentType) {
      case "historical-repost":
        return "repost";
      case "historical-share":
        return "share";
      case "historical-like":
        return "like";
      default:
        return "post";
    }
  }

  const matchesFilters = (post) => {
    const matchesPlatform =
      state.platform === "all" ||
      (post.platforms || []).some(
        (platform) => platform.name.toLowerCase() === state.platform,
      );
    const matchesKind =
      state.kind === "all" || getPostKind(post) === state.kind;

    return matchesPlatform && matchesKind;
  };

  const renderPosts = () => {
    const filtered = state.posts.filter(matchesFilters);

    emptyState.hidden = filtered.length !== 0;
    grid.innerHTML = filtered
      .map((post) => {
        const visiblePlatforms = (post.platforms || []).filter(
          (platform) =>
            state.platform === "all" ||
            platform.name.toLowerCase() === state.platform,
        );

        const tagHtml = (post.tags || [])
          .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
          .join("");

        const platformHtml = visiblePlatforms
          .map((platform) => {
            const socialUrl = platform.url
              ? `<a class="social-link" href="${escapeHtml(platform.url)}" target="_blank" rel="noopener noreferrer">Open published post</a>`
              : "";

            return `
              <section class="social-copy-panel">
                <div class="social-copy-panel-header">
                  <div>
                    <p class="social-copy-platform">${escapeHtml(platform.name)}</p>
                    <p class="social-copy-status">${escapeHtml(statusLabels[platform.status] || platform.status || "Published")}</p>
                  </div>
                  <p class="social-copy-count">${getCharacterCount(platform.copy)} chars</p>
                </div>
                <div class="social-copy-text">${escapeHtml(platform.copy).replace(/\n/g, "<br />")}</div>
                <div class="social-link-row">${socialUrl}</div>
              </section>
            `;
          })
          .join("");

        const sourceBlogLink = post.sourceBlogUrl
          ? `<a class="social-link" href="${escapeHtml(post.sourceBlogUrl)}">Read source article</a>`
          : "";

        const ctaLink = post.targetPageUrl && post.ctaType
          ? `<a class="social-link" href="${escapeHtml(post.targetPageUrl)}">${escapeHtml(ctaLabels[post.ctaType] || post.ctaType)}</a>`
          : "";

        const sourceAttribution = (() => {
          if (post.contentType === "historical-repost" && post.sourceAuthor) {
            return `<p class="social-card-summary">Repost from ${escapeHtml(post.sourceAuthor)}.</p>`;
          }

          if (post.contentType === "historical-share") {
            return `<p class="social-card-summary">Shared activity from LinkedIn history.</p>`;
          }

          if (post.contentType === "historical-like") {
            const sourceAuthor = post.sourceAuthor
              ? ` from ${escapeHtml(post.sourceAuthor)}`
              : "";
            return `<p class="social-card-summary">Liked activity${sourceAuthor}.</p>`;
          }

          return "";
        })();

        return `
          <article class="blog-card social-card reveal" data-status="published">
            <div class="blog-card-content">
              <div class="social-card-header">
                <div class="blog-meta">
                  <span class="category">${escapeHtml(post.pillar || "Published post")}</span>
                  <span class="date">${formatDate(post.publishedDate || post.preparedDate)}</span>
                </div>
                <span class="social-status-badge">Published</span>
              </div>
              <h2 class="social-card-title">${escapeHtml(post.title)}</h2>
              <p class="social-card-summary">${escapeHtml(post.summary || "")}</p>
              ${sourceAttribution}
              <div class="blog-tags">
                <span class="tag">${escapeHtml(kindLabels[getPostKind(post)] || "Post")}</span>
                ${tagHtml}
              </div>
              <div class="social-copy-grid">${platformHtml}</div>
              <div class="social-card-footer">
                ${sourceBlogLink}
                ${ctaLink}
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  };

  const initFilters = () => {
    platformButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.platform = button.dataset.socialPlatform || "all";
        setButtonState(platformButtons, button);
        renderPosts();
      });
    });

    kindButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.kind = button.dataset.socialKind || "all";
        setButtonState(kindButtons, button);
        renderPosts();
      });
    });
  };

  fetch("../assets/data/social-posts.public.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load social archive (${response.status})`);
      }

      return response.json();
    })
    .then((payload) => {
      state.posts = sortPosts(payload.posts || []);
      renderArchiveMeta(payload);
      renderSummary(state.posts, payload.updatedAt);
      initFilters();
      renderPosts();
    })
    .catch((error) => {
      emptyState.hidden = false;
      grid.innerHTML = "";
      if (archiveMeta) {
        archiveMeta.hidden = true;
        archiveMeta.innerHTML = "";
      }
      summaryGrid.innerHTML = `
        <article class="social-summary-card reveal">
          <p class="social-summary-label">Archive Status</p>
          <p class="social-summary-value social-summary-date">Unavailable</p>
        </article>
      `;
      emptyState.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
    });
});
