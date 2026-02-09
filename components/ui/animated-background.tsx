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
}

const NODE_COUNT = 25;
const CONNECTION_DISTANCE = 200;
const PULSE_SPAWN_RATE = 0.005;
const PARTICLE_COUNT = 15;

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const dimsRef = useRef({ width: 0, height: 0 });
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

  const initNodes = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    const padding = 50;

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: padding + Math.random() * (width - padding * 2),
        y: padding + Math.random() * (height - padding * 2),
        connections: [],
      });
    }

    // Build connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          nodes[i].connections.push(j);
          nodes[j].connections.push(i);
        }
      }
    }

    return nodes;
  }, []);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }

    return particles;
  }, []);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const nodes = nodesRef.current;
      const pulses = pulsesRef.current;
      const particles = particlesRef.current;
      const colors = colorsRef.current;

      ctx.clearRect(0, 0, width, height);

      // Draw connections
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;

      for (const node of nodes) {
        for (const connIdx of node.connections) {
          if (connIdx > nodes.indexOf(node)) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
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

      // Draw particles
      for (const particle of particles) {
        ctx.fillStyle = colors.particle.replace(")", `, ${particle.opacity})`).replace("rgba", "rgba");
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

        // Wrap around edges
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
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      const oldW = dimsRef.current.width;
      const oldH = dimsRef.current.height;
      const widthChanged = Math.abs(rect.width - oldW) > 1;
      const heightDelta = Math.abs(rect.height - oldH);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      dimsRef.current = { width: rect.width, height: rect.height };

      // Skip full reinit for small height-only changes (mobile chrome address bar)
      if (oldW === 0 || widthChanged || heightDelta > 150) {
        nodesRef.current = initNodes(rect.width, rect.height);
        particlesRef.current = initParticles(rect.width, rect.height);
        pulsesRef.current = [];
      }
    };

    resize();
    colorsRef.current = getColors();

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    };

    window.addEventListener("resize", handleResize);

    if (reducedMotion) {
      // Static render for reduced motion
      draw(ctx, canvas.width, canvas.height);
    } else {
      const animate = () => {
        const { width, height } = dimsRef.current;
        update(width, height);
        draw(ctx, width, height);
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
      clearTimeout(resizeTimeout);
    };
  }, [reducedMotion, initNodes, initParticles, draw, update, getColors]);

  // Update colors on theme change
  useEffect(() => {
    colorsRef.current = getColors();
  }, [resolvedTheme, getColors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
