import * as THREE from "three";
import { gsap } from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import ThreeInstance from "./ThreeInstance";
import BaseThree from "./BaseThree";

export default class LoadingManager extends BaseThree {
    public loadingManager: THREE.LoadingManager;
    private _loadingContainer!: HTMLDivElement
    constructor(config: any, instance: ThreeInstance) {
        super(instance);
        this.createLoading()
        const loadingBarElement = document.querySelector('.loading-bar') as HTMLDivElement

        this.loadingManager = new THREE.LoadingManager(
            // Loaded
            () => {
                // gsap.to(overlayMaterial.uniforms.uAlpha, {
                //     duration: 0.34, value: 0, delay: 0, onComplete: () => {
                //         this._loadingMesh.removeFromParent()
                //     }
                // })
                gsap.set(this._loadingContainer.style, { opacity: 1 })
                gsap.to(this._loadingContainer.style, {
                    duration: 5, opacity: 0, ease: "power1.inOut"
                })

                window.setTimeout(() => {
                    loadingBarElement.style.transform = 'scaleX(0)'
                    loadingBarElement.style.transformOrigin = '100% 0';
                    loadingBarElement.style.transition = 'transform 1.5s ease-in-out';
                }, 500)
            },
            // Progress
            (url, loaded, total) => {
                const progressRatio = loaded / total
                loadingBarElement.style.transform = `scaleX(${progressRatio})`
            },
            () => {
                console.log("error");
            }
        );
    }
    createLoading() {
        const loadingPage = document.createElement('div');
        loadingPage.className = 'loading-page';
        loadingPage.style.position = 'fixed';
        loadingPage.style.top = '0';
        loadingPage.style.left = '0';
        loadingPage.style.width = '100%';
        loadingPage.style.height = '100vh';
        loadingPage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        loadingPage.style.pointerEvents = 'none';
        document.body.appendChild(loadingPage);
        const loadingBar = document.createElement('div');
        loadingBar.className = 'loading-bar';
        loadingPage.appendChild(loadingBar);
        loadingBar.style.position = 'absolute';
        loadingBar.style.top = "50%"
        loadingBar.style.width = '100%';
        loadingBar.style.height = '2px';
        loadingBar.style.background = '#ffffff';
        loadingBar.style.transform = 'scaleX(0)';
        loadingBar.style.transformOrigin = 'top left';
        loadingBar.style.transition = 'transform  0.5s';

        this._loadingContainer = loadingPage

    }
    createOverlay() {
        const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
        const overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uAlpha: { value: 0.5 },
            },
            vertexShader: `
                void main()
                {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
              uniform float uAlpha;

                void main()
                {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
                }
            `,
        });
        const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
        this.scene.add(overlay);
        return overlayMaterial;
    }

    resize() { }
    update() { }
    dispose() { }
}
