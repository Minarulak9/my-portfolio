// ============================================
// Animations and Visual Effects
// ============================================

// ============================================
// OSI Stack Interactive Visualization
// ============================================
class OSIStackVisualization {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        if (!this.container.node()) return;
        
        this.width = Math.min(1100, window.innerWidth - 100);
        this.height = 500;
        
        this.layers = [
            { number: 7, name: 'Application', color: '#e74c3c', devices: ['Gateway'] },
            { number: 6, name: 'Presentation', color: '#e67e22', devices: ['Gateway'] },
            { number: 5, name: 'Session', color: '#f39c12', devices: ['Gateway'] },
            { number: 4, name: 'Transport', color: '#f1c40f', devices: ['Gateway', 'Firewall'] },
            { number: 3, name: 'Network', color: '#2ecc71', devices: ['Router', 'Firewall', 'Gateway'] },
            { number: 2, name: 'Data Link', color: '#3498db', devices: ['Bridge', 'Switch', 'VPN'] },
            { number: 1, name: 'Physical', color: '#9b59b6', devices: [] }
        ];
        
        this.init();
    }

    init() {
        this.svg = this.container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        const layerHeight = (this.height - 100) / 7;
        const layerWidth = this.width * 0.6;
        const startX = (this.width - layerWidth) / 2;

        // Create layers
        this.layerGroups = this.svg.selectAll('.layer')
            .data(this.layers)
            .enter()
            .append('g')
            .attr('class', 'layer')
            .attr('transform', (d, i) => `translate(${startX}, ${50 + i * layerHeight})`)
            .style('cursor', 'pointer')
            .on('mouseenter', (event, d) => this.highlightLayer(d))
            .on('mouseleave', () => this.resetLayers());

        // Layer rectangles
        this.layerGroups.append('rect')
            .attr('class', 'layer-rect')
            .attr('width', layerWidth)
            .attr('height', layerHeight - 5)
            .attr('fill', d => d.color)
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .attr('rx', 8)
            .style('opacity', 0)
            .transition()
            .delay((d, i) => i * 100)
            .duration(800)
            .style('opacity', 0.8);

        // Layer numbers
        this.layerGroups.append('text')
            .attr('class', 'layer-number')
            .attr('x', 30)
            .attr('y', layerHeight / 2)
            .attr('dy', '0.35em')
            .attr('fill', 'white')
            .attr('font-size', '24px')
            .attr('font-weight', 'bold')
            .style('opacity', 0)
            .text(d => `L${d.number}`)
            .transition()
            .delay((d, i) => i * 100 + 200)
            .duration(600)
            .style('opacity', 1);

        // Layer names
        this.layerGroups.append('text')
            .attr('class', 'layer-name')
            .attr('x', 80)
            .attr('y', layerHeight / 2)
            .attr('dy', '0.35em')
            .attr('fill', 'white')
            .attr('font-size', '20px')
            .attr('font-weight', '600')
            .style('opacity', 0)
            .text(d => d.name)
            .transition()
            .delay((d, i) => i * 100 + 400)
            .duration(600)
            .style('opacity', 1);

        // Device badges
        this.layerGroups.each((layerData, i, nodes) => {
            const group = d3.select(nodes[i]);
            
            layerData.devices.forEach((device, j) => {
                const badge = group.append('g')
                    .attr('transform', `translate(${layerWidth - 120 - j * 90}, ${layerHeight / 2})`);

                badge.append('rect')
                    .attr('x', -40)
                    .attr('y', -12)
                    .attr('width', 80)
                    .attr('height', 24)
                    .attr('fill', 'rgba(255, 255, 255, 0.2)')
                    .attr('stroke', 'white')
                    .attr('rx', 12)
                    .style('opacity', 0)
                    .transition()
                    .delay(i * 100 + 600)
                    .duration(600)
                    .style('opacity', 1);

                badge.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '0.35em')
                    .attr('fill', 'white')
                    .attr('font-size', '11px')
                    .attr('font-weight', '600')
                    .text(device)
                    .style('opacity', 0)
                    .transition()
                    .delay(i * 100 + 600)
                    .duration(600)
                    .style('opacity', 1);
            });
        });

        // Add data flow animation
        this.animateDataFlow();
    }

    highlightLayer(layerData) {
        // Dim all layers
        this.svg.selectAll('.layer-rect')
            .transition()
            .duration(200)
            .style('opacity', 0.3);

        // Highlight selected layer
        this.svg.selectAll('.layer-rect')
            .filter(d => d.number === layerData.number)
            .transition()
            .duration(200)
            .style('opacity', 1)
            .attr('stroke-width', 4);
    }

    resetLayers() {
        this.svg.selectAll('.layer-rect')
            .transition()
            .duration(200)
            .style('opacity', 0.8)
            .attr('stroke-width', 2);
    }

    animateDataFlow() {
        const layerHeight = (this.height - 100) / 7;
        const startX = (this.width - this.width * 0.6) / 2;

        const animatePacket = () => {
            const packet = this.svg.append('circle')
                .attr('cx', startX - 30)
                .attr('cy', 50 + layerHeight / 2)
                .attr('r', 8)
                .attr('fill', '#fdbb2d')
                .attr('stroke', 'white')
                .attr('stroke-width', 2);

            // Animate down through layers
            let currentY = 50 + layerHeight / 2;
            
            for (let i = 0; i < 7; i++) {
                const nextY = 50 + (i + 1) * layerHeight - layerHeight / 2;
                
                packet.transition()
                    .delay(i * 500)
                    .duration(400)
                    .attr('cy', nextY)
                    .attr('r', 12)
                    .transition()
                    .duration(100)
                    .attr('r', 8);
            }

            packet.transition()
                .delay(7 * 500)
                .duration(500)
                .style('opacity', 0)
                .remove();

            // Repeat animation
            setTimeout(animatePacket, 8000);
        };

        setTimeout(animatePacket, 2000);
    }
}

// ============================================
// Particle Background Effect
// ============================================
class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        
        this.init();
    }

    init() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.opacity = '0.3';
        
        document.body.appendChild(this.canvas);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(102, 126, 234, 0.5)';
            this.ctx.fill();
        });
        
        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(102, 126, 234, ${1 - distance / 100})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Scroll Animations with GSAP
// ============================================
function initScrollAnimations() {
    // Animate section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Animate explanation panels
    gsap.utils.toArray('.explanation-panel').forEach(panel => {
        gsap.from(panel, {
            scrollTrigger: {
                trigger: panel,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: -50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Animate playground panels
    gsap.utils.toArray('.playground-panel').forEach(panel => {
        gsap.from(panel, {
            scrollTrigger: {
                trigger: panel,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Animate application cards
    gsap.utils.toArray('.app-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'back.out(1.7)'
        });
    });
}

// ============================================
// Feature Card Hover Effects
// ============================================
function initFeatureCardEffects() {
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// ============================================
// Initialize All Animations
// ============================================
function initAnimations() {
    console.log('🎨 Initializing animations...');
    
    // Initialize OSI Stack Visualization
    if (document.getElementById('osiStackViz')) {
        new OSIStackVisualization('osiStackViz');
    }
    
    // Initialize particle background (optional - can be resource intensive)
    // new ParticleBackground();
    
    // Initialize scroll animations
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        // Register GSAP ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            initScrollAnimations();
        }
    }
    
    // Initialize feature card effects
    initFeatureCardEffects();
    
    console.log('✅ Animations initialized');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}

// Export for use in other files
window.animationHelpers = {
    OSIStackVisualization,
    ParticleBackground
};