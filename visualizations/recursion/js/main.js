// Main Application Entry Point
let recursionEngine;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add small delay to ensure all elements are rendered
    setTimeout(() => {
        initializeApplication();
    }, 100);
});

function initializeApplication() {
    try {
        // Create main recursion engine
        recursionEngine = new RecursionEngine();
        
        // Log initialization
        console.log('🎉 Deep Recursion Visualizer initialized successfully!');
        logToConsole('🎉 Welcome to Deep Recursion Visualizer!', 'success');
        logToConsole('👈 Select an example from the left panel to begin', 'info');
        logToConsole('⚙️ Adjust parameters and click "Run" to see the magic', 'info');
        
        // Add welcome animation (with delay to ensure DOM is ready)
        setTimeout(() => {
            animateWelcome();
        }, 200);
        
        // Setup keyboard shortcuts
        setupKeyboardShortcuts();
        
        // Add tooltips
        addTooltips();
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showError('Failed to initialize application. Please refresh the page.');
    }
}

function animateWelcome() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, skipping animations');
        return;
    }
    
    // Add class to body to indicate GSAP is handling animations
    document.body.classList.add('gsap-loaded');
    
    // Animate header with GSAP - with null checks
    const title = document.querySelector('.title');
    if (title) {
        gsap.from(title, {
            duration: 1,
            y: -50,
            opacity: 0,
            ease: 'bounce.out'
        });
    }
    
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        gsap.from(subtitle, {
            duration: 0.8,
            opacity: 0,
            delay: 0.3
        });
    }
    
    // Animate panels
    const leftPanel = document.querySelector('.left-panel');
    if (leftPanel) {
        gsap.from(leftPanel, {
            duration: 0.8,
            x: -100,
            opacity: 0,
            delay: 0.5,
            ease: 'power3.out'
        });
    }
    
    const centerPanel = document.querySelector('.center-panel');
    if (centerPanel) {
        gsap.from(centerPanel, {
            duration: 0.8,
            y: 50,
            opacity: 0,
            delay: 0.6,
            ease: 'power3.out'
        });
    }
    
    const rightPanel = document.querySelector('.right-panel');
    if (rightPanel) {
        gsap.from(rightPanel, {
            duration: 0.8,
            x: 100,
            opacity: 0,
            delay: 0.7,
            ease: 'power3.out'
        });
    }
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter: Run
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('runBtn').click();
        }
        
        // Space: Pause/Resume
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            document.getElementById('pauseBtn').click();
        }
        
        // Ctrl/Cmd + R: Reset
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            document.getElementById('resetBtn').click();
        }
        
        // Arrow Right: Step
        if (e.code === 'ArrowRight' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            document.getElementById('stepBtn').click();
        }
        
        // Number keys 1-6: Select examples
        if (e.code.startsWith('Digit') && !e.target.matches('input, textarea')) {
            const num = parseInt(e.code.replace('Digit', ''));
            const examples = document.querySelectorAll('.example-btn');
            if (num >= 1 && num <= examples.length) {
                examples[num - 1].click();
            }
        }
    });
    
    // Log keyboard shortcuts info
    setTimeout(() => {
        logToConsole('⌨️ Keyboard shortcuts available:', 'info');
        logToConsole('  • Ctrl/Cmd + Enter: Run', 'info');
        logToConsole('  • Space: Pause/Resume', 'info');
        logToConsole('  • Ctrl/Cmd + R: Reset', 'info');
        logToConsole('  • 1-6: Select example', 'info');
    }, 2000);
}

function addTooltips() {
    // Add title attributes for tooltips
    const tooltips = {
        'runBtn': 'Run the recursion visualization (Ctrl+Enter)',
        'stepBtn': 'Execute one step at a time (Arrow Right)',
        'pauseBtn': 'Pause/Resume execution (Space)',
        'resetBtn': 'Reset visualization (Ctrl+R)',
        'speedSlider': 'Adjust animation speed',
        'showMemory': 'Toggle memory stack details',
        'show3D': 'Toggle 3D stack view',
        'showCallTree': 'Toggle call tree visualization',
        'showTimeline': 'Toggle timeline view'
    };
    
    Object.entries(tooltips).forEach(([id, tooltip]) => {
        const element = document.getElementById(id);
        if (element) {
            element.title = tooltip;
        }
    });
}

function logToConsole(message, type = 'info') {
    const consoleDiv = document.getElementById('console');
    if (!consoleDiv) return;
    
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    
    const timestamp = new Date().toLocaleTimeString();
    line.textContent = `[${timestamp}] ${message}`;
    
    consoleDiv.appendChild(line);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
    
    // Animate line entry (with GSAP check)
    if (typeof gsap !== 'undefined') {
        gsap.from(line, {
            duration: 0.3,
            x: -20,
            opacity: 0,
            ease: 'power2.out'
        });
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-weight: 600;
    `;
    
    document.body.appendChild(errorDiv);
    
    // Animate in (with GSAP check)
    if (typeof gsap !== 'undefined') {
        gsap.from(errorDiv, {
            duration: 0.5,
            y: -50,
            opacity: 0,
            ease: 'back.out(1.7)'
        });
        
        // Remove after 5 seconds
        setTimeout(() => {
            gsap.to(errorDiv, {
                duration: 0.5,
                y: -50,
                opacity: 0,
                ease: 'power2.in',
                onComplete: () => errorDiv.remove()
            });
        }, 5000);
    } else {
        // Fallback without GSAP
        errorDiv.style.opacity = '0';
        setTimeout(() => {
            errorDiv.style.transition = 'opacity 0.5s';
            errorDiv.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 500);
        }, 5000);
    }
}

// Utility functions
function formatNumber(num) {
    return num.toLocaleString();
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance monitoring
const performanceMonitor = {
    start: function(label) {
        performance.mark(`${label}-start`);
    },
    
    end: function(label) {
        performance.mark(`${label}-end`);
        performance.measure(label, `${label}-start`, `${label}-end`);
        const measure = performance.getEntriesByName(label)[0];
        console.log(`⏱️ ${label}: ${measure.duration.toFixed(2)}ms`);
        return measure.duration;
    },
    
    clear: function() {
        performance.clearMarks();
        performance.clearMeasures();
    }
};

// Analytics and tracking
const analytics = {
    trackExampleSelection: function(exampleName) {
        console.log('📊 Example selected:', exampleName);
    },
    
    trackExecution: function(exampleName, parameters, duration) {
        console.log('📊 Execution:', {
            example: exampleName,
            params: parameters,
            duration: duration
        });
    },
    
    trackError: function(error) {
        console.error('❌ Error tracked:', error);
    }
};

// Export for debugging
window.recursionEngine = recursionEngine;
window.performanceMonitor = performanceMonitor;
window.analytics = analytics;

// Add helpful console messages
console.log('%c🔄 Deep Recursion Visualizer', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cAccess the engine via window.recursionEngine', 'color: #10b981;');
console.log('%cKeyboard Shortcuts:', 'font-weight: bold; color: #ec4899;');
console.log('  Ctrl/Cmd + Enter: Run');
console.log('  Space: Pause/Resume');
console.log('  Ctrl/Cmd + R: Reset');
console.log('  1-6: Select example');

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && recursionEngine && recursionEngine.isRunning) {
        recursionEngine.pause();
        logToConsole('⏸️ Auto-paused (page hidden)', 'warning');
    }
});

// Handle errors globally
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showError('An error occurred. Check console for details.');
    analytics.trackError(e.error);
});

// Prevent accidental page navigation
window.addEventListener('beforeunload', (e) => {
    if (recursionEngine && recursionEngine.isRunning) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});