/**
 * Resume/Portfolio Chatbot for Jason Rae's Website
 * Offline-first, client-side retrieval over local JSON data (no API keys, no network dependency for basic answers).
 */

class LocalRetrieval {
  constructor() {
    this.docs = [];
    this.df = new Map();
    this.inverted = new Map();
    this.ready = false;
  }

  static normalize(text) {
    return (text ?? "").toString().normalize("NFKD").toLowerCase();
  }

  static tokenize(text) {
    const normalized = LocalRetrieval.normalize(text);
    const matches = normalized.match(/[a-z0-9]+(?:[-_][a-z0-9]+)*/g) || [];
    return matches
      .map((t) => t.replace(/_/g, "-"))
      .filter((t) => t.length >= 2 && t.length <= 48);
  }

  static safeJoin(parts, sep = " ") {
    return parts
      .flat()
      .filter(Boolean)
      .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
      .join(sep)
      .trim();
  }

  buildFromData(resumeJson, projectsJson) {
    this.docs = [];
    this.df = new Map();
    this.inverted = new Map();

    const pushDoc = (doc) => {
      const id = doc.id || `${doc.source}:${doc.section}:${this.docs.length}`;
      const title = (doc.title || "").trim();
      const text = (doc.text || "").trim();
      const searchable = LocalRetrieval.safeJoin([title, text]);
      this.docs.push({ ...doc, id, title, text, searchable });
    };

    if (resumeJson) {
      const pi = resumeJson.personalInfo || {};
      pushDoc({
        source: "resume",
        section: "summary",
        title: `${pi.name || "Resume"} — Summary`,
        text: LocalRetrieval.safeJoin(
          [
            pi.title ? `${pi.title}` : null,
            pi.location ? `Location: ${pi.location}` : null,
            pi.summary ? `${pi.summary}` : null,
          ],
          "\n",
        ),
      });

      (resumeJson.experience || []).forEach((exp) => {
        const achievements = (exp.achievements || [])
          .map((a) => a?.text)
          .filter(Boolean);
        const tech = (exp.technologies || []).filter(Boolean);
        pushDoc({
          source: "resume",
          section: "experience",
          title: `${exp.title || "Role"} — ${exp.company || ""}`.trim(),
          text: LocalRetrieval.safeJoin(
            [
              exp.location ? `Location: ${exp.location}` : null,
              exp.startDate
                ? `Dates: ${exp.startDate}${exp.endDate ? ` to ${exp.endDate}` : " to Present"}`
                : null,
              exp.description,
              achievements.length
                ? `Key achievements: ${achievements.join(" | ")}`
                : null,
              tech.length ? `Technologies: ${tech.join(", ")}` : null,
            ],
            "\n",
          ),
          meta: { id: exp.id, company: exp.company, title: exp.title },
        });
      });

      const skills = resumeJson.skills || {};
      Object.values(skills).forEach((category) => {
        const catName = category?.category;
        const items = (category?.items || [])
          .map((i) => i?.name)
          .filter(Boolean);
        if (!items.length) return;
        pushDoc({
          source: "resume",
          section: "skills",
          title: catName ? `Skills — ${catName}` : "Skills",
          text: items.join(", "),
        });
      });

      (resumeJson.certifications || []).forEach((c) => {
        pushDoc({
          source: "resume",
          section: "certifications",
          title: `Certification — ${c.name || ""}`.trim(),
          text: LocalRetrieval.safeJoin(
            [
              c.issuer ? `Issuer: ${c.issuer}` : null,
              c.year ? `Year: ${c.year}` : null,
            ],
            "\n",
          ),
        });
      });

      (resumeJson.education || []).forEach((e) => {
        pushDoc({
          source: "resume",
          section: "education",
          title: `Education — ${e.degree || ""}`.trim(),
          text: LocalRetrieval.safeJoin(
            [
              e.institution ? `${e.institution}` : null,
              e.location ? `Location: ${e.location}` : null,
              e.year ? `Year: ${e.year}` : null,
              (e.highlights || []).length
                ? `Highlights: ${(e.highlights || []).join(" | ")}`
                : null,
            ],
            "\n",
          ),
        });
      });

      (resumeJson.dailyAIStack || []).forEach((s) => {
        pushDoc({
          source: "resume",
          section: "daily-stack",
          title: `Daily AI Stack — ${s.name || ""}`.trim(),
          text: LocalRetrieval.safeJoin(
            [
              s.category ? `Category: ${s.category}` : null,
              s.usage ? `Usage: ${s.usage}` : null,
            ],
            "\n",
          ),
        });
      });

      (resumeJson.personalProjects || []).forEach((p) => {
        const tech = (p.technologies || []).filter(Boolean);
        pushDoc({
          source: "resume",
          section: "personal-project",
          title: `Personal Project — ${p.title || ""}`.trim(),
          text: LocalRetrieval.safeJoin(
            [
              p.summary,
              tech.length ? `Technologies: ${tech.join(", ")}` : null,
            ],
            "\n",
          ),
          meta: { id: p.id },
        });
      });
    }

    if (projectsJson) {
      (projectsJson.projects || []).forEach((p) => {
        const tech = (p.technologies || []).filter(Boolean);
        const highlights = (p.highlights || []).filter(Boolean);
        const heroTechBadges = (p.detailPage?.heroTechBadges || []).filter(Boolean);
        const metrics = p.metrics
          ? Object.entries(p.metrics)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" | ")
          : "";
        pushDoc({
          source: "projects",
          section: "project",
          title: `Project — ${p.title || ""}`.trim(),
          text: LocalRetrieval.safeJoin(
            [
              p.year ? `Year: ${p.year}` : null,
              p.status ? `Status: ${p.status}` : null,
              p.category ? `Category: ${p.category}` : null,
              p.businessRelevance
                ? `Business relevance: ${p.businessRelevance}`
                : null,
              p.description,
              p.longDescription,
              tech.length ? `Technologies: ${tech.join(", ")}` : null,
              metrics ? `Metrics: ${metrics}` : null,
              highlights.length
                ? `Highlights: ${highlights.join(" | ")}`
                : null,
              p.detailPage?.heroSummary
                ? `Detail summary: ${p.detailPage.heroSummary}`
                : null,
              heroTechBadges.length
                ? `Detail technologies: ${heroTechBadges.join(", ")}`
                : null,
              p.detailPage?.schemaDescription
                ? `Schema description: ${p.detailPage.schemaDescription}`
                : null,
            ],
            "\n",
          ),
          meta: { id: p.id, category: p.category, year: p.year },
        });
      });

      (projectsJson.caseStudies || []).forEach((study) => {
        const highlights = (study.highlights || []).filter(Boolean);
        pushDoc({
          source: "projects",
          section: "case-study",
          title: `Case Study — ${study.title || ""}`.trim(),
          text: LocalRetrieval.safeJoin(
            [
              study.category ? `Category: ${study.category}` : null,
              study.displayCategory
                ? `Display category: ${study.displayCategory}`
                : null,
              study.description,
              highlights.length
                ? `Highlights: ${highlights.join(" | ")}`
                : null,
            ],
            "\n",
          ),
          meta: { id: study.id, category: study.category },
        });
      });
    }

    this._buildIndex();
    this.ready = true;
  }

  _buildIndex() {
    const df = new Map();
    const inverted = new Map();
    const N = this.docs.length;

    for (const doc of this.docs) {
      const tokens = LocalRetrieval.tokenize(doc.searchable);
      const unique = new Set(tokens);
      for (const token of unique) {
        df.set(token, (df.get(token) || 0) + 1);
      }
    }

    for (let i = 0; i < N; i++) {
      const doc = this.docs[i];
      const tokens = LocalRetrieval.tokenize(doc.searchable);
      const tf = new Map();
      for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
      for (const [token, count] of tf.entries()) {
        if (!inverted.has(token)) inverted.set(token, []);
        inverted.get(token).push([i, count]);
      }
    }

    this.df = df;
    this.inverted = inverted;
  }

  search(query, { limit = 5 } = {}) {
    if (!this.ready) return [];
    const tokens = LocalRetrieval.tokenize(query);
    if (!tokens.length) return [];

    const N = this.docs.length;
    const scores = new Map();

    for (const token of tokens) {
      const postings = this.inverted.get(token);
      if (!postings) continue;
      const df = this.df.get(token) || 0;
      const idf = Math.log((N + 1) / (df + 1)) + 1;
      for (const [docIndex, tf] of postings) {
        const doc = this.docs[docIndex];
        const titleBoost = LocalRetrieval.normalize(doc.title).includes(token)
          ? 1.6
          : 1.0;
        const sectionBoost = doc.section === "skills" ? 1.15 : 1.0;
        const score = tf * idf * titleBoost * sectionBoost;
        scores.set(docIndex, (scores.get(docIndex) || 0) + score);
      }
    }

    const ranked = [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([docIndex, score]) => ({ ...this.docs[docIndex], score }));

    return ranked;
  }

  snippet(doc, query, { maxLen = 220 } = {}) {
    const text = (doc?.text || "").replace(/\s+/g, " ").trim();
    if (!text) return "";
    const tokens = LocalRetrieval.tokenize(query);
    const hay = LocalRetrieval.normalize(text);
    let idx = -1;
    for (const t of tokens) {
      idx = hay.indexOf(t);
      if (idx !== -1) break;
    }
    if (idx === -1)
      return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
    const start = Math.max(0, idx - Math.floor(maxLen / 3));
    const end = Math.min(text.length, start + maxLen);
    const snippet = text.slice(start, end).trim();
    const prefix = start > 0 ? "…" : "";
    const suffix = end < text.length ? "…" : "";
    return `${prefix}${snippet}${suffix}`;
  }
}

class ChatBot {
  constructor() {
    this.chatWidget = document.getElementById("chat-widget");
    this.chatWindow = document.getElementById("chat-window");
    this.chatToggle = document.getElementById("chat-toggle");
    this.chatClose = document.getElementById("chat-close");
    this.chatMessages = document.getElementById("chat-messages");
    this.chatInput = document.getElementById("chat-input");
    this.chatSend = document.getElementById("chat-send");
    this.chatSuggestions = document.getElementById("chat-suggestions");
    this.chatHeaderTitle = document.getElementById("chat-window-title");

    this.isOpen = false;
    this.isTyping = false;
    this.lastFocusedElement = null;

    this.retrieval = new LocalRetrieval();
    this.localDataLoaded = false;
    this.loadingStarted = false;
    this.intentTaxonomy = [
      {
        tag: "pricing",
        patterns: [/\b(price|pricing|cost|budget|fee|quote|rates?|how much|charge)\b/i],
      },
      {
        tag: "vendor_diligence",
        patterns: [
          /\b(vendor|software|platform|vendor diligence|due diligence|copilot|tooling|procurement|buying ai software)\b/i,
        ],
      },
      {
        tag: "build_vs_buy",
        patterns: [
          /\b(build vs buy|build-or-buy|vendor or internal|in-house|openai api|fine[- ]?tun|retrieval|rag|api wrapper)\b/i,
        ],
      },
      {
        tag: "customer_service_ai",
        patterns: [
          /\b(customer service|support|ticket|tickets|chatbot|helpdesk|call center|contact centre|service automation)\b/i,
        ],
      },
      {
        tag: "headcount_or_capacity",
        patterns: [
          /\b(headcount|fte|capacity|productivity|cost reduction|cost takeout|reduce staff|reduce team)\b/i,
        ],
      },
      {
        tag: "implementation_scope",
        patterns: [
          /\b(scope|implementation|engagement|offer|service|workflow|diagnostic|sprint|deployment|enablement|fit call|next step)\b/i,
        ],
      },
    ];

    // Fallback summary (used only if JSON cannot be loaded)
    this.fallback = {
      name: "Jason Rae",
      title:
        "Commercial Analytics & Applied AI Leader | Leading EMEA Commercial & Sales Analytics",
      location: "Stuttgart, Germany",
    };

    // Canonical profile snippets used for direct (non-retrieval) answers.
    // Kept in sync with assets/data/resume.json when local data loads.
    this.knowledge = {
      name: this.fallback.name,
      title: this.fallback.title,
      location: this.fallback.location,
      email: "Jason_C_Rae@Outlook.com",
      // Populated from resume.json on load; fallback strings reflect actual resume content
      achievements: [
        "€1.3M in UK sales growth in 2023, surpassing target by more than fourfold — independently",
        "Fully handled two acquisitions end to end, partnering with the BI team on credits, customer/account-level data refactoring, and country-by-country customer matching to ensure clean data transfer and reliable performance measurement",
        "Led European contribution to a global AI initiative: built a training programme from scratch that enabled commercial teams to apply AI safely across real business workflows",
        "Personally generated €3M in sales growth against an initial annual target of ~€300k — surpassing the combined performance of all European Sales Representatives",
        "Grew divisional sales from 4% to 57% growth — a complete operational turnaround across 38 customer markets",
        "Grew territory revenue from $1.4M to $4.2M — a 3× increase — achieving the highest territory profitability in Australia",
      ],
    };

    this.pageConfig = this.getPageConfig();

    this.init();
  }

  init() {
    if (!this.chatWidget || !this.chatToggle || !this.chatWindow) return;

    if (!this.pageConfig.enabled) {
      this.hideWidget();
      return;
    }

    this.applyPageConfig();
    this.initPresentation();

    // Load local knowledge base (offline-first: same-origin JSON)
    // Deferred to first open/interaction

    // Toggle chat window
    this.chatToggle.addEventListener("click", () => this.toggle());
    this.chatClose?.addEventListener("click", () => this.close());

    // Send message
    this.chatSend?.addEventListener("click", () => this.sendMessage());
    this.chatInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendMessage();
    });

    // Suggestion buttons
    this.chatSuggestions
      ?.querySelectorAll(".chat-suggestion")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          const question = btn.dataset.question;
          if (question) {
            this.chatInput.value = question;
            this.sendMessage();
          }
        });
      });

    // Focus trap: keep Tab/Shift+Tab inside the dialog while open
    this.chatWindow?.addEventListener("keydown", (e) => {
      if (!this.isOpen || e.key !== "Tab") return;
      const focusable = this._getFocusableElements();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) this.close();
    });
  }

  getPageConfig() {
    const path = (window.location.pathname || "/").replace(/\\/g, "/");
    const isHome = /^\/(?:index\.html)?$/.test(path);
    const isBlogIndex = /^\/blog(?:\/index\.html|\/)?$/.test(path);
    const isContact = /^\/contact(?:\.html)?$/.test(path);
    const isServices = /^\/services(?:\.html)?$/.test(path);
    const isPortfolioIndex = /^\/portfolio(?:\.html)?$/.test(path);
    const isResume = /^\/resume(?:\.html)?$/.test(path);
    const isBlogArticle = path.startsWith("/blog/") && !isBlogIndex;
    const isPortfolioDetail = path.startsWith("/portfolio/");

    if (isHome) {
      return {
        enabled: true,
        title: "AI Decision Assistant",
        intro:
          "Ask about AI software choices, customer-service automation, vendor risk, or which first step fits your situation.",
        placeholder: "Ask about software choice, support AI, or scope...",
        launcherAriaLabel: "Open AI decision assistant",
        revealDelayMs: 9000,
        revealOnScrollRatio: 0.18,
        suggestions: [
          {
            label: "Buying AI software?",
            question: "What should we check before buying AI software?",
          },
          {
            label: "Support automation?",
            question: "Can AI reduce customer service workload safely?",
          },
          {
            label: "Diagnostic price?",
            question: "What does the Diagnostic Review cost and include?",
          },
        ],
        examples: [
          "What should we check before buying AI software?",
          "Can AI reduce customer service workload safely?",
          "What does the Diagnostic Review cost and include?",
        ],
      };
    }

    if (isServices) {
      return {
        enabled: true,
        title: "Decision Systems Assistant",
        intro:
          "Ask about forecasting, pricing, CRM governance, AI software diligence, or which engagement fits the problem.",
        placeholder: "Ask about software choice, pricing, CRM, or scope...",
        launcherAriaLabel: "Open decision systems assistant",
        revealDelayMs: 10000,
        revealOnScrollRatio: 0.24,
        suggestions: [
          {
            label: "Software due diligence?",
            question: "How do you help evaluate AI software vendors?",
          },
          {
            label: "Customer service AI?",
            question: "Can AI reduce customer service headcount safely?",
          },
          {
            label: "Diagnostic review?",
            question: "What does the Diagnostic Review cost and include?",
          },
        ],
        examples: [
          "How do you help evaluate AI software vendors?",
          "Can AI reduce customer service headcount safely?",
          "What does the Diagnostic Review cost and include?",
        ],
      };
    }

    if (isContact) {
      return {
        enabled: true,
        title: "Fit Call Assistant",
        intro:
          "Ask what to include in the intake, whether your problem is a fit, or which route makes sense before you submit.",
        placeholder: "Ask about fit, intake, or the right first step...",
        launcherAriaLabel: "Open fit-call assistant",
        revealDelayMs: 7000,
        revealOnScrollRatio: 0.14,
        suggestions: [
          {
            label: "Is this a fit?",
            question: "What problems are the best fit for Jason?",
          },
          {
            label: "What to submit?",
            question: "What should I include before submitting the intake form?",
          },
          {
            label: "Vendor or in-house?",
            question: "Can Jason help decide between a vendor tool and an internal AI build?",
          },
        ],
        examples: [
          "What problems are the best fit for Jason?",
          "What should I include before submitting the intake form?",
          "Can Jason help decide between a vendor tool and an internal AI build?",
        ],
      };
    }

    if (isPortfolioIndex || isPortfolioDetail || isBlogArticle) {
      return {
        enabled: true,
        title: "Case Study Assistant",
        intro:
          "Ask for a quick summary of a case study, a project architecture, or the commercial outcome behind a build.",
        placeholder: "Ask about a case study, project logic, or outcome...",
        launcherAriaLabel: "Open case study assistant",
        revealDelayMs: 12000,
        revealOnScrollRatio: 0.32,
        suggestions: [
          {
            label: "Case study summary",
            question: "Which case studies are most relevant to forecasting or pricing?",
          },
          {
            label: "Business outcome",
            question: "What commercial results have you delivered?",
          },
          {
            label: "Project logic",
            question: "Tell me about your portfolio projects",
          },
        ],
        examples: [
          "Which case studies are most relevant to forecasting or pricing?",
          "What commercial results have you delivered?",
          "Tell me about your portfolio projects",
        ],
      };
    }

    if (isResume) {
      return {
        enabled: true,
        title: "Experience Assistant",
        intro:
          "Ask about commercial results, leadership progression, analytics capability, or how Jason works across forecasting, pricing, CRM, and AI.",
        placeholder: "Ask about results, tools, or leadership background...",
        launcherAriaLabel: "Open experience assistant",
        revealDelayMs: 9000,
        revealOnScrollRatio: 0.22,
        suggestions: [
          {
            label: "Commercial results",
            question: "What commercial results have you delivered?",
          },
          {
            label: "Leadership path",
            question: "What roles has Jason had?",
          },
          {
            label: "Analytics stack",
            question: "What tools do you use daily?",
          },
        ],
        examples: [
          "What commercial results have you delivered?",
          "What roles has Jason had?",
          "What tools do you use daily?",
        ],
      };
    }

    return {
      enabled: false,
      title: "Assistant",
      intro: "",
      placeholder: "Ask a question...",
      launcherAriaLabel: "Open assistant",
      revealDelayMs: 0,
      revealOnScrollRatio: 1,
      suggestions: [],
      examples: [],
    };
  }

  applyPageConfig() {
    if (this.chatHeaderTitle) {
      const status = this.chatHeaderTitle.querySelector(".chat-status");
      this.chatHeaderTitle.textContent = "";
      if (status) {
        this.chatHeaderTitle.appendChild(status);
      }
      this.chatHeaderTitle.append(` ${this.pageConfig.title}`);
    }

    const initialMessage = this.chatMessages?.querySelector(".chat-message.bot");
    if (initialMessage) {
      initialMessage.textContent = this.pageConfig.intro;
    }

    if (this.chatInput && this.pageConfig.placeholder) {
      this.chatInput.placeholder = this.pageConfig.placeholder;
    }

    if (this.chatToggle && this.pageConfig.launcherAriaLabel) {
      this.chatToggle.setAttribute("aria-label", this.pageConfig.launcherAriaLabel);
      this.chatToggle.setAttribute("title", this.pageConfig.launcherAriaLabel);
    }

    const suggestionButtons = this.chatSuggestions?.querySelectorAll(".chat-suggestion") || [];
    suggestionButtons.forEach((button, index) => {
      const suggestion = this.pageConfig.suggestions[index];
      if (!suggestion) {
        button.hidden = true;
        return;
      }

      button.hidden = false;
      button.dataset.question = suggestion.question;
      button.textContent = suggestion.label;
    });
  }

  initPresentation() {
    const hasPriorEngagement =
      window.sessionStorage.getItem("jr-chat-engaged") === "true";

    if (hasPriorEngagement) {
      this.revealWidget();
      return;
    }

    let revealed = false;
    const revealOnce = () => {
      if (revealed) return;
      revealed = true;
      clearTimeout(timerId);
      window.removeEventListener("scroll", onScroll);
      this.revealWidget();
    };

    const onScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const progress = window.scrollY / scrollableHeight;
      if (progress >= this.pageConfig.revealOnScrollRatio) {
        revealOnce();
      }
    };

    const timerId = window.setTimeout(
      revealOnce,
      this.pageConfig.revealDelayMs,
    );

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  hideWidget() {
    this.chatWidget.setAttribute("hidden", "");
    this.chatWidget.classList.remove("is-ready");
  }

  revealWidget() {
    this.chatWidget.removeAttribute("hidden");
    this.chatWidget.classList.add("is-ready");
  }

  /** Returns all keyboard-focusable elements inside the chat window. */
  _getFocusableElements() {
    if (!this.chatWindow) return [];
    return Array.from(
      this.chatWindow.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.closest('[aria-hidden="true"]'));
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.revealWidget();
    window.sessionStorage.setItem("jr-chat-engaged", "true");
    if (typeof window.jrTrackEvent === "function") {
      window.jrTrackEvent("chat_open", {
        chat_title: this.pageConfig.title,
      });
    }
    this.lastFocusedElement = document.activeElement;
    this.chatWindow?.classList.add("active");
    this.chatWindow?.setAttribute("aria-hidden", "false");
    this.chatToggle?.setAttribute("aria-expanded", "true");
    this.chatToggle?.setAttribute("aria-label", `Close ${this.pageConfig.title.toLowerCase()}`);
    this.chatToggle?.setAttribute("title", `Close ${this.pageConfig.title.toLowerCase()}`);
    this.setBackgroundState(true);
    this.isOpen = true;
    // Move focus inside the dialog
    this.chatInput?.focus();
    this.loadLocalData();
  }

  close() {
    this.chatWindow?.classList.remove("active");
    this.chatWindow?.setAttribute("aria-hidden", "true");
    this.chatToggle?.setAttribute("aria-expanded", "false");
    this.chatToggle?.setAttribute("aria-label", this.pageConfig.launcherAriaLabel);
    this.chatToggle?.setAttribute("title", this.pageConfig.launcherAriaLabel);
    this.setBackgroundState(false);
    this.isOpen = false;
    // Return focus to the trigger button
    if (this.lastFocusedElement instanceof HTMLElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    } else {
      this.chatToggle?.focus();
    }
  }

  setBackgroundState(isModalOpen) {
    document.body.classList.toggle("chat-open", isModalOpen);

    Array.from(document.body.children).forEach((child) => {
      const isChatWidget = child.id === "chat-widget" || child.classList.contains("chat-widget");
      if (isChatWidget) return;

      if (isModalOpen) {
        child.setAttribute("data-chat-inert", "true");
        child.setAttribute("aria-hidden", "true");
        child.inert = true;
      } else if (child.hasAttribute("data-chat-inert")) {
        child.removeAttribute("data-chat-inert");
        child.removeAttribute("aria-hidden");
        child.inert = false;
      }
    });
  }

  sendMessage() {
    const message = this.chatInput?.value.trim();
    if (!message || this.isTyping) return;
    const userIntentTags = this.detectIntentTags(message);

    if (typeof window.jrTrackEvent === "function") {
      window.jrTrackEvent("chat_prompt_submitted", {
        chat_title: this.pageConfig.title,
        intent_tags: userIntentTags.join(","),
        prompt_length: message.length,
      });
    }

    // Add user message
    this.addMessage(message, "user", userIntentTags);
    this.chatInput.value = "";

    // Hide suggestions after first message
    if (this.chatSuggestions) {
      this.chatSuggestions.style.display = "none";
    }

    // Generate response first so the delay can be proportional to its length
    const response = this.normalizeResponse(this.generateResponse(message), message);
    // ~2 ms per character, clamped to [300, 1500] ms
    const delay = Math.min(Math.max(300, response.text.length * 2), 1500);

    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      this.addMessage(response.text, "bot", response.tags);
    }, delay);
  }

  addMessage(text, type, tags = []) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${type}`;
    // Preserve newlines for readable sourced snippets.
    messageDiv.style.whiteSpace = "pre-wrap";
    messageDiv.textContent = text;
    if (tags.length) {
      messageDiv.dataset.intentTags = tags.join(",");
      window.dispatchEvent(
        new CustomEvent("jr:chat-intent", {
          detail: {
            source: "chatbot",
            role: type,
            tags,
            text,
          },
        }),
      );
    }
    this.chatMessages?.appendChild(messageDiv);
    this.scrollToBottom();
  }

  detectIntentTags(input) {
    const normalized = (input || "").trim();
    if (!normalized) return [];

    return this.intentTaxonomy
      .filter((entry) => entry.patterns.some((pattern) => pattern.test(normalized)))
      .map((entry) => entry.tag);
  }

  normalizeResponse(response, input) {
    if (typeof response === "string") {
      return {
        text: response,
        tags: this.detectIntentTags(input),
      };
    }

    return {
      text: response?.text || "",
      tags: Array.isArray(response?.tags)
        ? response.tags
        : this.detectIntentTags(input),
    };
  }

  async loadLocalData() {
    if (this.loadingStarted) return;
    this.loadingStarted = true;

    try {
      const resolveAssetUrl = (assetPathFromRoot) => {
        const scripts = [...document.scripts].filter((s) => s?.src);
        const chatbotScript =
          scripts.find((s) =>
            /\/js\/chatbot\.js($|\?)/.test(s.src.replace(/\\/g, "/")),
          ) || scripts.find((s) => s.src.endsWith("js/chatbot.js"));
        // Intentionally removed document.currentScript as a primary fallback to prioritize explicit detection or the global fallback below

        if (chatbotScript) {
          const scriptUrl = chatbotScript.src;
          const siteRoot = new URL("..", scriptUrl);
          const clean = (assetPathFromRoot || "").replace(/^\//, "");
          return new URL(clean, siteRoot).toString();
        }

        // Fallback: Default to origin + /assets/data/
        // This handles cases where the script tag is not found (e.g. bundling) and ensures functionality on root deployments.
        // For subdirectory deployments (like GitHub Pages), this assumes that the asset path structure follows the domain root.
        const fileName = (assetPathFromRoot || "").split("/").pop();
        return `${window.location.origin}/assets/data/${fileName}`;
      };

      const [resumeRes, projectsRes] = await Promise.all([
        fetch(resolveAssetUrl("assets/data/resume.json"), {
          // "default" = standard HTTP cache (respects Cache-Control / ETag).
          // Previously force-cache caused stale data after deploys.
          cache: "default",
          credentials: "same-origin",
        }),
        fetch(resolveAssetUrl("assets/data/projects.json"), {
          cache: "default",
          credentials: "same-origin",
        }),
      ]);
      if (!resumeRes.ok || !projectsRes.ok)
        throw new Error("Failed to load local JSON data");

      const [resumeJson, projectsJson] = await Promise.all([
        resumeRes.json(),
        projectsRes.json(),
      ]);

      this.resumeJson = resumeJson;
      this.projectsJson = projectsJson;
      this.syncKnowledgeFromResume(resumeJson);
      this.retrieval.buildFromData(resumeJson, projectsJson);
      this.localDataLoaded = true;
    } catch (e) {
      this.localDataLoaded = false;
      this.resumeJson = null;
      this.projectsJson = null;
      this.showDataLoadError();
    }
  }

  /**
   * Inject a visible system notice into the chat when JSON data fails to load.
   * Called only once (guard against duplicates) so the user knows they're in degraded mode.
   */
  showDataLoadError() {
    if (!this.chatMessages) return;
    if (this.chatMessages.querySelector(".chat-system-notice")) return;
    const noticeDiv = document.createElement("div");
    noticeDiv.className = "chat-message bot chat-system-notice";
    noticeDiv.textContent =
      "I\u2019m temporarily unable to load the full knowledge base. I can still answer general questions, but sourced details from the resume and projects won\u2019t be available. Try reloading the page for full functionality.";
    // Prepend so it appears at the top of the message list
    this.chatMessages.prepend(noticeDiv);
  }

  syncKnowledgeFromResume(resumeJson) {
    const pi = resumeJson?.personalInfo;
    if (pi?.name) {
      this.fallback.name = pi.name;
      this.knowledge.name = pi.name;
    }
    if (pi?.title) {
      this.fallback.title = pi.title;
      this.knowledge.title = pi.title;
    }
    if (pi?.location) {
      this.fallback.location = pi.location;
      this.knowledge.location = pi.location;
    }
    if (pi?.email) {
      this.knowledge.email = pi.email;
    }

    const experiences = Array.isArray(resumeJson?.experience)
      ? resumeJson.experience
      : [];

    // Pull the first achievement text from each experience role (most impactful entry per role)
    const achievementTexts = [];
    for (const exp of experiences) {
      const first = (exp.achievements || []).find((a) => a?.text);
      if (first) achievementTexts.push(first.text);
      if (achievementTexts.length >= 5) break;
    }
    if (achievementTexts.length > 0) {
      this.knowledge.achievements = achievementTexts;
    }
  }

  showTyping() {
    this.isTyping = true;
    const typingDiv = document.createElement("div");
    typingDiv.className = "chat-message bot typing-indicator";
    typingDiv.innerHTML = "<span></span><span></span><span></span>";
    typingDiv.id = "typing-indicator";
    this.chatMessages?.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTyping() {
    this.isTyping = false;
    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();
  }

  scrollToBottom() {
    if (this.chatMessages) {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
  }

  generateResponse(input) {
    const q = input.toLowerCase();
    const examples = this.pageConfig.examples.length
      ? this.pageConfig.examples
      : [
          "What roles has Jason had?",
          "What are his top skills?",
          "Tell me about the trading AI system",
          "What is the memoir pipeline project?",
        ];

    // Greetings
    if (q.match(/^(hi|hello|hey|greetings)/)) {
      const mode = this.localDataLoaded
        ? "I can help with focused questions using Jason's local resume, case-study, and project data on this site."
        : "I can still help with general questions, but the local resume and project data did not load.";
      return `Hello. ${this.pageConfig.intro} ${mode}\n\nTry asking:\n- ${examples.join("\n- ")}`;
    }

    // Who is Jason / About
    if (
      q.match(
        /who (is|are) (jason|you)|about (jason|yourself)|tell me about (jason|yourself|your background)/,
      )
    ) {
      if (!this.localDataLoaded || !this.resumeJson?.personalInfo) {
        return `I can\'t access the local resume data right now. Jason Rae is a ${this.fallback.title} based in ${this.fallback.location}.`;
      }
      const pi = this.resumeJson.personalInfo;
      const summary = pi.summary ? `${pi.summary}` : "";
      return `From Jason\'s resume:\n${pi.name} — ${pi.title}${pi.location ? ` (${pi.location})` : ""}\n${summary}`.trim();
    }

    // ── Specific intent branches ────────────────────────────────────────────
    // These run BEFORE the retrieval block so targeted questions (location,
    // services, booking, etc.) always get the curated answer rather than an
    // accidental retrieval snippet.

    // AI software / vendor evaluation
    if (
      q.match(
        /\b(build vs buy|build-or-buy|fine-tun|fine tun|retrieval|rag|api wrapper|openai api|in-house)\b/,
      )
    ) {
      return `The useful question is not only build or buy. It is where the critical decision logic, data sensitivity, review burden, and ongoing operating control should sit.\n\nA fine-tuned agent, a retrieval layer on top of the OpenAI API, and an in-house build solve different problems:\n• Fine-tuning can improve behavior in narrow patterns, but it does not replace workflow control, data governance, or exception handling\n• Retrieval or API-led workflows are often the fastest route when the main need is governed access to trusted knowledge\n• In-house builds make sense when the decision logic, permissions, auditability, or integration burden are too important to outsource\n\nJason usually treats this as AI Software & Vendor Due Diligence if the team is already comparing options, or as part of the Diagnostic Review if the workflow problem is still broader than the tooling choice.`;
    }

    if (
      q.match(
        /\b(vendor|software|platform|copilot|procurement|procure|tooling|vendor diligence|due diligence)\b/,
      )
    ) {
      return `Jason helps teams evaluate what they are actually buying before an AI tool gets embedded into the workflow.\n\nThe key questions are:\n• Is the product fine-tuned, retrieval-based, or mostly a wrapper around a third-party API?\n• Where does company data go, and who can access logs or prompts?\n• What permissions, escalation rules, and failure paths exist?\n• What will real usage cost at production volume?\n• Should this be bought as software, built around the OpenAI API, or kept under tighter internal control?\n\nThe best-fit engagement is usually AI Software & Vendor Due Diligence, or the Diagnostic Review if the workflow problem is still broader than the tooling choice.`;
    }

    // Customer service / headcount / productivity
    if (
      q.match(
        /\b(customer service|support|ticket|tickets|chatbot|helpdesk|headcount|cost reduction|productivity|service team|call center|contact centre)\b/,
      )
    ) {
      return `Jason can help, but he would usually challenge the starting assumption first.\n\nIf the goal is to reduce customer-service cost or headcount, the first question is often not “which chatbot should we buy?” It is:\n• why customers are contacting support in the first place\n• whether the knowledge base is trustworthy enough for automation\n• where handoffs and escalation rules break\n• whether AI removes real work or only creates more review work\n\nAI usually removes tasks before it removes roles, so the better early test is measurable capacity capture, cleaner escalation, and lower avoidable contact volume. A safer path is often ticket-root-cause analysis, internal support copilots, and controlled escalation before customer-facing AI.`;
    }

    // Services / Consulting
    if (q.match(/\b(service|consult|offer|what.*do|how.*can.*help)\b/)) {
      return `Jason offers six core engagements:\n\n• Commercial Analytics Diagnostic Review — the first paid step at EUR 950 net to diagnose where forecasting, pricing, margin, CRM, reporting, service workflow, or AI-tooling trust is breaking\n• AI Software & Vendor Due Diligence — a standalone offer for vendor claims, architecture, data flow, cost, and build-vs-buy fit\n• Decision Opportunity Prioritization Sprint — rank use cases, owners, and the first 90 days\n• Commercial Analytics Foundation Fix — repair KPI logic, Power BI governance, CRM quality, and decision inputs\n• Commercial Workflow Deployment — build one practical, auditable workflow that survives real business complexity\n• Commercial Team Enablement — practical enablement for sales, finance, analysts, managers, and executives\n\nThe public buying path stays simple: Book Fit Call for qualification, then Start Diagnostic Review when the issue is ready for the first paid step.`;
    }

    // Pricing / Rates
    if (q.match(/\b(price|cost|rate|fee|budget|how much|charge)\b/)) {
      return `Jason now shows only the first paid step publicly.\n\n• Book Fit Call: qualification only\n• Commercial Analytics Diagnostic Review: EUR 950 net\n• AI Software & Vendor Due Diligence: available, but not publicly priced in this phase\n• Larger sprints, builds, and retainers: scoped after diagnosis\n\nThat pricing structure is deliberate. It lowers friction for the first serious step without pretending a responsible implementation quote exists before the workflow, data burden, operating risk, and decision owner are clear.`;
    }

      // Book a fit call / choose the next step
    if (
      q.match(
        /\b(book|schedule|calendly|appointment)\b|\bhow.{0,20}\b(call|meet|speak)\b/,
      )
    ) {
      return `To book a fit call or route the right next step:\n\n1. Visit the Contact page on this site\n2. Share the primary issue, desired outcome, and preferred first step\n3. Jason will reply within 24–48 hours to recommend the right route\n\nThat usually starts with a short fit call or goes straight into the EUR 950 net Commercial Analytics Diagnostic Review if the issue already looks clear enough. From there, Jason can scope vendor diligence, a prioritization sprint, a build discussion, enablement, or a hiring follow-up. Or email ${this.knowledge.email} directly if you prefer.`;
    }

    // Availability / Open to opportunities
    if (
      q.match(
        /\b(available|freelance|contract|open to|looking for|hire|opportunity)\b/,
      )
    ) {
      return `Jason is open to both consulting engagements and senior full-time opportunities in data science and AI leadership. He's based in ${this.knowledge.location} and works with clients across Europe and globally (mostly remote). Use the contact form to book a fit call, route the right offer, or start a hiring conversation.`;
    }

    // Location / Timezone
    if (
      q.match(
        /\b(where|location|based|live|city|country|timezone|time.?zone|cet|utc)\b/,
      )
    ) {
      return `Jason is based in Stuttgart, Germany (Central European Time — CET/CEST, UTC+1/UTC+2). He works primarily with European clients but collaborates with teams globally via video calls and async workflows. On-site engagements are available across the DACH region.`;
    }

    // Contact information
    if (q.match(/\b(contact|reach|email|linkedin|github)\b/)) {
      return `You can reach Jason at:\n\n• Email: ${this.knowledge.email}\n• LinkedIn: https://www.linkedin.com/in/jason-c-rae/\n• GitHub: https://github.com/JSunRae\n• Contact form on this site\n\nHe typically responds within 24–48 hours.`;
    }

    // Languages spoken
    if (
      q.match(
        /\b(language|speak|spoken|german|english|fluent|bilingual|multilingual)\b/,
      )
    ) {
      if (this.resumeJson?.languages?.length) {
        const langs = this.resumeJson.languages
          .map((l) => `${l.name} (${l.level})`)
          .join(", ");
        return `From the resume: ${langs}.`;
      }
      return `Jason is a native English speaker and has working proficiency in German — useful for stakeholder communication across DACH markets.`;
    }

    // Achievements / Results
    if (q.match(/\b(achievement|result|accomplish|impact|success|metric)\b/)) {
      const list = Array.isArray(this.knowledge.achievements)
        ? this.knowledge.achievements
        : Object.values(this.knowledge.achievements);
      return `Key achievements include:\n\n${list.map((a) => `• ${a}`).join("\n")}`;
    }

    // AI Training / Workshops (tightened to avoid matching "machine learning" queries)
    if (
      q.match(
        /\b(workshop|upskill|ai training|training programme|training program|learn python|learn ai|teach team)\b/,
      )
    ) {
      return `Jason offers AI training for commercial teams covering: what AI can and cannot do in business environments, safe LLM use with company data, deterministic workflow design, AI in forecasting, pricing, CRM, and reporting, plus use-case identification with real ROI. He has built enterprise AI training programmes from scratch, including a European initiative at Medline. If you want training for your team, use the contact form to outline the audience and outcome.`;
    }

    // Thanks
    if (q.match(/\bthank|\bthanks|\bthx\b/)) {
      return `You\'re welcome. Want to ask about experience, skills, or projects?\n\nExamples:\n- ${examples.join("\n- ")}`;
    }

    // Goodbye
    if (q.match(/\bbye\b|\bgoodbye\b|see you|\blater\b/)) {
      return `Thanks for chatting. If you\'d like to continue, book a Fit Call or use the contact page to start a Diagnostic Review.`;
    }

    // ── Local retrieval (open-ended experience / skills / project questions) ──
    if (this.localDataLoaded) {
      const wantsProjects =
        /\b(project|portfolio|built|created|case study|demo)\b/.test(q);
      const wantsSkills =
        /\b(skill|skills|tool|tools|stack|technology|technologies|daily ai|framework|languages?)\b/.test(
          q,
        );
      const wantsExperience =
        /\b(experience|background|career|history|work|role|roles|job|jobs|company|companies)\b/.test(
          q,
        );

      const results = this.retrieval.search(input, { limit: 6 });
      const filtered = results
        .filter((r) => {
          if (wantsProjects)
            return r.source === "projects" || r.section === "personal-project";
          if (wantsSkills)
            return r.section === "skills" || r.section === "daily-stack";
          if (wantsExperience)
            return r.section === "experience" || r.section === "summary";
          return (
            r.section === "experience" ||
            r.section === "project" ||
            r.section === "case-study" ||
            r.section === "personal-project" ||
            r.section === "skills" ||
            r.section === "daily-stack" ||
            r.section === "summary"
          );
        })
        .slice(0, 4);

      if (filtered.length) {
        const lines = filtered.map((d) => {
          const where = d.source === "resume" ? "Resume" : "Projects";
          const snip = this.retrieval.snippet(d, input);
          return `- ${where}: ${d.title}\n  ${snip}`;
        });

        // If the user asked broadly, add a small grounded summary pulled from the resume.
        let header = "";
        if (wantsExperience && this.resumeJson?.experience?.length) {
          const current =
            this.resumeJson.experience.find((e) => e.current) ||
            this.resumeJson.experience[0];
          header = current
            ? `From the resume, current role: ${current.title} at ${current.company}.\n\n`
            : "";
        }
        if (wantsSkills && this.resumeJson?.skills) {
          const topSkills = [];
          Object.values(this.resumeJson.skills).forEach((cat) => {
            (cat.items || [])
              .slice(0, 2)
              .forEach((i) => i?.name && topSkills.push(i.name));
          });
          header = topSkills.length
            ? `From the resume, skills include: ${topSkills.slice(0, 8).join(", ")}.\n\n`
            : header;
        }
        if (wantsProjects && this.projectsJson?.projects?.length) {
          header = `From the portfolio data, here are the closest matches:\n\n`;
        }

        return `${header}${lines.join("\n")}`.trim();
      }
    }

    // Default / Unknown
    if (!this.localDataLoaded) {
      return `I couldn\'t load the local resume/project data, so I can\'t give sourced answers right now.\n\nTry reloading the page, or ask one of these:\n- ${examples.join("\n- ")}`;
    }
    return `I didn\'t find a strong match in the local resume/project data.\n\nTry one of these:\n- ${examples.join("\n- ")}`;
  }
}

// Initialize chatbot when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ChatBot();
});
// Typing-indicator and bounce-animation styles live in css/components.css
