import * as THREE from 'three';
import { gsap } from 'gsap';

export class ThreeScene {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e27);
        this.scene.fog = new THREE.FogExp2(0x0a0e27, 0.05);

        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 2, 5);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Slightly lower cap for performance
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap; // Faster shadow mapping

        this.clock = new THREE.Clock();
        this.neonLights = [];

        this.init();
        this.createEnvironment();
        this.createDesk();
        this.createMonitors();
        this.createLighting();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.onResize());
    }

    init() {
    }

    createEnvironment() {
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.8,
            metalness: 0.1,
            emissive: 0x0a0e27,
            emissiveIntensity: 0.3
        });

        // Walls
        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(15, 10), wallMaterial);
        backWall.position.z = -5;
        this.scene.add(backWall);

        const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), wallMaterial);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.x = -7.5;
        this.scene.add(leftWall);

        const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), wallMaterial);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.position.x = 7.5;
        this.scene.add(rightWall);

        // Floor with Grid
        const gridCanvas = document.createElement('canvas');
        gridCanvas.width = 512;
        gridCanvas.height = 512;
        const ctx = gridCanvas.getContext('2d');
        ctx.fillStyle = '#0a0e27';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        for (let i = 0; i < 512; i += 32) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
        }
        const gridTexture = new THREE.CanvasTexture(gridCanvas);
        gridTexture.wrapS = gridTexture.wrapT = THREE.RepeatWrapping;
        gridTexture.repeat.set(4, 4);

        const floorMat = new THREE.MeshStandardMaterial({
            map: gridTexture,
            metalness: 0.4,
            roughness: 0.6,
            emissive: 0x00ff41,
            emissiveIntensity: 0.05
        });
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(15, 10), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        this.scene.add(floor);
    }

    createDesk() {
        const deskMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            metalness: 0.8,
            roughness: 0.2
        });

        const deskTop = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 1.8), deskMaterial);
        deskTop.position.set(0, 0.9, 0);
        deskTop.castShadow = true;
        deskTop.receiveShadow = true;
        this.scene.add(deskTop);

        const legGeo = new THREE.BoxGeometry(0.1, 0.9, 0.1);
        const positions = [[-1.8, 0.45, -0.7], [1.8, 0.45, -0.7], [-1.8, 0.45, 0.7], [1.8, 0.45, 0.7]];
        positions.forEach(pos => {
            const leg = new THREE.Mesh(legGeo, deskMaterial);
            leg.position.set(...pos);
            this.scene.add(leg);
        });

        const standGeo = new THREE.BoxGeometry(0.3, 0.5, 0.3);
        const centerStand = new THREE.Mesh(standGeo, deskMaterial);
        centerStand.position.set(0, 1.15, -0.6);
        this.scene.add(centerStand);
    }

    createMonitors() {
        this.monitors = [];
        const monitorGeo = new THREE.BoxGeometry(1.8, 1.1, 0.05);

        const mainMat = new THREE.MeshStandardMaterial({
            color: 0x000000,
            emissive: 0x00ff41,
            emissiveIntensity: 0.2
        });
        const mainMonitor = new THREE.Mesh(monitorGeo, mainMat);
        mainMonitor.position.set(0, 1.8, -0.5);
        this.scene.add(mainMonitor);
        this.monitors.push(mainMonitor);

        const sideMonitorL = new THREE.Mesh(new THREE.BoxGeometry(1, 1.1, 0.05), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x00ffff, emissiveIntensity: 0.1 }));
        sideMonitorL.position.set(-1.6, 1.8, -0.3);
        sideMonitorL.rotation.y = Math.PI / 6;
        this.scene.add(sideMonitorL);
        this.monitors.push(sideMonitorL);

        const sideMonitorR = new THREE.Mesh(new THREE.BoxGeometry(1, 1.1, 0.05), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x8000ff, emissiveIntensity: 0.1 }));
        sideMonitorR.position.set(1.6, 1.8, -0.3);
        sideMonitorR.rotation.y = -Math.PI / 6;
        this.scene.add(sideMonitorR);
        this.monitors.push(sideMonitorR);
    }

    createLighting() {
        const ambientLight = new THREE.AmbientLight(0x00ff41, 0.2);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0x39ff14, 0.5);
        dirLight.position.set(5, 5, 5);
        dirLight.castShadow = true;
        this.scene.add(dirLight);

        const colors = [0x00ff41, 0x00ffff, 0x8000ff];
        const positions = [[0, 3, 2], [3, 3, 0], [-3, 3, 0]];

        colors.forEach((color, i) => {
            const light = new THREE.PointLight(color, 2, 10);
            light.position.set(...positions[i]);
            light.castShadow = true;
            this.scene.add(light);
            this.neonLights.push(light);
        });

        const hemiLight = new THREE.HemisphereLight(0x1a3a52, 0x000000, 0.4);
        this.scene.add(hemiLight);
    }

    createParticles() {
        this.particleCount = 500;
        const positions = new Float32Array(this.particleCount * 3);
        const velocities = new Float32Array(this.particleCount);

        for (let i = 0; i < this.particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = Math.random() * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            velocities[i] = 0.02 + Math.random() * 0.05;
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMat = new THREE.PointsMaterial({
            color: 0x00ff41,
            size: 0.02,
            transparent: true,
            opacity: 0.4
        });

        this.particles = new THREE.Points(particleGeo, particleMat);
        this.scene.add(this.particles);
        this.particlePositions = positions;
        this.particleVelocities = velocities;
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    updateCamera(scrollProgress) {
        const sections = [
            { pos: { x: 0, y: 2, z: 5 }, look: { x: 0, y: 1.5, z: 0 } },
            { pos: { x: 3, y: 2.5, z: 3 }, look: { x: 0, y: 1.5, z: -1 } },
            { pos: { x: -3, y: 2.5, z: 3 }, look: { x: 0, y: 1.5, z: -1 } },
            { pos: { x: 0, y: 4, z: 2 }, look: { x: 0, y: 1, z: 0 } },
            { pos: { x: 0, y: 2, z: 6 }, look: { x: 0, y: 1.5, z: 0 } }
        ];

        const totalSections = sections.length;
        const currentIdx = Math.floor(scrollProgress * (totalSections - 1));
        const nextIdx = Math.min(currentIdx + 1, totalSections - 1);
        const sectionProgress = (scrollProgress * (totalSections - 1)) - currentIdx;

        const current = sections[currentIdx];
        const next = sections[nextIdx];

        const targetPos = new THREE.Vector3(
            current.pos.x + (next.pos.x - current.pos.x) * sectionProgress,
            current.pos.y + (next.pos.y - current.pos.y) * sectionProgress,
            current.pos.z + (next.pos.z - current.pos.z) * sectionProgress
        );

        const targetLook = new THREE.Vector3(
            current.look.x + (next.look.x - current.look.x) * sectionProgress,
            current.look.y + (next.look.y - current.look.y) * sectionProgress,
            current.look.z + (next.look.z - current.look.z) * sectionProgress
        );

        gsap.to(this.camera.position, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 1,
            ease: "power2.out"
        });

        const currentLook = new THREE.Vector3();
        this.camera.getWorldDirection(currentLook);
        currentLook.add(this.camera.position);

        const lookAtProxy = { x: currentLook.x, y: currentLook.y, z: currentLook.z };
        gsap.to(lookAtProxy, {
            x: targetLook.x,
            y: targetLook.y,
            z: targetLook.z,
            duration: 1,
            onUpdate: () => {
                this.camera.lookAt(lookAtProxy.x, lookAtProxy.y, lookAtProxy.z);
            }
        });
    }

    animate() {
        const elapsedTime = this.clock.getElapsedTime();

        for (let i = 0; i < this.particleCount; i++) {
            this.particlePositions[i * 3 + 1] -= this.particleVelocities[i];
            if (this.particlePositions[i * 3 + 1] < 0) {
                this.particlePositions[i * 3 + 1] = 10;
            }
        }
        this.particles.geometry.attributes.position.needsUpdate = true;

        this.neonLights.forEach((light, i) => {
            light.intensity = 1.5 + Math.sin(elapsedTime * 2 + i) * 0.5;
        });

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }
}
