/**
 * Homepage decision network background.
 * Renders a restrained canvas-based system that tightens as the user scrolls.
 */

class DecisionNetwork {
  constructor() {
    this.stage = document.getElementById("decision-stage");
    this.canvas = document.getElementById("decision-network-canvas");
    this.toggle = document.getElementById("decision-network-toggle");
    this.phaseLabel = document.getElementById("decision-network-phase");
    this.labelNodes = Array.from(
      document.querySelectorAll(".decision-network-label"),
    );

    if (!this.stage || !this.canvas) {
      return;
    }

    this.context = this.canvas.getContext("2d");
    if (!this.context) {
      return;
    }

    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    this.mobileQuery = window.matchMedia("(max-width: 767px)");

    this.stage.dataset.networkMode = "ready";

    this.domainDefinitions = [
      { key: "forecasting", labelOffset: { x: 18, y: -26 } },
      { key: "pricing", labelOffset: { x: 18, y: -12 } },
      { key: "margin", labelOffset: { x: 18, y: 10 } },
      { key: "crm", labelOffset: { x: 12, y: 16 } },
      { key: "governance", labelOffset: { x: -120, y: -18 } },
      { key: "execution", labelOffset: { x: -84, y: 16 } },
    ];

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
      visibility: 1,
      isVisible: true,
    };

    this.frameHandle = null;
    this.lastFrameTime = 0;
    this.frameInterval = 1000 / 60;

    if (this.prefersReducedMotion.matches) {
      this.enterReducedMotionMode();
      return;
    }

    this.setupScene();
    this.bindEvents();
    this.updateMeasurements();
    this.updateScrollState();
    this.start();
  }

  enterReducedMotionMode() {
    this.stage.dataset.networkMode = "reduced";
    this.labelNodes.forEach((labelNode) => {
      labelNode.style.opacity = "0.72";
    });
    if (this.toggle) {
      this.toggle.hidden = true;
    }
    if (this.phaseLabel) {
      this.phaseLabel.textContent = "Calm layout";
    }
  }

  setupScene() {
    this.mobile = this.mobileQuery.matches;
    this.frameInterval = this.mobile ? 1000 / 30 : 1000 / 60;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, this.mobile ? 1.25 : 1.75);
    this.domains = this.createDomains();
    this.nodes = this.createNodes();
    this.stage.dataset.networkMode = "live";
  }

  bindEvents() {
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.animate = this.animate.bind(this);
    this.handleMotionChange = this.handleMotionChange.bind(this);

    window.addEventListener("resize", this.handleResize, { passive: true });
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    this.prefersReducedMotion.addEventListener("change", this.handleMotionChange);
    this.mobileQuery.addEventListener("change", this.handleResize);

    if (this.toggle) {
      this.toggle.addEventListener("click", this.handleToggle);
    }

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

  handleMotionChange(event) {
    if (event.matches) {
      this.stop();
      this.enterReducedMotionMode();
      return;
    }

    this.setupScene();
    this.updateMeasurements();
    this.updateScrollState();
    this.start();
  }

  handleResize() {
    if (this.prefersReducedMotion.matches) {
      return;
    }

    this.setupScene();
    this.updateMeasurements();
    this.render(0);
  }

  handleScroll() {
    this.updateScrollState();
    if (!this.frameHandle) {
      this.start();
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.stop();
      return;
    }

    this.start();
  }

  handleToggle() {
    const nextValue = this.state.collapseTarget > 0.5 ? 0 : 1;
    this.state.collapseTarget = nextValue;

    if (this.toggle) {
      this.toggle.setAttribute("aria-pressed", nextValue ? "true" : "false");
      this.toggle.textContent = nextValue ? "Expand network" : "Collapse network";
    }

    this.start();
  }

  createDomains() {
    return this.domainDefinitions.map((definition, index) => ({
      ...definition,
      index,
      current: { x: 0, y: 0 },
      labelOpacity: 0.3,
    }));
  }

  createNodes() {
    const nodeCount = this.mobile ? 16 : 34;
    const nodes = [];

    for (let index = 0; index < nodeCount; index += 1) {
      const domainIndex = index % this.domainDefinitions.length;
      const isLead = index < this.domainDefinitions.length;

      nodes.push({
        domainIndex,
        orbit: 24 + Math.random() * (this.mobile ? 42 : 70),
        angle: Math.random() * Math.PI * 2,
        driftOffsetX: Math.random() * 400,
        driftOffsetY: Math.random() * 400,
        scatterX: 0.44 + Math.random() * 0.48,
        scatterY: 0.14 + Math.random() * 0.7,
        currentX: 0,
        currentY: 0,
        size: isLead ? 2.6 : 1.35 + Math.random() * 1.15,
        speed: 0.00018 + Math.random() * 0.00028,
        isLead,
      });
    }

    return nodes;
  }

  updateMeasurements() {
    const sticky = this.stage.querySelector(".decision-stage-sticky");
    const stickyRect = sticky ? sticky.getBoundingClientRect() : this.stage.getBoundingClientRect();
    const stageRect = this.stage.getBoundingClientRect();

    this.metrics.width = Math.max(Math.round(stickyRect.width), 1);
    this.metrics.height = Math.max(Math.round(stickyRect.height), 1);
    this.metrics.viewportHeight = window.innerHeight;
    this.metrics.top = stageRect.top + window.scrollY;
    this.metrics.heightTotal = this.stage.offsetHeight;
    this.metrics.hub = {
      x: this.metrics.width * (this.mobile ? 0.56 : 0.6),
      y: this.metrics.height * (this.mobile ? 0.42 : 0.46),
    };

    this.canvas.width = Math.round(this.metrics.width * this.pixelRatio);
    this.canvas.height = Math.round(this.metrics.height * this.pixelRatio);
    this.canvas.style.width = `${this.metrics.width}px`;
    this.canvas.style.height = `${this.metrics.height}px`;

    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.scale(this.pixelRatio, this.pixelRatio);
  }

  updateScrollState() {
    const availableDistance = Math.max(
      this.metrics.heightTotal - this.metrics.viewportHeight * 0.6,
      1,
    );
    const offset = window.scrollY + this.metrics.viewportHeight * 0.18 - this.metrics.top;
    const rawProgress = offset / availableDistance;

    this.state.scrollProgress = this.clamp(rawProgress, 0, 1);
    this.state.clusterProgress = this.smoothStep(0.08, 0.42, this.state.scrollProgress);
    this.state.weightProgress = this.smoothStep(0.38, 0.74, this.state.scrollProgress);
    this.state.clarityProgress = this.smoothStep(0.68, 0.96, this.state.scrollProgress);
    this.state.visibility = 1 - this.smoothStep(0.88, 1, this.state.scrollProgress) * 0.18;

    if (this.phaseLabel) {
      this.phaseLabel.textContent = this.getPhaseLabel();
    }
  }

  getPhaseLabel() {
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

    if (this.state.isVisible || Math.abs(this.state.collapse - this.state.collapseTarget) >= 0.01) {
      this.frameHandle = window.requestAnimationFrame(this.animate);
    }
  }

  render(timestamp) {
    const { width, height } = this.metrics;
    const context = this.context;

    context.clearRect(0, 0, width, height);

    this.state.collapse += (this.state.collapseTarget - this.state.collapse) * 0.08;

    const domainPositions = this.getDomainPositions();
    this.updateNodes(timestamp, domainPositions);

    context.save();
    context.globalAlpha = this.state.visibility;

    this.drawField(domainPositions);
    this.drawLinks();
    this.drawHub(domainPositions);
    this.drawNodes();

    context.restore();
    this.updateLabels(domainPositions);
  }

  getDomainPositions() {
    const states = this.getDomainStateTargets();
    const domainPositions = [];

    this.domains.forEach((domain, index) => {
      const sparse = this.pickState(states.sparse[index]);
      const clustered = this.pickState(states.clustered[index]);
      const weighted = this.pickState(states.weighted[index]);
      const converged = this.pickState(states.converged[index]);

      let x = this.mix(sparse.x, clustered.x, this.state.clusterProgress);
      let y = this.mix(sparse.y, clustered.y, this.state.clusterProgress);

      x = this.mix(x, weighted.x, this.state.weightProgress);
      y = this.mix(y, weighted.y, this.state.weightProgress);

      x = this.mix(x, converged.x, this.state.collapse);
      y = this.mix(y, converged.y, this.state.collapse);

      domain.current.x = x * this.metrics.width;
      domain.current.y = y * this.metrics.height;
      domain.labelOpacity = 0.2 + this.state.clusterProgress * 0.34 + this.state.weightProgress * 0.12 + this.state.collapse * 0.18;

      domainPositions.push(domain.current);
    });

    return domainPositions;
  }

  getDomainStateTargets() {
    const desktopStates = {
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

    const mobileStates = {
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
    };

    return this.mobile ? mobileStates : desktopStates;
  }

  pickState(state) {
    return state;
  }

  updateNodes(timestamp, domainPositions) {
    const jitterScale = 28 * (1 - this.state.weightProgress) * (1 - this.state.collapse * 0.7);

    this.nodes.forEach((node, index) => {
      const domainPosition = domainPositions[node.domainIndex];
      const driftX = Math.sin(timestamp * node.speed + node.driftOffsetX) * jitterScale;
      const driftY = Math.cos(timestamp * (node.speed * 1.25) + node.driftOffsetY) * jitterScale;

      const looseX = node.scatterX * this.metrics.width + driftX;
      const looseY = node.scatterY * this.metrics.height + driftY;
      const orbitX = domainPosition.x + Math.cos(node.angle + timestamp * node.speed * 0.8) * node.orbit;
      const orbitY = domainPosition.y + Math.sin(node.angle + timestamp * node.speed * 0.9) * node.orbit * 0.72;

      let targetX = this.mix(looseX, orbitX, this.state.clusterProgress);
      let targetY = this.mix(looseY, orbitY, this.state.clusterProgress);

      targetX = this.mix(targetX, domainPosition.x, this.state.weightProgress * 0.32 + this.state.collapse * 0.46);
      targetY = this.mix(targetY, domainPosition.y, this.state.weightProgress * 0.32 + this.state.collapse * 0.46);

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

  drawField(domainPositions) {
    const context = this.context;

    domainPositions.forEach((position, index) => {
      const radius = this.mobile ? 90 : 132;
      const gradient = context.createRadialGradient(
        position.x,
        position.y,
        0,
        position.x,
        position.y,
        radius,
      );
      const alpha = 0.02 + this.state.clusterProgress * 0.02 + this.state.collapse * 0.03;
      const hue = index % 2 === 0 ? "100, 255, 218" : "148, 163, 184";

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
    const threshold = this.mobile ? 110 : 150;

    for (let firstIndex = 0; firstIndex < this.nodes.length; firstIndex += 1) {
      const firstNode = this.nodes[firstIndex];

      for (let secondIndex = firstIndex + 1; secondIndex < this.nodes.length; secondIndex += 1) {
        const secondNode = this.nodes[secondIndex];
        const distance = Math.hypot(
          secondNode.currentX - firstNode.currentX,
          secondNode.currentY - firstNode.currentY,
        );

        if (distance > threshold) {
          continue;
        }

        const sameDomain = firstNode.domainIndex === secondNode.domainIndex;
        const distanceWeight = 1 - distance / threshold;
        const crossDomainWeight = 0.42 - this.state.weightProgress * 0.18 - this.state.collapse * 0.16;
        const domainWeight = 0.62 + this.state.clusterProgress * 0.22 + this.state.weightProgress * 0.24;
        const strength = distanceWeight * (sameDomain ? domainWeight : crossDomainWeight);

        if (strength <= 0.06) {
          continue;
        }

        context.beginPath();
        context.lineWidth = sameDomain ? 0.55 + strength * 1.1 : 0.4 + strength * 0.6;
        context.strokeStyle = sameDomain
          ? `rgba(148, 163, 184, ${0.05 + strength * 0.18})`
          : `rgba(100, 255, 218, ${0.02 + strength * 0.08})`;
        context.moveTo(firstNode.currentX, firstNode.currentY);
        context.lineTo(secondNode.currentX, secondNode.currentY);
        context.stroke();
      }
    }
  }

  drawHub(domainPositions) {
    const collapseStrength = this.state.collapse;
    if (collapseStrength < 0.08) {
      return;
    }

    const context = this.context;
    const { hub } = this.metrics;

    domainPositions.forEach((position) => {
      context.beginPath();
      context.lineWidth = 0.65 + collapseStrength * 1.5;
      context.strokeStyle = `rgba(100, 255, 218, ${0.06 + collapseStrength * 0.22})`;
      context.moveTo(hub.x, hub.y);
      context.lineTo(position.x, position.y);
      context.stroke();
    });

    context.beginPath();
    context.fillStyle = `rgba(230, 241, 255, ${0.18 + collapseStrength * 0.18})`;
    context.arc(hub.x, hub.y, 4.5 + collapseStrength * 1.5, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = `rgba(100, 255, 218, ${0.18 + collapseStrength * 0.2})`;
    context.arc(hub.x, hub.y, 12 + collapseStrength * 8, 0, Math.PI * 2);
    context.stroke();
  }

  drawNodes() {
    const context = this.context;

    this.nodes.forEach((node) => {
      context.beginPath();
      context.fillStyle = node.isLead
        ? `rgba(230, 241, 255, ${0.5 + this.state.collapse * 0.18})`
        : `rgba(148, 163, 184, ${0.32 + this.state.clusterProgress * 0.18})`;
      context.arc(node.currentX, node.currentY, node.size, 0, Math.PI * 2);
      context.fill();
    });
  }

  updateLabels(domainPositions) {
    this.labelNodes.forEach((labelNode, index) => {
      const definition = this.domainDefinitions[index];
      const position = domainPositions[index];

      if (!definition || !position) {
        return;
      }

      const x = position.x + definition.labelOffset.x;
      const y = position.y + definition.labelOffset.y;
      const opacity = this.clamp(
        this.domains[index].labelOpacity + this.state.collapse * 0.08,
        0.22,
        0.78,
      );

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

document.addEventListener("DOMContentLoaded", () => {
  if (document.body && document.getElementById("decision-stage")) {
    new DecisionNetwork();
  }
});