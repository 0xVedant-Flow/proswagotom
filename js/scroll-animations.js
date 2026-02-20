import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class ScrollManager {
    constructor(threeScene) {
        this.threeScene = threeScene;
        this.initLenis();
        this.initScrollTriggers();
    }

    initLenis() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        const raf = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        this.lenis.on('scroll', (e) => {
            const progress = e.animatedScroll / (document.documentElement.scrollHeight - window.innerHeight);
            this.threeScene.updateCamera(progress);

            this.updateNav(e.animatedScroll);
        });
    }

    initScrollTriggers() {
        const revealElements = document.querySelectorAll('.reveal-up');
        revealElements.forEach((el) => {
            ScrollTrigger.create({
                trigger: el,
                start: "top 80%",
                onEnter: () => el.classList.add('active'),
                onLeaveBack: () => el.classList.remove('active')
            });
        });

        gsap.to('#loader-progress', {
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: true
            },
            width: "100%"
        });
    }

    updateNav(scrollPos) {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-item');

        sections.forEach((section) => {
            const top = section.offsetTop - 100;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navItems.forEach((item) => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
}
