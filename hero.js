// rad/s² — Three.js gyroscope hero + particle wave

import * as THREE from 'three';

function makeRing(radius, opacity, segments = 128) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: 0x1A1A1A, transparent: true, opacity })
  );
}

export function initHero(canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  // Slightly elevated camera for floor grid perspective
  camera.position.set(0, 0.6, 4.5);
  camera.lookAt(0, -0.15, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // — Perspective Grid Floor —
  const grid = new THREE.GridHelper(8, 16, 0xBCB9B4, 0xD4D1CC);
  const applyGridMat = (m) => { m.transparent = true; m.opacity = 0.18; };
  Array.isArray(grid.material) ? grid.material.forEach(applyGridMat) : applyGridMat(grid.material);
  grid.position.y = -2.0;
  scene.add(grid);

  // — Gyroscope — (opacities tuned for warm light background)
  const gyro = new THREE.Group();

  const r1 = makeRing(1.40, 0.70); // XY plane
  const r2 = makeRing(1.10, 0.55); // YZ plane
  r2.rotation.y = Math.PI / 2;
  const r3 = makeRing(0.80, 0.40); // XZ plane
  r3.rotation.x = Math.PI / 2;
  const r4 = makeRing(0.50, 0.28); // diagonal
  r4.rotation.x = Math.PI / 4;
  r4.rotation.z = Math.PI / 6;

  gyro.add(r1, r2, r3, r4);

  // Faint axle lines
  const axleMat = new THREE.LineBasicMaterial({ color: 0x1A1A1A, transparent: true, opacity: 0.08 });
  [
    [new THREE.Vector3(-1.7, 0, 0), new THREE.Vector3(1.7, 0, 0)],
    [new THREE.Vector3(0, -1.7, 0), new THREE.Vector3(0, 1.7, 0)],
    [new THREE.Vector3(0, 0, -1.7), new THREE.Vector3(0, 0, 1.7)],
  ].forEach(([a, b]) => {
    gyro.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), axleMat));
  });

  scene.add(gyro);

  // — Gyroscope Particles —
  const COUNT = 500;
  const positions = new Float32Array(COUNT * 3);
  const radii = [1.40, 1.10, 0.80, 0.50];
  const eulers = [
    new THREE.Euler(0, 0, 0),
    new THREE.Euler(0, Math.PI / 2, 0),
    new THREE.Euler(Math.PI / 2, 0, 0),
    new THREE.Euler(Math.PI / 4, 0, Math.PI / 6),
  ];
  const v = new THREE.Vector3();
  const m = new THREE.Matrix4();

  for (let i = 0; i < COUNT; i++) {
    const ri = Math.floor(Math.random() * 4);
    const r = radii[ri] + (Math.random() - 0.5) * 0.18;
    const angle = Math.random() * Math.PI * 2;
    v.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
    m.makeRotationFromEuler(eulers[ri]);
    v.applyMatrix4(m);
    positions[i * 3]     = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x1A1A1A,
    size: 0.022,
    transparent: true,
    opacity: 0.30,
    sizeAttenuation: true,
  }));
  scene.add(particles);

  // — Sizing via ResizeObserver —
  function setSize() {
    const sz = canvas.parentElement?.offsetWidth || 400;
    if (sz > 0) renderer.setSize(sz, sz);
  }
  setSize();
  const ro = new ResizeObserver(setSize);
  ro.observe(canvas.parentElement);

  // — Animation loop —
  const clock = new THREE.Clock();
  let raf;

  function animate() {
    raf = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    gyro.rotation.y = t * 0.20;
    gyro.rotation.x = Math.sin(t * 0.07) * 0.22;

    r1.rotation.z =  t * 0.35;
    r2.rotation.z = -t * 0.55;
    r3.rotation.z =  t * 0.45;
    r4.rotation.z = -t * 0.28;

    // Particles lag slightly behind gyro — creates trail effect
    particles.rotation.y = gyro.rotation.y - 0.14;
    particles.rotation.x = gyro.rotation.x - 0.07;

    renderer.render(scene, camera);
  }
  animate();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    renderer.dispose();
  };
}

// — Full-width particle dust wave (2D canvas, spans the whole hero) —
export function initWave(canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let phase = 0;
  let W = 0, H = 0;
  let waveOffset = 0, targetOffset = 0;
  let raf;

  // Box-Muller gaussian sample
  function randNormal() {
    let u, v;
    do { u = Math.random(); } while (u === 0);
    do { v = Math.random(); } while (v === 0);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function buildParticles() {
    particles = [];
    // Scale particle count with canvas width, capped at 2800
    const COUNT = Math.min(Math.floor(W * 1.6), 2800);
    const cy = H * 0.58; // wave center at 58% down the hero

    for (let i = 0; i < COUNT; i++) {
      const x = Math.random() * W;
      // Compound sine wave shape — two harmonics for organic feel
      const nx = (x / W) * Math.PI * 3;
      const wave = Math.sin(nx) * H * 0.055 + Math.sin(nx * 0.55 + 0.9) * H * 0.025;
      // Gaussian scatter around the wave center line
      const scatter = randNormal() * H * 0.026;

      particles.push({
        x,
        baseY: cy + wave + scatter,
        phase: Math.random() * Math.PI * 2, // per-particle phase offset
        r: Math.random() * 1.0 + 0.35,
        a: Math.random() * 0.16 + 0.04,     // alpha
      });
    }
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = Math.round(rect.width);
    H = Math.round(rect.height);
    const dpr = Math.min(devicePixelRatio, 2);
    // Setting canvas.width resets the 2D context state (clears transforms)
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    buildParticles();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  resize();

  // Subtle mouse reactivity — wave rises/falls with vertical cursor position
  const heroEl = canvas.parentElement;
  heroEl.addEventListener('mousemove', (e) => {
    const rect = heroEl.getBoundingClientRect();
    const my = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to +0.5
    targetOffset = my * -H * 0.04;
  });
  heroEl.addEventListener('mouseleave', () => { targetOffset = 0; });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function draw() {
    if (prefersReduced) return;
    raf = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, W, H);
    phase += 0.0035;
    waveOffset += (targetOffset - waveOffset) * 0.04; // lerp toward target

    for (const p of particles) {
      // Slow per-particle oscillation on top of global phase
      const y = p.baseY + waveOffset + Math.sin(p.x * 0.0038 + phase + p.phase) * 5;
      ctx.beginPath();
      ctx.arc(p.x, y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(90,122,107,${p.a})`; // deep sage, warm
      ctx.fill();
    }
  }
  draw();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
  };
}
