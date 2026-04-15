/* ================================
   Animation Controller - Anime.js
   ================================ */

class AnimationController {
    constructor() {
        this.isPlaying = false;
        this.speed = 1;
        this.animations = [];
        this.packetSize = 5;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setPacketSize(size) {
        this.packetSize = size;
    }

    // Animate UI elements
    slideIn(element, direction = 'left', duration = 400) {
        const translations = {
            left: { from: '-100%', to: '0%', property: 'translateX' },
            right: { from: '100%', to: '0%', property: 'translateX' },
            top: { from: '-100%', to: '0%', property: 'translateY' },
            bottom: { from: '100%', to: '0%', property: 'translateY' }
        };

        const config = translations[direction];
        
        anime({
            targets: element,
            [config.property]: [config.from, config.to],
            opacity: [0, 1],
            duration: duration,
            easing: 'easeOutExpo'
        });
    }

    slideOut(element, direction = 'left', duration = 400) {
        const translations = {
            left: { to: '-100%', property: 'translateX' },
            right: { to: '100%', property: 'translateX' },
            top: { to: '-100%', property: 'translateY' },
            bottom: { to: '100%', property: 'translateY' }
        };

        const config = translations[direction];
        
        return anime({
            targets: element,
            [config.property]: config.to,
            opacity: 0,
            duration: duration,
            easing: 'easeInExpo'
        }).finished;
    }

    fadeIn(element, duration = 300) {
        anime({
            targets: element,
            opacity: [0, 1],
            duration: duration,
            easing: 'easeOutQuad'
        });
    }

    fadeOut(element, duration = 300) {
        return anime({
            targets: element,
            opacity: 0,
            duration: duration,
            easing: 'easeInQuad'
        }).finished;
    }

    scaleIn(element, duration = 300) {
        anime({
            targets: element,
            scale: [0, 1],
            opacity: [0, 1],
            duration: duration,
            easing: 'easeOutElastic(1, .6)'
        });
    }

    scaleOut(element, duration = 200) {
        return anime({
            targets: element,
            scale: 0,
            opacity: 0,
            duration: duration,
            easing: 'easeInQuad'
        }).finished;
    }

    pulse(element, scale = 1.1, duration = 600) {
        anime({
            targets: element,
            scale: [1, scale, 1],
            duration: duration,
            easing: 'easeInOutQuad'
        });
    }

    shake(element, intensity = 10, duration = 500) {
        anime({
            targets: element,
            translateX: [
                { value: intensity, duration: duration / 10 },
                { value: -intensity, duration: duration / 10 },
                { value: intensity / 2, duration: duration / 10 },
                { value: -intensity / 2, duration: duration / 10 },
                { value: 0, duration: duration / 10 }
            ],
            easing: 'easeInOutQuad'
        });
    }

    // Notification animations
    showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toastContainer');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.25rem;">
                    ${this.getToastIcon(type)}
                </span>
                <span>${message}</span>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Slide in
        anime({
            targets: toast,
            translateX: ['100%', '0%'],
            opacity: [0, 1],
            duration: 400,
            easing: 'easeOutExpo'
        });

        // Auto remove
        setTimeout(() => {
            anime({
                targets: toast,
                translateX: '100%',
                opacity: 0,
                duration: 300,
                easing: 'easeInExpo',
                complete: () => toast.remove()
            });
        }, duration);
    }

    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // Loading animations
    showLoading(element, message = 'Loading...') {
        element.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                <div class="loader"></div>
                <p>${message}</p>
            </div>
        `;
        this.fadeIn(element);
    }

    hideLoading(element) {
        return this.fadeOut(element);
    }

    // Data packet animations
    createPacketAnimation(startX, startY, endX, endY, color = '#60a5fa') {
        const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        packet.setAttribute('class', 'animated-packet');
        packet.setAttribute('cx', startX);
        packet.setAttribute('cy', startY);
        packet.setAttribute('r', this.packetSize);
        packet.setAttribute('fill', color);
        packet.style.filter = 'drop-shadow(0 0 8px currentColor)';

        document.querySelector('#networkCanvas').appendChild(packet);

        const distance = Math.sqrt(
            Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
        );
        
        const duration = (distance / this.speed) * 2;

        anime({
            targets: packet,
            cx: endX,
            cy: endY,
            duration: duration,
            easing: 'linear',
            complete: () => {
                // Burst effect on arrival
                anime({
                    targets: packet,
                    r: this.packetSize * 3,
                    opacity: 0,
                    duration: 200,
                    easing: 'easeOutQuad',
                    complete: () => packet.remove()
                });
            }
        });

        return packet;
    }

    // Network traffic visualization
    animateTraffic(links, intensity = 'medium') {
        const intensityMap = {
            low: { count: 2, interval: 2000 },
            medium: { count: 5, interval: 1000 },
            high: { count: 10, interval: 500 }
        };

        const config = intensityMap[intensity] || intensityMap.medium;

        links.forEach((link, index) => {
            const sendPackets = () => {
                for (let i = 0; i < config.count; i++) {
                    setTimeout(() => {
                        if (this.isPlaying) {
                            this.createPacketAnimation(
                                link.source.x,
                                link.source.y,
                                link.target.x,
                                link.target.y
                            );
                        }
                    }, i * (config.interval / config.count));
                }
            };

            // Stagger start for different links
            setTimeout(() => {
                if (this.isPlaying) {
                    sendPackets();
                    this.animations.push(
                        setInterval(() => {
                            if (this.isPlaying) sendPackets();
                        }, config.interval)
                    );
                }
            }, index * 200);
        });
    }

    // Protocol layer animation
    animateProtocolLayers(layers, container) {
        container.innerHTML = '';
        
        layers.forEach((layer, index) => {
            const layerDiv = document.createElement('div');
            layerDiv.style.cssText = `
                background: ${layer.color};
                padding: 1rem;
                margin: 0.5rem 0;
                border-radius: 0.5rem;
                color: white;
                font-weight: 600;
                opacity: 0;
                transform: translateX(-50px);
            `;
            layerDiv.innerHTML = `
                <div>${layer.name}</div>
                <div style="font-size: 0.75rem; opacity: 0.9; margin-top: 0.25rem;">
                    ${layer.description || ''}
                </div>
            `;
            container.appendChild(layerDiv);

            // Animate in with delay
            setTimeout(() => {
                anime({
                    targets: layerDiv,
                    translateX: 0,
                    opacity: 1,
                    duration: 600,
                    delay: index * 100,
                    easing: 'easeOutExpo'
                });
            }, 100);
        });
    }

    // Data flow animation (like loading bar)
    animateDataFlow(element, direction = 'horizontal') {
        const flow = document.createElement('div');
        flow.style.cssText = direction === 'horizontal'
            ? 'position: absolute; top: 0; left: 0; height: 3px; width: 0; background: linear-gradient(90deg, #3b82f6, #8b5cf6); z-index: 10;'
            : 'position: absolute; top: 0; left: 0; width: 3px; height: 0; background: linear-gradient(180deg, #3b82f6, #8b5cf6); z-index: 10;';
        
        element.style.position = 'relative';
        element.appendChild(flow);

        anime({
            targets: flow,
            [direction === 'horizontal' ? 'width' : 'height']: '100%',
            duration: 1000,
            easing: 'easeInOutQuad',
            complete: () => {
                anime({
                    targets: flow,
                    opacity: 0,
                    duration: 300,
                    complete: () => flow.remove()
                });
            }
        });
    }

    // Connection establishment animation (3-way handshake)
    animateHandshake(source, target, callback) {
        const colors = ['#3b82f6', '#8b5cf6', '#10b981'];
        const labels = ['SYN', 'SYN-ACK', 'ACK'];
        
        let step = 0;

        const sendStep = () => {
            if (step < 3) {
                const isReverse = step === 1;
                const startX = isReverse ? target.x : source.x;
                const startY = isReverse ? target.y : source.y;
                const endX = isReverse ? source.x : target.x;
                const endY = isReverse ? source.y : target.y;

                const packet = this.createPacketAnimation(
                    startX, startY, endX, endY, colors[step]
                );

                // Add label to packet
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', startX);
                label.setAttribute('y', startY - 10);
                label.setAttribute('fill', colors[step]);
                label.setAttribute('font-size', '10');
                label.setAttribute('font-weight', 'bold');
                label.textContent = labels[step];
                document.querySelector('#networkCanvas').appendChild(label);

                anime({
                    targets: label,
                    x: endX,
                    y: endY - 10,
                    duration: anime.get(packet, 'cx').duration,
                    easing: 'linear',
                    complete: () => label.remove()
                });

                setTimeout(() => {
                    step++;
                    if (step < 3) {
                        sendStep();
                    } else if (callback) {
                        callback();
                    }
                }, 800 / this.speed);
            }
        };

        sendStep();
    }

    // Button click effect
    buttonClickEffect(button) {
        anime({
            targets: button,
            scale: [1, 0.95, 1],
            duration: 200,
            easing: 'easeInOutQuad'
        });
    }

    // Modal animations
    showModal(modal) {
        modal.classList.add('visible');
        const content = modal.querySelector('.modal-content');
        
        anime({
            targets: modal,
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });

        anime({
            targets: content,
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 400,
            delay: 100,
            easing: 'easeOutElastic(1, .6)'
        });
    }

    hideModal(modal) {
        const content = modal.querySelector('.modal-content');
        
        anime({
            targets: content,
            scale: 0.8,
            opacity: 0,
            duration: 200,
            easing: 'easeInQuad'
        });

        anime({
            targets: modal,
            opacity: 0,
            duration: 300,
            delay: 100,
            easing: 'easeInQuad',
            complete: () => modal.classList.remove('visible')
        });
    }

    // Stats counter animation
    animateCounter(element, from, to, duration = 1000) {
        const obj = { value: from };
        
        anime({
            targets: obj,
            value: to,
            duration: duration,
            easing: 'easeOutExpo',
            update: () => {
                element.textContent = Math.round(obj.value);
            }
        });
    }

    // Progress bar animation
    animateProgress(element, progress, duration = 500) {
        anime({
            targets: element,
            width: `${progress}%`,
            duration: duration,
            easing: 'easeOutQuad'
        });
    }

    // Ripple effect
    createRipple(element, x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.5);
            transform: translate(-50%, -50%);
            pointer-events: none;
        `;
        
        element.appendChild(ripple);

        anime({
            targets: ripple,
            width: 100,
            height: 100,
            opacity: [0.5, 0],
            duration: 600,
            easing: 'easeOutQuad',
            complete: () => ripple.remove()
        });
    }

    // Start continuous animations
    start() {
        this.isPlaying = true;
    }

    // Pause animations
    pause() {
        this.isPlaying = false;
    }

    // Stop and clear all animations
    stop() {
        this.isPlaying = false;
        this.animations.forEach(anim => {
            if (typeof anim === 'number') {
                clearInterval(anim);
            } else if (anim && anim.pause) {
                anim.pause();
            }
        });
        this.animations = [];

        // Clear all animated packets
        document.querySelectorAll('.animated-packet').forEach(p => p.remove());
    }

    // Reset all animations
    reset() {
        this.stop();
        this.speed = 1;
        this.packetSize = 5;
    }

    // Network congestion visualization
    animateCongestion(element, duration = 3000) {
        const originalColor = window.getComputedStyle(element).backgroundColor;
        
        anime({
            targets: element,
            backgroundColor: ['#ef4444', originalColor],
            duration: duration,
            easing: 'easeInOutQuad',
            direction: 'alternate',
            loop: true
        });

        setTimeout(() => {
            anime.remove(element);
            element.style.backgroundColor = originalColor;
        }, duration);
    }

    // Device failure animation
    animateFailure(element) {
        const timeline = anime.timeline({
            easing: 'easeInOutQuad'
        });

        timeline
            .add({
                targets: element,
                scale: [1, 1.1],
                duration: 200
            })
            .add({
                targets: element,
                rotate: ['0deg', '-5deg', '5deg', '-5deg', '5deg', '0deg'],
                duration: 500
            })
            .add({
                targets: element,
                opacity: [1, 0.3, 1, 0.3, 1],
                duration: 1000
            });
    }

    // Success checkmark animation
    showCheckmark(container) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 52 52');
        svg.style.cssText = 'width: 52px; height: 52px; margin: 0 auto;';
        
        svg.innerHTML = `
            <circle cx="26" cy="26" r="25" fill="none" stroke="#10b981" stroke-width="2"/>
            <path fill="none" stroke="#10b981" stroke-width="3" d="M14 27l7 7 16-16"/>
        `;
        
        container.appendChild(svg);

        const circle = svg.querySelector('circle');
        const path = svg.querySelector('path');

        anime({
            targets: circle,
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 600,
            easing: 'easeInOutQuad'
        });

        anime({
            targets: path,
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 600,
            delay: 300,
            easing: 'easeInOutQuad'
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}