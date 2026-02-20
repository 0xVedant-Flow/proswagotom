import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ThreeScene } from './three-scene.js';
import { ScrollManager } from './scroll-animations.js';
import { injectPortfolioData } from './interactions.js';
import { fetchData, initTypewriter } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const dataPromise = fetchData('./data/portfolio-data.json');
    const threeScene = new ThreeScene('canvas');

    const portfolioData = await dataPromise;
    if (portfolioData) {
        injectPortfolioData(portfolioData);
    }

    const composer = new EffectComposer(threeScene.renderer);
    const renderPass = new RenderPass(threeScene.scene, threeScene.camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.2,
        0.4,
        0.85
    );
    composer.addPass(bloomPass);

    const originalAnimate = threeScene.animate.bind(threeScene);
    threeScene.animate = function () {
        const elapsedTime = this.clock.getElapsedTime();
        for (let i = 0; i < this.particleCount; i++) {
            this.particlePositions[i * 3 + 1] -= this.particleVelocities[i];
            if (this.particlePositions[i * 3 + 1] < 0) this.particlePositions[i * 3 + 1] = 10;
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.neonLights.forEach((light, i) => {
            light.intensity = 1.5 + Math.sin(elapsedTime * 2 + i) * 0.5;
        });
        composer.render();
        requestAnimationFrame(() => this.animate());
    };

    const scrollManager = new ScrollManager(threeScene);

    const hideLoader = () => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('loaded');
            if (portfolioData) {
                initTypewriter('about-text', portfolioData.summary, 20);
            }
        }
    };

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }

    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let currentKeyIdx = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[currentKeyIdx]) {
            currentKeyIdx++;
            if (currentKeyIdx === konamiCode.length) {
                activateEasterEgg();
                currentKeyIdx = 0;
            }
        } else {
            currentKeyIdx = 0;
        }
    });

    function activateEasterEgg() {
        document.body.style.filter = 'hue-rotate(90deg)';
        alert('SECURITY BYPASSED: DEVELOPER MODE ACTIVE');
    }

    window.addEventListener('resize', () => {
        composer.setSize(window.innerWidth, window.innerHeight);
    });
});
