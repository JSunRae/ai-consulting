/**
 * Sitewide decision-field experience.
 * Homepage keeps the immersive staged network.
 * All other pages render a full-viewport background field that can converge
 * toward hovered or focused controls.
 */

(function decisionFieldModule() {
	const DOMAIN_DEFINITIONS = [
		{ key: "forecasting", aliases: ["forecast", "pipeline", "demand", "outlook"], vocabulary: ["Drive growth", "Faster commits", "Clearer outlook", "Stronger pipeline"], labelOffset: { x: 18, y: -26 } },
		{ key: "pricing", aliases: ["price", "quote", "discount"], vocabulary: ["Protect margin", "Quote faster", "Raise win rate", "Smarter pricing"], labelOffset: { x: 18, y: -12 } },
		{ key: "margin", aliases: ["margin", "profit", "mix", "p&l", "pnl"], vocabulary: ["Recover profit", "Lift efficiency", "Reduce leakage", "Improve mix"], labelOffset: { x: 18, y: 10 } },
		{ key: "crm", aliases: ["crm", "salesforce", "opportunity", "pipeline hygiene"], vocabulary: ["Reduce turnover", "Better handoffs", "Higher adoption", "Cleaner pipeline"], labelOffset: { x: 12, y: 16 } },
		{ key: "governance", aliases: ["governance", "control", "compliance", "audit", "policy"], vocabulary: ["Trusted numbers", "Lower risk", "Less friction", "Board-ready clarity"], labelOffset: { x: -120, y: -18 } },
		{ key: "execution", aliases: ["execution", "enablement", "operations", "cadence", "decision"], vocabulary: ["Increase efficiency", "Faster decisions", "Operational lift", "Scalable execution"], labelOffset: { x: -84, y: 16 } },
	];

	const PHRASE_MAPPINGS = [
		// Preserve legacy health-check phrasing so older links and prompts still resolve.
		{ pattern: /book fit call|book health check|health check|diagnostic review|start diagnostic review|start with discovery/i, keyword: "forecast risk review", domainIndex: 0 },
		{ pattern: /plan the sprint|prioritization sprint|decision opportunity/i, keyword: "decision backlog triage", domainIndex: 5 },
		{ pattern: /fix the foundation|foundation/i, keyword: "kpi governance reset", domainIndex: 4 },
		{ pattern: /launch first workflow|workflow deployment|launch workflow/i, keyword: "workflow automation lane", domainIndex: 5 },
		{ pattern: /plan enablement|enablement/i, keyword: "commercial adoption plan", domainIndex: 5 },
		{ pattern: /request scheduling link/i, keyword: "commercial intake", domainIndex: 4 },
		{ pattern: /send message/i, keyword: "advisory intake", domainIndex: 4 },
		{ pattern: /forecasting issues/i, keyword: "forecast variance", domainIndex: 0 },
		{ pattern: /pricing or margin/i, keyword: "margin leakage", domainIndex: 2 },
		{ pattern: /open the archive/i, keyword: "signal archive", domainIndex: 5 },
		{ pattern: /review proof of work|view proof of work/i, keyword: "case study evidence", domainIndex: 5 },
	];

	const HOVER_SURFACE_SELECTOR = [
		".project-card",
		".compact-project-card",
		".stack-item",
		".stack-featured",
		".projects-cta-panel",
		".hero-panel",
		".hero-recruiter-card",
		".hero-cta",
		".newsletter-card",
		".newsletter-box",
		".timeline-item",
		".card",
		".value-card",
		".page-intro-panel",
		".process-step",
		".lead-magnet-card",
		".lead-magnet-actions",
		".service-card",
		".contact-info-card",
		".contact-form-card",
		".contact-method",
		".blog-card",
		".blog-hero",
		".social-summary-card",
		".social-filter-toolbar",
		".social-archive-callout",
	].join(", ");

	const SERVICE_PARAM_MAPPINGS = {
		"health-check": { keyword: "forecast risk review", domainIndex: 0 },
		roadmap: { keyword: "decision backlog triage", domainIndex: 5 },
		foundation: { keyword: "kpi governance reset", domainIndex: 4 },
		"use-case": { keyword: "workflow automation lane", domainIndex: 5 },
		training: { keyword: "commercial adoption plan", domainIndex: 5 },
	};

	const DEFAULT_DECISION_FIELD_CONFIG = {
		readabilityGuardEnabled: true,
		maskWordsNearText: true,
		dimNetworkNearText: true,
	};

	const DECISION_FIELD_CONFIG = Object.assign(
		{},
		DEFAULT_DECISION_FIELD_CONFIG,
		window.__decisionFieldConfig || {},
	);
	window.__decisionFieldConfig = DECISION_FIELD_CONFIG;

	const KEYWORD_FALLBACKS = {
		services: { keyword: "governance design", domainIndex: 4 },
		contact: { keyword: "commercial brief", domainIndex: 4 },
		portfolio: { keyword: "decision systems", domainIndex: 5 },
		resume: { keyword: "operator record", domainIndex: 5 },
		about: { keyword: "leadership path", domainIndex: 5 },
		blog: { keyword: "applied insight", domainIndex: 0 },
		chatbot: { keyword: "knowledge retrieval", domainIndex: 3 },
		ai: { keyword: "applied ai", domainIndex: 5 },
		analytics: { keyword: "analytics control", domainIndex: 0 },
		reporting: { keyword: "executive reporting", domainIndex: 0 },
	};

	class DecisionFieldExperience {
		constructor() {
			this.stage = document.getElementById("decision-stage");
			this.mode = this.stage ? "stage" : "background";
			this.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
			this.mobileQuery = window.matchMedia("(max-width: 767px)");

			this.canvas = null;
			this.context = null;
			this.toggle = null;
			this.phaseLabel = null;
			this.focusLabel = null;
			this.focusMarker = null;
			this.labelNodes = [];
			this.wordNodes = [];
			this.readabilityZones = [];
			this.sectionSignals = [];
			this.overlay = null;
			this.focusControl = null;
			this.focusAnchor = null;
			this.focusAnchorTarget = null;
			this.config = DECISION_FIELD_CONFIG;

			this.metrics = {
				width: 0,
				height: 0,
				viewportHeight: window.innerHeight,
				top: 0,
				heightTotal: 0,
				hub: { x: 0, y: 0 },
			};

			this.state = {
				scrollProgress: 0,
				clusterProgress: 0,
				weightProgress: 0,
				clarityProgress: 0,
				collapse: 0,
				collapseTarget: 0,
				focusStrength: 0,
				focusTarget: 0,
				focusDomainIndex: null,
				sectionDomainIndex: null,
				sectionStrength: 0,
				visibility: 1,
				isVisible: true,
				collapseSpeed: 0.04,
				focusSpeed: 0.06,
			};

			this.manualCollapse = 0;
			this.frameHandle = null;
			this.lastFrameTime = 0;
			this.frameInterval = 1000 / 60;
			this.focusResetHandle = null;
			this.focusKeyword = "Awaiting active signal";

			this.setupContainer();
			if (!this.canvas) {
				return;
			}

			this.context = this.canvas.getContext("2d");
			if (!this.context) {
				return;
			}

			this.mobile = this.mobileQuery.matches;
			this.pixelRatio = Math.min(window.devicePixelRatio || 1, this.mobile ? 1.2 : 1.75);
			this.frameInterval = this.mobile ? 1000 / 30 : 1000 / 60;
			this.domains = this.createDomains();
			this.nodes = this.createNodes();
			this.wordNodes = this.createWordNodes();

			if (this.prefersReducedMotion.matches) {
				this.enterReducedMotionMode();
				this.bindPassiveFocusEvents();
				return;
			}

			this.bindEvents();
			this.updateMeasurements();
			this.updateStateFromContext();
			if (this.stage) {
				this.stage.dataset.networkMode = "live";
			}
			this.start();
		}

		setupContainer() {
			if (this.stage) {
				this.canvas = document.getElementById("decision-network-canvas");
				this.toggle = document.getElementById("decision-network-toggle");
				this.phaseLabel = document.getElementById("decision-network-phase");
				this.focusLabel = document.getElementById("decision-network-focus");
				this.labelNodes = Array.from(document.querySelectorAll(".decision-network-label"));
				this.stage.dataset.networkMode = "ready";
				return;
			}

			const existing = document.querySelector("[data-decision-field-overlay]");
			if (existing) {
				this.overlay = existing;
			} else {
				this.overlay = document.createElement("div");
				this.overlay.className = "decision-field-background";
				this.overlay.setAttribute("data-decision-field-overlay", "true");
				this.overlay.setAttribute("aria-hidden", "true");
				this.overlay.innerHTML = `
					<canvas class="decision-field-canvas" data-decision-field-canvas></canvas>
					<div class="decision-field-hud">
						<span class="decision-field-eyebrow">Live decision field</span>
						<span class="decision-field-phase" data-decision-field-phase>Signal scan</span>
						<span class="decision-field-keyword" data-decision-field-keyword>Awaiting active signal</span>
					</div>
					<div class="decision-field-focus-marker" data-decision-field-focus-marker hidden></div>
				`;
				document.body.appendChild(this.overlay);
			}

			this.canvas = this.overlay.querySelector("[data-decision-field-canvas]");
			this.phaseLabel = this.overlay.querySelector("[data-decision-field-phase]");
			this.focusLabel = this.overlay.querySelector("[data-decision-field-keyword]");
			this.focusMarker = this.overlay.querySelector("[data-decision-field-focus-marker]");
		}

		enterReducedMotionMode() {
			if (this.stage) {
				this.stage.dataset.networkMode = "reduced";
			}
			if (this.canvas) {
				this.canvas.style.display = "none";
			}
			if (this.toggle) {
				this.toggle.hidden = true;
			}
			if (this.focusMarker) {
				this.focusMarker.hidden = true;
			}
			if (this.phaseLabel) {
				this.phaseLabel.textContent = "Calm layout";
			}
			this.updateFocusLabel(this.focusKeyword);
		}

		bindPassiveFocusEvents() {
			document.addEventListener("focusin", (event) => {
				const signal = this.extractSignal(event.target);
				if (signal) {
					this.updateFocusLabel(signal.label);
					this.updateFocusMarker(signal);
				}
			});
		}

		bindEvents() {
			this.handleResize = this.handleResize.bind(this);
			this.handleScroll = this.handleScroll.bind(this);
			this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
			this.handleToggle = this.handleToggle.bind(this);
			this.handleMotionChange = this.handleMotionChange.bind(this);
			this.handlePointerOver = this.handlePointerOver.bind(this);
			this.handlePointerOut = this.handlePointerOut.bind(this);
			this.handleFocusIn = this.handleFocusIn.bind(this);
			this.handleFocusOut = this.handleFocusOut.bind(this);
			this.animate = this.animate.bind(this);

			window.addEventListener("resize", this.handleResize, { passive: true });
			window.addEventListener("scroll", this.handleScroll, { passive: true });
			document.addEventListener("visibilitychange", this.handleVisibilityChange);
			this.prefersReducedMotion.addEventListener("change", this.handleMotionChange);
			this.mobileQuery.addEventListener("change", this.handleResize);
			document.addEventListener("pointerover", this.handlePointerOver, true);
			document.addEventListener("pointerout", this.handlePointerOut, true);
			document.addEventListener("focusin", this.handleFocusIn);
			document.addEventListener("focusout", this.handleFocusOut);

			if (this.stage) {
				this.visibilityObserver = new IntersectionObserver(
					(entries) => {
						const entry = entries[0];
						this.state.isVisible = Boolean(entry?.isIntersecting);
						if (this.state.isVisible) {
							this.start();
						}
					},
					{ threshold: 0 },
				);
				this.visibilityObserver.observe(this.stage);
			}

			if (this.toggle) {
				this.toggle.addEventListener("click", this.handleToggle);
			}
		}

		handleMotionChange(event) {
			if (event.matches) {
				this.stop();
				this.enterReducedMotionMode();
				return;
			}

			if (this.canvas) {
				this.canvas.style.display = "";
			}
			this.mobile = this.mobileQuery.matches;
			this.pixelRatio = Math.min(window.devicePixelRatio || 1, this.mobile ? 1.2 : 1.75);
			this.frameInterval = this.mobile ? 1000 / 30 : 1000 / 60;
			this.nodes = this.createNodes();
			this.wordNodes = this.createWordNodes();
			this.updateMeasurements();
			this.updateStateFromContext();
			this.start();
		}

		handleResize() {
			if (this.prefersReducedMotion.matches) {
				return;
			}

			this.mobile = this.mobileQuery.matches;
			this.pixelRatio = Math.min(window.devicePixelRatio || 1, this.mobile ? 1.2 : 1.75);
			this.frameInterval = this.mobile ? 1000 / 30 : 1000 / 60;
			this.nodes = this.createNodes();
			this.wordNodes = this.createWordNodes();
			this.updateMeasurements();
			this.updateStateFromContext();
			this.render(performance.now());
		}

		handleScroll() {
			this.updateStateFromContext();
			this.start();
		}

		handleVisibilityChange() {
			if (document.hidden) {
				this.stop();
				return;
			}

			this.start();
		}

		handleToggle() {
			this.manualCollapse = this.manualCollapse > 0.5 ? 0 : 1;
			if (this.toggle) {
				this.toggle.setAttribute("aria-pressed", this.manualCollapse ? "true" : "false");
				this.toggle.textContent = this.manualCollapse ? "Expand network" : "Collapse network";
			}
			this.updateStateFromContext();
			this.start();
		}

		handlePointerOver(event) {
			const signal = this.extractSignal(event.target);
			if (signal) {
				this.applyFocusSignal(signal);
			}
		}

		handlePointerOut(event) {
			const control = this.getSignalTarget(event.target);
			if (!control) {
				return;
			}

			const nextControl = this.getSignalTarget(event.relatedTarget);
			if (nextControl !== control) {
				this.scheduleFocusReset();
			}
		}

		handleFocusIn(event) {
			const signal = this.extractSignal(event.target);
			if (signal) {
				this.applyFocusSignal(signal);
			}
		}

		handleFocusOut() {
			this.scheduleFocusReset();
		}

		scheduleFocusReset() {
			window.clearTimeout(this.focusResetHandle);
			this.focusResetHandle = window.setTimeout(() => {
				this.focusControl = null;
				this.focusAnchor = null;
				this.focusAnchorTarget = null;
				this.state.focusTarget = 0;
				this.state.focusDomainIndex = null;
				this.state.collapseSpeed = 0.04;
				this.state.focusSpeed = 0.06;
				this.focusKeyword = "Awaiting active signal";
				if (this.focusMarker) {
					this.focusMarker.hidden = true;
				}
				this.updateStateFromContext();
				this.start();
			}, 140);
		}

		applyFocusSignal(signal) {
			window.clearTimeout(this.focusResetHandle);
			this.focusControl = signal.control;
			if (!this.focusAnchor) {
				this.focusAnchor = { ...signal.anchor };
			}
			this.focusAnchorTarget = { ...signal.anchor };
			this.focusKeyword = signal.label;
			this.state.focusDomainIndex = signal.domainIndex;
			this.state.focusTarget = signal.kind === "surface" ? 0.84 : 1;
			this.state.collapseSpeed = signal.kind === "surface" ? 0.024 : 0.04;
			this.state.focusSpeed = signal.kind === "surface" ? 0.036 : 0.06;
			this.updateStateFromContext();
			this.updateFocusMarker(signal);
			this.start();
		}

		getSignalTarget(target) {
			if (!(target instanceof Element)) {
				return null;
			}

			return this.getInteractiveControl(target) || this.getHoverSurface(target);
		}

		getSignalContext(target) {
			if (!(target instanceof Element)) {
				return null;
			}

			return this.getHoverSurface(target) || target.closest("section, article, aside");
		}

		getHoverSurface(target) {
			if (!(target instanceof Element)) {
				return null;
			}

			return target.closest(HOVER_SURFACE_SELECTOR);
		}

		updateFocusMarker(signal) {
			if (!this.focusMarker || this.mode === "stage") {
				return;
			}

			if (!signal.anchor) {
				this.focusMarker.hidden = true;
				return;
			}

			this.focusMarker.hidden = false;
			this.focusMarker.textContent = signal.label;
			this.focusMarker.style.transform = `translate(${signal.anchor.x + 12}px, ${signal.anchor.y - 34}px)`;
		}

		getInteractiveControl(target) {
			if (!(target instanceof Element)) {
				return null;
			}

			return target.closest('a[href], button, .btn, [role="button"], input[type="submit"], input[type="button"], [data-filter], [data-category]');
		}

		extractSignal(target) {
			const control = this.getInteractiveControl(target);
			const surface = control ? null : this.getHoverSurface(target);
			const source = control || surface;
			if (!source) {
				return null;
			}
			const context = this.getSignalContext(target) || this.getSignalContext(source);

			const candidates = [];
			const text = this.getSignalText(source, Boolean(surface));
			const aria = source.getAttribute("aria-label");
			const dataKeyword = source.getAttribute("data-network-keyword");
			const dataCategory = source.getAttribute("data-category") || source.getAttribute("data-filter");
			const href = source.getAttribute("href");
			const contextKeyword = context?.getAttribute("data-network-keyword");
			const contextCategory = context?.getAttribute("data-category") || context?.getAttribute("data-filter");
			const contextText = context && context !== source ? this.getSignalText(context, true) : "";

			[dataKeyword, dataCategory, aria, text].forEach((value) => {
				if (value) {
					candidates.push(value);
				}
			});

			[contextKeyword, contextCategory, contextText].forEach((value) => {
				if (value) {
					candidates.push(value);
				}
			});

			if (href) {
				candidates.push(href.replace(/[\/#?=&_-]+/g, " "));
			}

			const joined = candidates.join(" ");
			const lowered = candidates.join(" ").toLowerCase();
			let domainIndex = null;
			let keyword = "";

			const serviceSignal = this.getServiceParamSignal(href);
			if (serviceSignal) {
				keyword = serviceSignal.keyword;
				domainIndex = serviceSignal.domainIndex;
			}

			const mappedPhrase = PHRASE_MAPPINGS.find((entry) => entry.pattern.test(joined));
			if (mappedPhrase && domainIndex === null) {
				keyword = mappedPhrase.keyword;
				domainIndex = mappedPhrase.domainIndex;
			}

			DOMAIN_DEFINITIONS.forEach((domain, index) => {
				if (domainIndex !== null) {
					return;
				}

				const matched = [domain.key, ...domain.aliases].find((token) => lowered.includes(token));
				if (matched) {
					domainIndex = index;
					keyword = matched;
				}
			});

			if (domainIndex === null) {
				const fallbackKey = Object.keys(KEYWORD_FALLBACKS).find((key) => lowered.includes(key));
				if (fallbackKey) {
					keyword = KEYWORD_FALLBACKS[fallbackKey].keyword;
					domainIndex = KEYWORD_FALLBACKS[fallbackKey].domainIndex;
				}
			}

			const anchorSource = control && context ? context : source;
			const rect = anchorSource.getBoundingClientRect();
			return {
				control: source,
				kind: surface ? "surface" : "control",
				label: this.formatKeyword(keyword || text || aria || dataCategory || dataKeyword || "active signal"),
				domainIndex,
				anchor: {
					x: rect.left + rect.width / 2,
					y: rect.top + rect.height / 2,
				},
			};
		}

		getSignalText(source, isSurface) {
			if (!source) {
				return "";
			}

			let preferredText = null;
			if (isSurface) {
				const preferredSelectors = [
					"h1",
					"h2",
					"h3",
					".project-title",
					".stack-name",
					".timeline-title",
					".section-title",
					".hero-panel-title",
					".stack-point-label",
					".section-label",
					".badge",
					".project-type",
				];

				for (const selector of preferredSelectors) {
					const element = source.querySelector(selector);
					if (element?.textContent?.trim()) {
						preferredText = element.textContent;
						break;
					}
				}
			}
			return (preferredText || source.textContent || "").replace(/\s+/g, " ").trim();
		}

		formatKeyword(value) {
			const cleaned = String(value)
				.replace(/\s+/g, " ")
				.replace(/[|:]+/g, " ")
				.trim();

			if (!cleaned) {
				return "Active signal";
			}

			return cleaned.split(" ").filter(Boolean).slice(0, 3).join(" ");
		}

		getServiceParamSignal(href) {
			if (!href) {
				return null;
			}

			try {
				const url = new URL(href, window.location.href);
				const service = url.searchParams.get("service");
				return service ? SERVICE_PARAM_MAPPINGS[service] || null : null;
			} catch {
				return null;
			}
		}

		inferDomainSignal(text) {
			const lowered = String(text || "").toLowerCase();
			if (!lowered.trim()) {
				return null;
			}

			for (let index = 0; index < DOMAIN_DEFINITIONS.length; index += 1) {
				const domain = DOMAIN_DEFINITIONS[index];
				const matched = [domain.key, ...domain.aliases].find((token) => lowered.includes(token));
				if (matched) {
					return { domainIndex: index, keyword: matched };
				}
			}

			const fallbackKey = Object.keys(KEYWORD_FALLBACKS).find((key) => lowered.includes(key));
			if (fallbackKey) {
				return KEYWORD_FALLBACKS[fallbackKey];
			}

			return null;
		}

		createDomains() {
			return DOMAIN_DEFINITIONS.map((definition, index) => ({
				...definition,
				index,
				current: { x: 0, y: 0 },
				labelOpacity: 0.3,
			}));
		}

		createNodes() {
			const nodeCount = this.mode === "stage" ? (this.mobile ? 18 : 38) : (this.mobile ? 26 : 56);
			const nodes = [];

			for (let index = 0; index < nodeCount; index += 1) {
				const domainIndex = index % DOMAIN_DEFINITIONS.length;
				const isLead = index < DOMAIN_DEFINITIONS.length * (this.mode === "stage" ? 1 : 2);
				nodes.push({
					domainIndex,
					orbit: this.mode === "stage" ? 24 + Math.random() * (this.mobile ? 42 : 74) : 34 + Math.random() * (this.mobile ? 58 : 110),
					angle: Math.random() * Math.PI * 2,
					driftOffsetX: Math.random() * 400,
					driftOffsetY: Math.random() * 400,
					scatterX: this.mode === "stage" ? 0.44 + Math.random() * 0.48 : 0.06 + Math.random() * 0.88,
					scatterY: this.mode === "stage" ? 0.14 + Math.random() * 0.7 : 0.08 + Math.random() * 0.82,
					currentX: 0,
					currentY: 0,
					size: isLead ? 2.7 + Math.random() * 0.4 : 1.2 + Math.random() * 1.2,
					speed: 0.00018 + Math.random() * 0.00028,
					isLead,
				});
			}

			return nodes;
		}

		createWordNodes() {
			const words = [];

			DOMAIN_DEFINITIONS.forEach((domain, domainIndex) => {
				domain.vocabulary.forEach((word, index) => {
					words.push({
						domainIndex,
						text: word,
						orbit: this.mode === "stage" ? 48 + index * 16 : 68 + index * 24,
						angleOffset: (Math.PI * 2 * index) / domain.vocabulary.length,
						wobble: 0.00008 + index * 0.000012,
						wobbleOffset: Math.random() * 300,
					});
				});
			});

			return words;
		}

		updateMeasurements() {
			let rect;
			if (this.mode === "stage") {
				const sticky = this.stage.querySelector(".decision-stage-sticky");
				rect = sticky ? sticky.getBoundingClientRect() : this.stage.getBoundingClientRect();
				const stageRect = this.stage.getBoundingClientRect();
				this.metrics.top = stageRect.top + window.scrollY;
				this.metrics.heightTotal = this.stage.offsetHeight;
			} else {
				rect = {
					width: window.innerWidth,
					height: window.innerHeight,
				};
				this.metrics.top = 0;
				this.metrics.heightTotal = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, window.innerHeight);
			}

			this.metrics.width = Math.max(Math.round(rect.width), 1);
			this.metrics.height = Math.max(Math.round(rect.height), 1);
			this.metrics.viewportHeight = window.innerHeight;
			this.metrics.hub = this.getBaseHub();

			this.canvas.width = Math.round(this.metrics.width * this.pixelRatio);
			this.canvas.height = Math.round(this.metrics.height * this.pixelRatio);
			this.canvas.style.width = `${this.metrics.width}px`;
			this.canvas.style.height = `${this.metrics.height}px`;

			this.context.setTransform(1, 0, 0, 1, 0, 0);
			this.context.scale(this.pixelRatio, this.pixelRatio);
			this.updateReadabilityZones();
			this.collectSectionSignals();
		}

		collectSectionSignals() {
			if (this.mode === "stage") {
				this.sectionSignals = [];
				return;
			}

			const sections = Array.from(document.querySelectorAll("main section, body > section"));
			this.sectionSignals = sections
				.map((section) => {
					const source = section.querySelector("h1, h2, h3, .section-title, .section-subtitle, .section-label, p")?.textContent || section.textContent;
					const signal = this.inferDomainSignal(source);
					return signal ? { element: section, domainIndex: signal.domainIndex } : null;
				})
				.filter(Boolean);
		}

		updateSectionFocus() {
			if (this.mode === "stage" || !this.sectionSignals.length) {
				this.state.sectionDomainIndex = null;
				this.state.sectionStrength = 0;
				return;
			}

			const viewportCenter = window.innerHeight * 0.45;
			let bestSignal = null;
			let bestDistance = Number.POSITIVE_INFINITY;

			this.sectionSignals.forEach((signal) => {
				const rect = signal.element.getBoundingClientRect();
				if (rect.bottom < 0 || rect.top > window.innerHeight) {
					return;
				}

				const center = rect.top + rect.height / 2;
				const distance = Math.abs(center - viewportCenter);
				if (distance < bestDistance) {
					bestDistance = distance;
					bestSignal = signal;
				}
			});

			if (!bestSignal) {
				this.state.sectionDomainIndex = null;
				this.state.sectionStrength = 0;
				return;
			}

			this.state.sectionDomainIndex = bestSignal.domainIndex;
			this.state.sectionStrength = this.clamp(1 - bestDistance / (window.innerHeight * 0.7), 0, 0.48);
		}

		updateReadabilityZones() {
			if (this.mode === "stage" || !this.config.readabilityGuardEnabled) {
				this.readabilityZones = [];
				return;
			}

			const selectors = [
				"h1",
				"h2",
				"h3",
				".section-title",
				".section-subtitle",
				".lead",
				".page-intro",
				".page-intro-panel",
				".social-archive-callout",
				".blog-card",
				".card",
				".value-card",
				".process-step",
				".process-intro",
				".contact-info-card",
			];

			this.readabilityZones = Array.from(document.querySelectorAll(selectors.join(", ")))
				.map((element) => {
					const rect = element.getBoundingClientRect();
					if (rect.width < 120 || rect.height < 28 || rect.bottom < -40 || rect.top > window.innerHeight + 40) {
						return null;
					}

					const isHeading = /^H[1-3]$/.test(element.tagName);
					const paddingX = isHeading ? 28 : 18;
					const paddingY = isHeading ? 18 : 14;
					const area = rect.width * rect.height;
					if (area > window.innerWidth * window.innerHeight * 0.55) {
						return null;
					}

					return {
						left: rect.left - paddingX,
						top: rect.top - paddingY,
						right: rect.right + paddingX,
						bottom: rect.bottom + paddingY,
						strength: isHeading ? 0.92 : 0.74,
					};
				})
				.filter(Boolean);
		}

		getReadabilityFactor(x, y, radius = 0) {
			if (this.mode === "stage" || !this.config.readabilityGuardEnabled || !this.readabilityZones.length) {
				return 1;
			}

			let factor = 1;
			const padding = Math.max(radius, 0);

			for (const zone of this.readabilityZones) {
				const expandedLeft = zone.left - padding;
				const expandedTop = zone.top - padding;
				const expandedRight = zone.right + padding;
				const expandedBottom = zone.bottom + padding;

				if (x >= expandedLeft && x <= expandedRight && y >= expandedTop && y <= expandedBottom) {
					return Math.min(factor, 0.36 * zone.strength);
				}

				const nearestX = this.clamp(x, expandedLeft, expandedRight);
				const nearestY = this.clamp(y, expandedTop, expandedBottom);
				const distance = Math.hypot(x - nearestX, y - nearestY);
				const softness = 120;
				const zoneFactor = 0.36 * zone.strength + this.clamp(distance / softness, 0, 1) * 0.64;
				factor = Math.min(factor, zoneFactor);
			}

			return this.clamp(factor, 0.18, 1);
		}

		getSectionBias(domainIndex) {
			if (this.mode === "stage" || this.state.sectionDomainIndex === null) {
				return 0;
			}

			return this.state.sectionDomainIndex === domainIndex ? this.state.sectionStrength : 0;
		}

		getBaseHub() {
			if (this.mode === "stage") {
				return {
					x: this.metrics.width * (this.mobile ? 0.56 : 0.6),
					y: this.metrics.height * (this.mobile ? 0.42 : 0.46),
				};
			}

			return {
				x: this.metrics.width * (0.52 + Math.sin(window.scrollY * 0.0003) * 0.04),
				y: this.metrics.height * (0.38 + Math.cos(window.scrollY * 0.00024) * 0.05),
			};
		}

		getActiveHub() {
			if (!this.focusAnchor || this.state.focusStrength < 0.02) {
				return this.metrics.hub;
			}

			return {
				x: this.mix(this.metrics.hub.x, this.focusAnchor.x, this.state.focusStrength * 0.72),
				y: this.mix(this.metrics.hub.y, this.focusAnchor.y, this.state.focusStrength * 0.72),
			};
		}

		updateFocusAnchor() {
			if (!this.focusAnchorTarget) {
				return;
			}

			if (!this.focusAnchor) {
				this.focusAnchor = { ...this.focusAnchorTarget };
				return;
			}

			this.focusAnchor.x += (this.focusAnchorTarget.x - this.focusAnchor.x) * 0.16;
			this.focusAnchor.y += (this.focusAnchorTarget.y - this.focusAnchor.y) * 0.16;
		}

		updateStateFromContext() {
			this.updateReadabilityZones();
			this.updateSectionFocus();

			if (this.mode === "stage") {
				const availableDistance = Math.max(this.metrics.heightTotal - this.metrics.viewportHeight * 0.6, 1);
				const offset = window.scrollY + this.metrics.viewportHeight * 0.18 - this.metrics.top;
				const rawProgress = offset / availableDistance;
				this.state.scrollProgress = this.clamp(rawProgress, 0, 1);
				this.state.clusterProgress = this.smoothStep(0.08, 0.42, this.state.scrollProgress);
				this.state.weightProgress = this.smoothStep(0.38, 0.74, this.state.scrollProgress);
				this.state.clarityProgress = this.smoothStep(0.68, 0.96, this.state.scrollProgress);
				this.state.visibility = 1 - this.smoothStep(0.88, 1, this.state.scrollProgress) * 0.18;
			} else {
				const scrollable = Math.max(this.metrics.heightTotal - window.innerHeight, 1);
				this.state.scrollProgress = this.clamp(window.scrollY / scrollable, 0, 1);
				this.state.clusterProgress = 0.14 + this.smoothStep(0.02, 0.72, this.state.scrollProgress) * 0.46;
				this.state.weightProgress = 0.08 + this.smoothStep(0.14, 0.88, this.state.scrollProgress) * 0.32;
				this.state.clarityProgress = 0.08 + this.smoothStep(0.4, 0.96, this.state.scrollProgress) * 0.24;
				this.state.visibility = 1;
			}

			this.metrics.hub = this.getBaseHub();
			this.state.collapseTarget = Math.max(this.manualCollapse, this.state.focusTarget * 0.96);

			if (this.phaseLabel) {
				this.phaseLabel.textContent = this.getPhaseLabel();
			}
			this.updateFocusLabel(this.focusKeyword);
		}

		updateFocusLabel(text) {
			if (this.focusLabel) {
				this.focusLabel.textContent = text;
			}
		}

		getPhaseLabel() {
			if (this.state.focusTarget > 0.4) {
				return this.mode === "stage" ? "Focused inference" : "Control convergence";
			}
			if (this.state.collapse > 0.66 || this.state.collapseTarget > 0.66) {
				return "Converged model";
			}
			if (this.state.clarityProgress > 0.55) {
				return "Decision clarity";
			}
			if (this.state.weightProgress > 0.45) {
				return "Reweighted links";
			}
			if (this.state.clusterProgress > 0.2) {
				return "Domain clustering";
			}
			return "Signal scan";
		}

		start() {
			if (this.prefersReducedMotion.matches || this.frameHandle) {
				return;
			}

			this.frameHandle = window.requestAnimationFrame(this.animate);
		}

		stop() {
			if (!this.frameHandle) {
				return;
			}

			window.cancelAnimationFrame(this.frameHandle);
			this.frameHandle = null;
		}

		animate(timestamp) {
			this.frameHandle = null;

			if (!this.state.isVisible && Math.abs(this.state.collapse - this.state.collapseTarget) < 0.01) {
				return;
			}

			if (timestamp - this.lastFrameTime >= this.frameInterval) {
				this.lastFrameTime = timestamp;
				this.render(timestamp);
			}

			if (
				this.state.isVisible ||
				Math.abs(this.state.collapse - this.state.collapseTarget) >= 0.01 ||
				Math.abs(this.state.focusStrength - this.state.focusTarget) >= 0.01
			) {
				this.frameHandle = window.requestAnimationFrame(this.animate);
			}
		}

		render(timestamp) {
			const { width, height } = this.metrics;
			const context = this.context;
			context.clearRect(0, 0, width, height);

			this.updateFocusAnchor();
			this.state.collapse += (this.state.collapseTarget - this.state.collapse) * this.state.collapseSpeed;
			this.state.focusStrength += (this.state.focusTarget - this.state.focusStrength) * this.state.focusSpeed;

			const domainPositions = this.getDomainPositions();
			this.updateNodes(timestamp, domainPositions);

			context.save();
			context.globalAlpha = this.state.visibility;
			this.drawField(domainPositions);
			this.drawWordLayer(timestamp, domainPositions);
			this.drawLinks();
			this.drawHub(domainPositions);
			this.drawNodes();
			context.restore();

			if (this.labelNodes.length) {
				this.updateLabels(domainPositions);
			}
		}

		getDomainPositions() {
			const states = this.getDomainStateTargets();
			const hub = this.getActiveHub();
			const domainPositions = [];

			this.domains.forEach((domain, index) => {
				const sparse = states.sparse[index];
				const clustered = states.clustered[index];
				const weighted = states.weighted[index];
				const converged = states.converged[index];

				const clusterStrength = this.mode === "stage" ? this.state.clusterProgress : this.clamp(this.state.clusterProgress * 1.14, 0, 1);
				let x = this.mix(sparse.x, clustered.x, clusterStrength);
				let y = this.mix(sparse.y, clustered.y, clusterStrength);
				x = this.mix(x, weighted.x, this.state.weightProgress);
				y = this.mix(y, weighted.y, this.state.weightProgress);
				const collapseStrength = this.state.collapse * (this.mode === "stage" ? 1 : 0.84);
				x = this.mix(x, converged.x, collapseStrength);
				y = this.mix(y, converged.y, collapseStrength);

				x *= this.metrics.width;
				y *= this.metrics.height;

				if (this.state.focusStrength > 0.01) {
					const pull = this.state.focusDomainIndex === index ? 0.92 : 0.5;
					x = this.mix(x, hub.x, this.state.focusStrength * pull);
					y = this.mix(y, hub.y, this.state.focusStrength * pull);
				}

				const sectionBias = this.getSectionBias(index);
				if (sectionBias > 0) {
					x = this.mix(x, this.metrics.width * 0.54, sectionBias * 0.32);
					y = this.mix(y, this.metrics.height * 0.52, sectionBias * 0.18);
				}

				domain.current.x = x;
				domain.current.y = y;
				domain.labelOpacity = 0.24 + this.state.clusterProgress * 0.3 + this.state.collapse * 0.18 + this.state.focusStrength * 0.16 + sectionBias * 0.18;
				domainPositions.push(domain.current);
			});

			return domainPositions;
		}

		getDomainStateTargets() {
			if (this.mode === "stage") {
				return this.mobile ? {
					sparse: [
						{ x: 0.68, y: 0.28 },
						{ x: 0.79, y: 0.42 },
						{ x: 0.72, y: 0.62 },
						{ x: 0.56, y: 0.73 },
						{ x: 0.43, y: 0.31 },
						{ x: 0.49, y: 0.55 },
					],
					clustered: [
						{ x: 0.65, y: 0.29 },
						{ x: 0.73, y: 0.41 },
						{ x: 0.67, y: 0.58 },
						{ x: 0.56, y: 0.65 },
						{ x: 0.46, y: 0.35 },
						{ x: 0.51, y: 0.52 },
					],
					weighted: [
						{ x: 0.61, y: 0.31 },
						{ x: 0.68, y: 0.42 },
						{ x: 0.64, y: 0.55 },
						{ x: 0.56, y: 0.6 },
						{ x: 0.49, y: 0.38 },
						{ x: 0.53, y: 0.5 },
					],
					converged: [
						{ x: 0.55, y: 0.29 },
						{ x: 0.64, y: 0.38 },
						{ x: 0.64, y: 0.53 },
						{ x: 0.56, y: 0.62 },
						{ x: 0.46, y: 0.37 },
						{ x: 0.49, y: 0.54 },
					],
				} : {
					sparse: [
						{ x: 0.78, y: 0.24 },
						{ x: 0.86, y: 0.42 },
						{ x: 0.77, y: 0.66 },
						{ x: 0.62, y: 0.77 },
						{ x: 0.51, y: 0.26 },
						{ x: 0.57, y: 0.57 },
					],
					clustered: [
						{ x: 0.73, y: 0.26 },
						{ x: 0.79, y: 0.42 },
						{ x: 0.72, y: 0.61 },
						{ x: 0.61, y: 0.71 },
						{ x: 0.52, y: 0.34 },
						{ x: 0.58, y: 0.54 },
					],
					weighted: [
						{ x: 0.69, y: 0.29 },
						{ x: 0.74, y: 0.41 },
						{ x: 0.69, y: 0.56 },
						{ x: 0.6, y: 0.65 },
						{ x: 0.54, y: 0.38 },
						{ x: 0.59, y: 0.5 },
					],
					converged: [
						{ x: 0.6, y: 0.27 },
						{ x: 0.71, y: 0.37 },
						{ x: 0.69, y: 0.55 },
						{ x: 0.6, y: 0.66 },
						{ x: 0.49, y: 0.35 },
						{ x: 0.53, y: 0.57 },
					],
				};
			}

			return {
				sparse: [
					{ x: 0.14, y: 0.18 },
					{ x: 0.82, y: 0.2 },
					{ x: 0.88, y: 0.68 },
					{ x: 0.18, y: 0.78 },
					{ x: 0.38, y: 0.26 },
					{ x: 0.62, y: 0.6 },
				],
				clustered: [
					{ x: 0.19, y: 0.24 },
					{ x: 0.76, y: 0.24 },
					{ x: 0.8, y: 0.63 },
					{ x: 0.24, y: 0.72 },
					{ x: 0.42, y: 0.31 },
					{ x: 0.58, y: 0.56 },
				],
				weighted: [
					{ x: 0.24, y: 0.29 },
					{ x: 0.7, y: 0.28 },
					{ x: 0.74, y: 0.58 },
					{ x: 0.28, y: 0.66 },
					{ x: 0.46, y: 0.36 },
					{ x: 0.54, y: 0.52 },
				],
				converged: [
					{ x: 0.34, y: 0.36 },
					{ x: 0.62, y: 0.35 },
					{ x: 0.65, y: 0.52 },
					{ x: 0.36, y: 0.58 },
					{ x: 0.46, y: 0.42 },
					{ x: 0.54, y: 0.46 },
				],
			};
		}

		updateNodes(timestamp, domainPositions) {
			const hub = this.getActiveHub();
			const jitterScale = this.mode === "stage"
				? 28 * (1 - this.state.weightProgress) * (1 - this.state.collapse * 0.7)
				: 40 * (1 - this.state.weightProgress * 0.58) * (1 - this.state.collapse * 0.38);

			this.nodes.forEach((node, index) => {
				const domainPosition = domainPositions[node.domainIndex];
				const driftX = Math.sin(timestamp * node.speed + node.driftOffsetX) * jitterScale;
				const driftY = Math.cos(timestamp * (node.speed * 1.25) + node.driftOffsetY) * jitterScale;
				const looseX = node.scatterX * this.metrics.width + driftX;
				const looseY = node.scatterY * this.metrics.height + driftY;
				const orbitX = domainPosition.x + Math.cos(node.angle + timestamp * node.speed * 0.8) * node.orbit;
				const orbitY = domainPosition.y + Math.sin(node.angle + timestamp * node.speed * 0.9) * node.orbit * 0.72;

				let targetX = this.mix(looseX, orbitX, this.state.clusterProgress + this.state.focusStrength * 0.18);
				let targetY = this.mix(looseY, orbitY, this.state.clusterProgress + this.state.focusStrength * 0.18);
				targetX = this.mix(targetX, domainPosition.x, this.state.weightProgress * 0.28 + this.state.collapse * 0.22 + this.state.focusStrength * 0.12);
				targetY = this.mix(targetY, domainPosition.y, this.state.weightProgress * 0.28 + this.state.collapse * 0.22 + this.state.focusStrength * 0.12);

				if (this.state.focusStrength > 0.08) {
					const focusFactor = this.state.focusDomainIndex === node.domainIndex ? (node.isLead ? 0.48 : 0.3) : (node.isLead ? 0.18 : 0.1);
					targetX = this.mix(targetX, hub.x, this.state.focusStrength * focusFactor);
					targetY = this.mix(targetY, hub.y, this.state.focusStrength * focusFactor);
				}

				if (!node.currentX || !node.currentY) {
					node.currentX = targetX;
					node.currentY = targetY;
				}

				const easing = node.isLead ? 0.12 : 0.08;
				node.currentX += (targetX - node.currentX) * easing;
				node.currentY += (targetY - node.currentY) * easing;

				if (index < this.domains.length) {
					node.currentX += (domainPosition.x - node.currentX) * 0.08;
					node.currentY += (domainPosition.y - node.currentY) * 0.08;
				}
			});
		}

		drawWordLayer(timestamp, domainPositions) {
			const context = this.context;
			const preCollapseVisibility = this.clamp(0.44 + this.state.clusterProgress * 0.4 - this.state.collapse * 0.68, 0, 0.72);
			const focusFade = 1 - this.state.focusStrength * 0.58;
			const alphaBase = preCollapseVisibility * focusFade;

			if (alphaBase <= 0.04) {
				return;
			}

			context.save();
			context.font = `${this.mode === "stage" ? 10 : 11}px IBM Plex Mono, monospace`;
			context.textBaseline = "middle";

			this.wordNodes.forEach((wordNode, index) => {
				const domainPosition = domainPositions[wordNode.domainIndex];
				if (!domainPosition) {
					return;
				}

				const angle = wordNode.angleOffset + timestamp * wordNode.wobble + wordNode.wobbleOffset;
				const drift = Math.sin(timestamp * wordNode.wobble + wordNode.wobbleOffset) * 6;
				const x = domainPosition.x + Math.cos(angle) * wordNode.orbit;
				const y = domainPosition.y + Math.sin(angle * 1.14) * (wordNode.orbit * 0.48) + drift;
				const isFocusWord = this.state.focusDomainIndex === wordNode.domainIndex;
				const readabilityFactor = this.getReadabilityFactor(x, y, 16);
				const attenuation = readabilityFactor;

				context.fillStyle = isFocusWord
					? `rgba(226, 198, 141, ${alphaBase * 0.88 * attenuation})`
					: index % 2 === 0
						? `rgba(187, 200, 217, ${alphaBase * 0.7 * attenuation})`
						: `rgba(142, 164, 187, ${alphaBase * 0.58 * attenuation})`;
				context.fillText(wordNode.text.toUpperCase(), x, y);
			});

			context.restore();
		}

		drawField(domainPositions) {
			const context = this.context;

			domainPositions.forEach((position, index) => {
				const radius = this.mode === "stage" ? (this.mobile ? 92 : 134) : (this.mobile ? 150 : 220);
				const gradient = context.createRadialGradient(position.x, position.y, 0, position.x, position.y, radius);
				const readabilityFactor = this.getReadabilityFactor(position.x, position.y, radius * 0.5);
				const alpha = this.mode === "stage"
					? (0.02 + this.state.clusterProgress * 0.02 + this.state.collapse * 0.03 + this.state.focusStrength * 0.03) * readabilityFactor
					: (0.016 + this.state.clusterProgress * 0.018 + this.state.focusStrength * 0.028) * readabilityFactor;
				const hue = this.state.focusDomainIndex === index ? "205, 169, 103" : index % 2 === 0 ? "100, 255, 218" : "128, 151, 172";

				gradient.addColorStop(0, `rgba(${hue}, ${alpha})`);
				gradient.addColorStop(1, "rgba(10, 25, 47, 0)");

				context.fillStyle = gradient;
				context.beginPath();
				context.arc(position.x, position.y, radius, 0, Math.PI * 2);
				context.fill();
			});
		}

		drawLinks() {
			const context = this.context;
			const threshold = this.mode === "stage"
				? (this.mobile ? 110 : 150) + this.state.focusStrength * 22
				: (this.mobile ? 140 : 210) + this.state.focusStrength * 52;

			for (let firstIndex = 0; firstIndex < this.nodes.length; firstIndex += 1) {
				const firstNode = this.nodes[firstIndex];

				for (let secondIndex = firstIndex + 1; secondIndex < this.nodes.length; secondIndex += 1) {
					const secondNode = this.nodes[secondIndex];
					const distance = Math.hypot(secondNode.currentX - firstNode.currentX, secondNode.currentY - firstNode.currentY);

					if (distance > threshold) {
						continue;
					}

					const sameDomain = firstNode.domainIndex === secondNode.domainIndex;
					const focusPair = this.state.focusDomainIndex !== null && (firstNode.domainIndex === this.state.focusDomainIndex || secondNode.domainIndex === this.state.focusDomainIndex);
					const readabilityFactor = Math.min(
						this.getReadabilityFactor(firstNode.currentX, firstNode.currentY, 8),
						this.getReadabilityFactor(secondNode.currentX, secondNode.currentY, 8),
						this.getReadabilityFactor((firstNode.currentX + secondNode.currentX) / 2, (firstNode.currentY + secondNode.currentY) / 2, 8),
					);
					const distanceWeight = 1 - distance / threshold;
					const crossDomainWeight = 0.38 - this.state.weightProgress * 0.1 - this.state.collapse * 0.05 + this.state.focusStrength * 0.18;
					const domainWeight = 0.6 + this.state.clusterProgress * 0.26 + this.state.weightProgress * 0.24 + this.state.focusStrength * 0.3 + this.state.collapse * 0.12;
					const strength = distanceWeight * (sameDomain ? domainWeight : crossDomainWeight) * (focusPair ? 1.3 : 1) * readabilityFactor;

					if (strength <= 0.06) {
						continue;
					}

					context.beginPath();
					context.lineWidth = sameDomain ? 0.56 + strength * (this.mode === "stage" ? 1.2 : 1.45) : 0.4 + strength * 0.72;
					context.strokeStyle = focusPair
						? `rgba(226, 198, 141, ${0.08 + strength * 0.28 + this.state.collapse * 0.1})`
						: sameDomain
							? `rgba(176, 194, 215, ${0.05 + strength * 0.22 + this.state.collapse * 0.08})`
							: `rgba(114, 255, 224, ${0.02 + strength * 0.1 + this.state.collapse * 0.05})`;
					context.moveTo(firstNode.currentX, firstNode.currentY);
					context.lineTo(secondNode.currentX, secondNode.currentY);
					context.stroke();
				}
			}
		}

		drawHub(domainPositions) {
			const collapseStrength = Math.max(this.state.collapse, this.state.focusStrength * 0.95);
			if (collapseStrength < 0.08) {
				return;
			}

			const context = this.context;
			const hub = this.getActiveHub();

			domainPositions.forEach((position, index) => {
				const focusPath = this.state.focusDomainIndex === index;
				const readabilityFactor = this.getReadabilityFactor(position.x, position.y, 18);
				const sectionBias = this.getSectionBias(index);
				context.beginPath();
				context.lineWidth = ((focusPath ? 1.1 : 0.65) + collapseStrength * (this.mode === "stage" ? 1.4 : 1.8)) * readabilityFactor;
				context.strokeStyle = focusPath
					? `rgba(226, 198, 141, ${0.14 + collapseStrength * 0.32 + sectionBias * 0.1})`
					: `rgba(128, 247, 221, ${0.08 + collapseStrength * 0.18 + sectionBias * 0.06})`;
				context.moveTo(hub.x, hub.y);
				context.lineTo(position.x, position.y);
				context.stroke();
			});

			context.beginPath();
			context.fillStyle = `rgba(243, 239, 231, ${0.24 + collapseStrength * 0.28})`;
			context.arc(hub.x, hub.y, 4.8 + collapseStrength * 2.4, 0, Math.PI * 2);
			context.fill();

			context.beginPath();
			context.lineWidth = 1.2;
			context.strokeStyle = `rgba(226, 198, 141, ${0.18 + collapseStrength * 0.28})`;
			context.arc(hub.x, hub.y, 10 + collapseStrength * 14, 0, Math.PI * 2);
			context.stroke();

			if (this.state.focusStrength > 0.12 && this.focusKeyword !== "Awaiting active signal") {
				context.fillStyle = `rgba(244, 239, 230, ${0.64 + this.state.focusStrength * 0.22})`;
				context.font = `${this.mode === "stage" ? 12 : 11}px IBM Plex Mono, monospace`;
				context.textAlign = "center";
				context.fillText(this.focusKeyword.toUpperCase(), hub.x, hub.y - 18);
			}
		}

		drawNodes() {
			const context = this.context;

			this.nodes.forEach((node) => {
				const isFocusNode = this.state.focusDomainIndex === node.domainIndex;
				const readabilityFactor = this.getReadabilityFactor(node.currentX, node.currentY, 12);
				context.beginPath();
				context.fillStyle = isFocusNode
					? `rgba(226, 198, 141, ${0.56 * readabilityFactor + this.state.focusStrength * 0.28 + this.state.collapse * 0.1})`
					: node.isLead
						? `rgba(236, 244, 255, ${0.5 * readabilityFactor + this.state.collapse * 0.24 + this.state.weightProgress * 0.1})`
						: `rgba(168, 183, 204, ${0.32 * readabilityFactor + this.state.clusterProgress * 0.22 + this.state.collapse * 0.08})`;
				context.arc(node.currentX, node.currentY, node.size + (isFocusNode ? this.state.focusStrength * 0.7 : this.state.collapse * 0.12), 0, Math.PI * 2);
				context.fill();
			});
		}

		updateLabels(domainPositions) {
			this.labelNodes.forEach((labelNode, index) => {
				const definition = DOMAIN_DEFINITIONS[index];
				const position = domainPositions[index];
				if (!definition || !position) {
					return;
				}

				const x = position.x + definition.labelOffset.x;
				const y = position.y + definition.labelOffset.y;
				const opacity = this.clamp(this.domains[index].labelOpacity + this.state.collapse * 0.08, 0.22, 0.82);
				labelNode.style.transform = `translate(${x}px, ${y}px)`;
				labelNode.style.opacity = String(opacity);
			});
		}

		mix(start, end, factor) {
			return start + (end - start) * factor;
		}

		clamp(value, min, max) {
			return Math.min(Math.max(value, min), max);
		}

		smoothStep(edge0, edge1, value) {
			const factor = this.clamp((value - edge0) / (edge1 - edge0), 0, 1);
			return factor * factor * (3 - 2 * factor);
		}
	}

	window.initDecisionFieldExperience = function initDecisionFieldExperience() {
		if (window.__decisionFieldInitialized) {
			return window.__decisionFieldInstance;
		}

		window.__decisionFieldInitialized = true;
		window.__decisionFieldInstance = new DecisionFieldExperience();
		return window.__decisionFieldInstance;
	};
})();
