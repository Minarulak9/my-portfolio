// 3D Visualizer - Three.js based 3D stack visualization
class Stack3DVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.frames = [];
        this.frameMeshes = [];
        this.animationSpeed = 800;
        this.isAnimating = false;
        this.init();
    }
    
    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1e293b);
        this.scene.fog = new THREE.Fog(0x1e293b, 10, 50);
        
        // Camera setup
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 5, 15);
        this.camera.lookAt(0, 0, 0);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
        
        // Lighting
        this.setupLighting();
        
        // Grid helper
        const gridHelper = new THREE.GridHelper(20, 20, 0x6366f1, 0x334155);
        gridHelper.position.y = -5;
        this.scene.add(gridHelper);
        
        // Axis helper
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
        
        // Auto-rotation
        this.autoRotate = true;
        
        // Animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Point lights for dramatic effect
        const pointLight1 = new THREE.PointLight(0x6366f1, 1, 20);
        pointLight1.position.set(-5, 5, 5);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xec4899, 1, 20);
        pointLight2.position.set(5, 5, -5);
        this.scene.add(pointLight2);
    }
    
    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
    }
    
    clear() {
        // Remove all frame meshes
        this.frameMeshes.forEach(mesh => {
            this.scene.remove(mesh);
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) mesh.material.dispose();
        });
        this.frameMeshes = [];
        this.frames = [];
    }
    
    async visualize(calls, speed) {
        this.animationSpeed = speed;
        this.isAnimating = true;
        
        for (let i = 0; i < calls.length; i++) {
            const call = calls[i];
            
            if (call.type === 'call') {
                await this.pushFrame(call);
            } else if (call.type === 'return') {
                await this.popFrame(call);
            }
            
            await this.delay(this.animationSpeed);
        }
        
        this.isAnimating = false;
    }
    
    async pushFrame(call) {
        this.frames.push(call);
        const frameMesh = this.createFrameMesh(call, this.frames.length - 1);
        this.frameMeshes.push(frameMesh);
        this.scene.add(frameMesh);
        
        // Animate entrance
        frameMesh.scale.set(0, 0, 0);
        await this.animateScale(frameMesh, { x: 1, y: 1, z: 1 }, this.animationSpeed / 2);
    }
    
    async popFrame(call) {
        const frameIndex = this.frames.findIndex(f => f.id === call.id);
        if (frameIndex !== -1) {
            const frameMesh = this.frameMeshes[frameIndex];
            
            // Animate exit
            await this.animateScale(frameMesh, { x: 0, y: 0, z: 0 }, this.animationSpeed / 2);
            
            // Remove
            this.scene.remove(frameMesh);
            if (frameMesh.geometry) frameMesh.geometry.dispose();
            if (frameMesh.material) frameMesh.material.dispose();
            
            this.frames.splice(frameIndex, 1);
            this.frameMeshes.splice(frameIndex, 1);
            
            // Reposition remaining frames
            await this.repositionFrames();
        }
    }
    
    createFrameMesh(call, index) {
        // Create box geometry
        const geometry = new THREE.BoxGeometry(4, 1, 3);
        
        // Create material with gradient effect
        const isActive = index === this.frames.length;
        const color = isActive ? 0x6366f1 : this.getColorForDepth(call.depth);
        
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: isActive ? 0x4f46e5 : 0x0f172a,
            emissiveIntensity: isActive ? 0.5 : 0.1,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = index * 1.5 - 3;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Add edges
        const edges = new THREE.EdgesGeometry(geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({ 
            color: call.isBase ? 0x10b981 : 0x818cf8,
            linewidth: 2
        });
        const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
        mesh.add(edgeLines);
        
        // Add text sprite for parameters
        const sprite = this.createTextSprite(this.getParamsText(call));
        sprite.position.set(0, 0, 1.6);
        mesh.add(sprite);
        
        // Add depth indicator
        const depthSprite = this.createTextSprite(`D:${call.depth}`, 0.3, '#cbd5e1');
        depthSprite.position.set(-1.8, 0.3, 0);
        mesh.add(depthSprite);
        
        // Add return value if available
        if (call.return !== undefined) {
            const returnSprite = this.createTextSprite(`→ ${call.return}`, 0.4, '#10b981');
            returnSprite.position.set(1.8, -0.3, 0);
            mesh.add(returnSprite);
        }
        
        mesh.userData = { call: call };
        
        return mesh;
    }
    
    createTextSprite(text, scale = 0.5, color = '#f1f5f9') {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'Bold 32px Arial';
        context.fillStyle = color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(scale * 4, scale * 2, 1);
        
        return sprite;
    }
    
    async repositionFrames() {
        const promises = this.frameMeshes.map((mesh, index) => {
            const targetY = index * 1.5 - 3;
            return this.animatePosition(mesh, { y: targetY }, this.animationSpeed / 3);
        });
        await Promise.all(promises);
    }
    
    animateScale(mesh, target, duration) {
        return new Promise(resolve => {
            const start = { ...mesh.scale };
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = this.easeInOutCubic(progress);
                
                mesh.scale.x = start.x + (target.x - start.x) * eased;
                mesh.scale.y = start.y + (target.y - start.y) * eased;
                mesh.scale.z = start.z + (target.z - start.z) * eased;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    animatePosition(mesh, target, duration) {
        return new Promise(resolve => {
            const start = { ...mesh.position };
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = this.easeInOutCubic(progress);
                
                if (target.x !== undefined) mesh.position.x = start.x + (target.x - start.x) * eased;
                if (target.y !== undefined) mesh.position.y = start.y + (target.y - start.y) * eased;
                if (target.z !== undefined) mesh.position.z = start.z + (target.z - start.z) * eased;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    getColorForDepth(depth) {
        const colors = [0x6366f1, 0x8b5cf6, 0xec4899, 0xf43f5e, 0xf59e0b];
        return colors[depth % colors.length];
    }
    
    getParamsText(call) {
        return Object.entries(call.params)
            .map(([key, value]) => `${key}:${value}`)
            .join(' ');
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Auto-rotate camera
        if (this.autoRotate && !this.isAnimating) {
            this.camera.position.x = Math.sin(Date.now() * 0.0002) * 15;
            this.camera.position.z = Math.cos(Date.now() * 0.0002) * 15;
            this.camera.lookAt(0, 0, 0);
        }
        
        // Gentle rotation of frames
        this.frameMeshes.forEach((mesh, index) => {
            mesh.rotation.y = Math.sin(Date.now() * 0.001 + index) * 0.1;
        });
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}