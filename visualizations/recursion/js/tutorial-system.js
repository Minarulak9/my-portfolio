// Tutorial System for Basic Mode
class TutorialSystem {
    constructor() {
        this.steps = [
            {
                target: '.example-selector',
                title: '1. Choose an Example',
                message: 'Start by selecting Factorial or Power Function. These are the easiest to understand!',
                position: 'bottom'
            },
            {
                target: '#parameterInputs',
                title: '2. Set a Number',
                message: 'Try a small number first (like 3 or 4). You can increase it later!',
                position: 'bottom'
            },
            {
                target: '#runBtn',
                title: '3. Click Run!',
                message: 'Watch the magic happen! See how the function calls itself.',
                position: 'right'
            },
            {
                target: '.visualization-area',
                title: '4. Watch the Animation',
                message: 'Each colored box is a function call. See how they stack up and then return!',
                position: 'left'
            },
            {
                target: '#console',
                title: '5. Read the Console',
                message: 'The console shows you what\'s happening step by step.',
                position: 'left'
            }
        ];
        
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
    }
    
    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentStep = 0;
        this.createOverlay();
        this.showStep(0);
    }
    
    createOverlay() {
        // Create overlay container
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        this.overlay.innerHTML = `
            <div class="tutorial-spotlight"></div>
            <div class="tutorial-tooltip">
                <div class="tutorial-header">
                    <h3 class="tutorial-title"></h3>
                    <button class="tutorial-close">✕</button>
                </div>
                <p class="tutorial-message"></p>
                <div class="tutorial-controls">
                    <button class="tutorial-prev">← Previous</button>
                    <span class="tutorial-progress"></span>
                    <button class="tutorial-next">Next →</button>
                </div>
                <button class="tutorial-skip">Skip Tutorial</button>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        
        // Add event listeners
        this.overlay.querySelector('.tutorial-close').addEventListener('click', () => this.end());
        this.overlay.querySelector('.tutorial-skip').addEventListener('click', () => this.end());
        this.overlay.querySelector('.tutorial-prev').addEventListener('click', () => this.prevStep());
        this.overlay.querySelector('.tutorial-next').addEventListener('click', () => this.nextStep());
    }
    
    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) {
            this.end();
            return;
        }
        
        this.currentStep = stepIndex;
        const step = this.steps[stepIndex];
        
        // Update tooltip content
        const tooltip = this.overlay.querySelector('.tutorial-tooltip');
        tooltip.querySelector('.tutorial-title').textContent = step.title;
        tooltip.querySelector('.tutorial-message').textContent = step.message;
        tooltip.querySelector('.tutorial-progress').textContent = `${stepIndex + 1} / ${this.steps.length}`;
        
        // Update button states
        const prevBtn = tooltip.querySelector('.tutorial-prev');
        const nextBtn = tooltip.querySelector('.tutorial-next');
        
        prevBtn.disabled = stepIndex === 0;
        nextBtn.textContent = stepIndex === this.steps.length - 1 ? 'Finish' : 'Next →';
        
        // Position spotlight and tooltip
        this.positionElements(step);
        
        // Animate in
        gsap.from(tooltip, {
            duration: 0.5,
            scale: 0.8,
            opacity: 0,
            ease: 'back.out(1.7)'
        });
    }
    
    positionElements(step) {
        const target = document.querySelector(step.target);
        if (!target) {
            console.warn(`Tutorial target not found: ${step.target}`);
            return;
        }
        
        const rect = target.getBoundingClientRect();
        const spotlight = this.overlay.querySelector('.tutorial-spotlight');
        const tooltip = this.overlay.querySelector('.tutorial-tooltip');
        
        // Position spotlight
        spotlight.style.left = `${rect.left - 10}px`;
        spotlight.style.top = `${rect.top - 10}px`;
        spotlight.style.width = `${rect.width + 20}px`;
        spotlight.style.height = `${rect.height + 20}px`;
        
        // Position tooltip based on step.position
        const tooltipRect = tooltip.getBoundingClientRect();
        
        switch (step.position) {
            case 'bottom':
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
                tooltip.style.top = `${rect.bottom + 20}px`;
                break;
            case 'top':
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
                tooltip.style.top = `${rect.top - tooltipRect.height - 20}px`;
                break;
            case 'left':
                tooltip.style.left = `${rect.left - tooltipRect.width - 20}px`;
                tooltip.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
                break;
            case 'right':
                tooltip.style.left = `${rect.right + 20}px`;
                tooltip.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
                break;
        }
        
        // Ensure tooltip stays in viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const tooltipLeft = parseFloat(tooltip.style.left);
        const tooltipTop = parseFloat(tooltip.style.top);
        
        if (tooltipLeft + tooltipRect.width > viewportWidth) {
            tooltip.style.left = `${viewportWidth - tooltipRect.width - 20}px`;
        }
        if (tooltipLeft < 0) {
            tooltip.style.left = '20px';
        }
        if (tooltipTop + tooltipRect.height > viewportHeight) {
            tooltip.style.top = `${viewportHeight - tooltipRect.height - 20}px`;
        }
        if (tooltipTop < 0) {
            tooltip.style.top = '20px';
        }
    }
    
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.end();
        }
    }
    
    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }
    
    end() {
        if (!this.isActive) return;
        
        this.isActive = false;
        
        if (this.overlay) {
            gsap.to(this.overlay, {
                duration: 0.3,
                opacity: 0,
                onComplete: () => {
                    if (this.overlay) {
                        this.overlay.remove();
                        this.overlay = null;
                    }
                }
            });
        }
        
        // Mark tutorial as completed
        localStorage.setItem('tutorialCompleted', 'true');
    }
    
    shouldShow() {
        // Show tutorial only in basic mode and if not completed
        const completed = localStorage.getItem('tutorialCompleted');
        const isBasicMode = window.levelManager && window.levelManager.currentLevel === 'basic';
        return isBasicMode && !completed;
    }
}

// Create global instance
window.tutorialSystem = new TutorialSystem();

// Auto-start tutorial in basic mode
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.tutorialSystem && window.tutorialSystem.shouldShow()) {
            setTimeout(() => {
                window.tutorialSystem.start();
            }, 2000); // Start 2 seconds after page load
        }
    }, 500);
});