"use client";

import { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useTheme } from "@/components/theme-provider";

interface Node {
  x: number;
  y: number;
  connections: number[];
}

interface Pulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const MOBILE_BREAKPOINT = 768;
const PULSE_SPAWN_RATE = 0.005;

function getMobileFlag() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function getConfig(mobile: boolean) {
  return {
    nodeCount: mobile ? 12 : 25,
    particleCount: mobile ? 6 : 15,
    connectionDistance: mobile ? 150 : 200,
  };
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const dimsRef = useRef({ width: 0, height: 0 });
  const staticCanvasRef = useRef<OffscreenCanvas | null>(null);
  const mobileRef = useRef(false);
  const colorsRef = useRef({
    node: "",
    line: "",
    pulse: "",
    particle: "",
  });

  const reducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();

  const getColors = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    return {
      node: style.getPropertyValue("--circuit-node").trim(),
      line: style.getPropertyValue("--circuit-line").trim(),
      pulse: style.getPropertyValue("--circuit-pulse").trim(),
      particle: style.getPropertyValue("--circuit-particle").trim(),
    };
  }, []);

  const initNodes = useCallback((width: number, height: number, connectionDistance: number, nodeCount: number) => {
    const nodes: Node[] = [];
    const padding = 50;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: padding + Math.random() * (width - padding * 2),
        y: padding + Math.random() * (height - padding * 2),
        connections: [],
      });
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          nodes[i].connections.push(j);
          nodes[j].connections.push(i);
        }
      }
    }

    return nodes;
  }, []);

  const initParticles = useCallback((width: number, height: number, particleCount: number, particleColor: string) => {
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const opacity = 0.3 + Math.random() * 0.4;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 1 + Math.random() * 2,
        opacity,
        color: particleColor.replace(")", `, ${opacity})`),
      });
    }

    return particles;
  }, []);

  /** Draw static nodes + connections to an offscreen canvas (called once per init) */
  const buildStaticLayer = useCallback((width: number, height: number, dpr: number) => {
    const nodes = nodesRef.current;
    const colors = colorsRef.current;

    const offscreen = new OffscreenCanvas(width * dpr, height * dpr);
    const ctx = offscreen.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Draw connections
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (const connIdx of nodes[i].connections) {
        if (connIdx > i) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[connIdx].x, nodes[connIdx].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    ctx.fillStyle = colors.node;
    for (const node of nodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    staticCanvasRef.current = offscreen;
  }, []);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const nodes = nodesRef.current;
      const pulses = pulsesRef.current;
      const particles = particlesRef.current;
      const colors = colorsRef.current;

      ctx.clearRect(0, 0, width, height);

      // Blit cached static layer (nodes + connections)
      if (staticCanvasRef.current) {
        ctx.drawImage(staticCanvasRef.current, 0, 0, width, height);
      }

      // Draw particles (pre-computed colors)
      for (const particle of particles) {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw pulses
      ctx.fillStyle = colors.pulse;
      for (const pulse of pulses) {
        const from = nodes[pulse.fromNode];
        const to = nodes[pulse.toNode];
        const x = from.x + (to.x - from.x) * pulse.progress;
        const y = from.y + (to.y - from.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    []
  );

  const update = useCallback(
    (width: number, height: number) => {
      const nodes = nodesRef.current;
      const pulses = pulsesRef.current;
      const particles = particlesRef.current;

      // Update pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].progress += pulses[i].speed;
        if (pulses[i].progress >= 1) {
          pulses.splice(i, 1);
        }
      }

      // Spawn new pulses
      if (Math.random() < PULSE_SPAWN_RATE && pulses.length < 5) {
        const nodeIdx = Math.floor(Math.random() * nodes.length);
        const node = nodes[nodeIdx];
        if (node.connections.length > 0) {
          const connIdx = node.connections[Math.floor(Math.random() * node.connections.length)];
          pulses.push({
            fromNode: nodeIdx,
            toNode: connIdx,
            progress: 0,
            speed: 0.008 + Math.random() * 0.008,
          });
        }
      }

      // Update particles
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
      }
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const mobile = getMobileFlag();
      mobileRef.current = mobile;
      const dpr = mobile ? 1 : (window.devicePixelRatio || 1);
      const config = getConfig(mobile);

      const oldW = dimsRef.current.width;
      const oldH = dimsRef.current.height;
      const widthChanged = Math.abs(rect.width - oldW) > 1;
      const heightDelta = Math.abs(rect.height - oldH);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimsRef.current = { width: rect.width, height: rect.height };

      // Skip full reinit for small height-only changes (mobile chrome address bar)
      if (oldW === 0 || widthChanged || heightDelta > 150) {
        nodesRef.current = initNodes(rect.width, rect.height, config.connectionDistance, config.nodeCount);
        particlesRef.current = initParticles(rect.width, rect.height, config.particleCount, colorsRef.current.particle);
        pulsesRef.current = [];
        buildStaticLayer(rect.width, rect.height, dpr);
      }
    };

    resize();
    colorsRef.current = getColors();
    // Rebuild static layer after colors are set
    const { width, height } = dimsRef.current;
    const dpr = mobileRef.current ? 1 : (window.devicePixelRatio || 1);
    buildStaticLayer(width, height, dpr);

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    };

    window.addEventListener("resize", handleResize);

    if (reducedMotion) {
      draw(ctx, width, height);
    } else {
      let frame = 0;
      const animate = () => {
        frame++;
        // Throttle to ~30fps on mobile
        if (mobileRef.current && frame % 2 === 0) {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }
        const dims = dimsRef.current;
        update(dims.width, dims.height);
        draw(ctx, dims.width, dims.height);
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
      clearTimeout(resizeTimeout);
    };
  }, [reducedMotion, initNodes, initParticles, draw, update, getColors, buildStaticLayer]);

  // Update colors + static layer on theme change
  useEffect(() => {
    colorsRef.current = getColors();
    const { width, height } = dimsRef.current;
    if (width > 0) {
      const dpr = mobileRef.current ? 1 : (window.devicePixelRatio || 1);
      buildStaticLayer(width, height, dpr);
      // Re-compute particle colors
      for (const p of particlesRef.current) {
        p.color = colorsRef.current.particle.replace(")", `, ${p.opacity})`);
      }
    }
  }, [resolvedTheme, getColors, buildStaticLayer]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
