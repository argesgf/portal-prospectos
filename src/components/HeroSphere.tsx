"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroSphere() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.5, 4.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const sphereGeo = new THREE.IcosahedronGeometry(1.2, 4);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      metalness: 0.1,
      roughness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      emissive: 0x312e81,
      emissiveIntensity: 0.15,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    const wireGeo = new THREE.IcosahedronGeometry(1.22, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const wireframe = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireframe);

    const ringGeo = new THREE.TorusGeometry(1.7, 0.012, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.3,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    ring.rotation.z = Math.PI / 4;
    scene.add(ring);

    const ring2Geo = new THREE.TorusGeometry(1.9, 0.008, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.15,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 3;
    scene.add(ring2);

    const glowGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.06,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    const ambient = new THREE.AmbientLight(0x404080);

    const envLight = new THREE.HemisphereLight(0x818cf8, 0x1e1b4b, 1);
    scene.add(envLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 1.5);
    fillLight.position.set(-3, -1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc4b5fd, 1.5);
    rimLight.position.set(0, -2, -3);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0x6366f1, 2, 5);
    pointLight.position.set(0, 1, 2);
    scene.add(pointLight);

    const starCount = 1200;
    const starPos = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 30;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      starSizes[i] = Math.random() * 0.04 + 0.005;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));
    const starMat = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const particleCount = 400;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.025,
      color: 0xa78bfa,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let time = 0;
    let animId: number;
    const animate = () => {
      time += 0.01;

      sphere.rotation.x += 0.002;
      sphere.rotation.y += 0.005;
      wireframe.rotation.x += 0.002;
      wireframe.rotation.y += 0.005;

      ring.rotation.y += 0.008;
      ring.rotation.x = Math.PI / 3 + Math.sin(time * 0.3) * 0.05;
      ring2.rotation.y -= 0.006;
      ring2.rotation.x = -Math.PI / 4 + Math.cos(time * 0.2) * 0.05;

      glow.rotation.x += 0.001;
      glow.rotation.y += 0.002;
      glow.scale.setScalar(1 + Math.sin(time * 0.5) * 0.03);

      particles.rotation.y += 0.0003;

      stars.rotation.y += 0.00015;

      pointLight.position.x = Math.sin(time * 0.4) * 2;
      pointLight.position.z = Math.cos(time * 0.4) * 2;

      const hue = (Math.sin(time * 0.1) * 0.1) + 0.65;
      sphere.material.color.setHSL(hue, 0.7, 0.5);
      sphere.material.emissive.setHSL(hue, 0.8, 0.15);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
    />
  );
}
