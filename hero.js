// rad/s² — Three.js gyroscope hero
import * as THREE from 'three';

function makeRing(radius, opacity, segments = 128) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity })
  );
}

export function initHero(canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 4.5;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // — Gyroscope —
  const gyro = new THREE.Group();

  const r1 = makeRing(1.40, 0.90); // XY plane
  const r2 = makeRing(1.10, 0.75); // YZ plane
  r2.rotation.y = Math.PI / 2;
  const r3 = makeRing(0.80, 0.60); // XZ plane
  r3.rotation.x = Math.PI / 2;
  const r4 = makeRing(0.50, 0.40); // diagonal
  r4.rotation.x = Math.PI / 4;
  r4.rotation.z = Math.PI / 6;

  gyro.add(r1, r2, r3, r4);

  // Faint axle lines
  const axleMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.10 });
  [
    [new THREE.Vector3(-1.7, 0, 0), new THREE.Vector3(1.7, 0, 0)],
    [new THREE.Vector3(0, -1.7, 0), new THREE.Vector3(0, 1.7, 0)],
    [new THREE.Vector3(0, 0, -1.7), new THREE.Vector3(0, 0, 1.7)],
  ].forEach(([a, b]) => {
    gyro.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), axleMat));
  });

  scene.add(gyro);

  // — Particles —
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
    color: 0xffffff,
    size: 0.022,
    transparent: true,
    opacity: 0.45,
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
