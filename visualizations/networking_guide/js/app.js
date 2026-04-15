// ============================================
// Main Enhanced JavaScript
// ============================================

// Global state
const state = {
    currentSection: 0,
    totalSections: 8,
    isScrolling: false,
    sidebarCollapsed: false
};

// DOM Elements
let slides, navLinks, prevBtn, nextBtn, progressFill, currentSlideSpan;
let sidebar, toggleSidebarBtn, mainContent;

// ============================================
// Initialize
// ============================================
function init() {
    console.log('🚀 Initializing Enhanced Presentation...');
    
    // Get DOM elements
    slides = document.querySelectorAll('.slide');
    navLinks = document.querySelectorAll('.nav-link');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    progressFill = document.getElementById('progressFill');
    currentSlideSpan = document.getElementById('currentSlide');
    sidebar = document.getElementById('sidebar');
    toggleSidebarBtn = document.getElementById('sidebarOpen');
    mainContent = document.getElementById('mainContent');
    
    // Initialize event listeners
    initEventListeners();
    
    // Update initial state
    updateUI();
    
    // Load saved sidebar state
    loadSidebarState();
    
    // Initialize keyboard shortcuts
    initKeyboardShortcuts();
    
    // Initialize touch gestures
    initTouchGestures();
    
    // Add intersection observer for auto-updating current section
    initIntersectionObserver();
    
    console.log('✅ Enhanced Presentation initialized');
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', () => navigateToSection(state.currentSection - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateToSection(state.currentSection + 1));
    
    // Sidebar links
    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToSection(index);
        });
    });
    
    // Sidebar toggle
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', toggleSidebar);
    }
    
    // Window resize
    window.addEventListener('resize', handleResize);
    
    // Scroll event (for manual scrolling)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (!state.isScrolling) {
                detectCurrentSection();
            }
        }, 150);
    });
}

// ============================================
// Navigation Functions
// ============================================
function navigateToSection(sectionIndex) {
    if (sectionIndex < 0 || sectionIndex >= state.totalSections || state.isScrolling) {
        return;
    }
    
    state.currentSection = sectionIndex;
    state.isScrolling = true;
    
    // Smooth scroll to section
    slides[sectionIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Update UI
    updateUI();
    
    // Update URL hash
    updateHash();
    
    // Reset scrolling flag
    setTimeout(() => {
        state.isScrolling = false;
    }, 1000);
}

function detectCurrentSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    slides.forEach((slide, index) => {
        const slideTop = slide.offsetTop;
        const slideBottom = slideTop + slide.offsetHeight;
        
        if (scrollPosition >= slideTop && scrollPosition < slideBottom) {
            if (state.currentSection !== index) {
                state.currentSection = index;
                updateUI();
            }
        }
    });
}

// ============================================
// UI Update Functions
// ============================================
function updateUI() {
    updateNavLinks();
    updateProgressBar();
    updateNavigationButtons();
    updateSlideIndicator();
}

function updateNavLinks() {
    navLinks.forEach((link, index) => {
        if (index === state.currentSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function updateProgressBar() {
    const progress = (state.currentSection / (state.totalSections - 1)) * 100;
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
}

function updateNavigationButtons() {
    if (prevBtn) {
        prevBtn.disabled = state.currentSection === 0;
        prevBtn.style.opacity = state.currentSection === 0 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = state.currentSection === state.totalSections - 1;
        nextBtn.style.opacity = state.currentSection === state.totalSections - 1 ? '0.5' : '1';
    }
}

function updateSlideIndicator() {
    if (currentSlideSpan) {
        currentSlideSpan.textContent = state.currentSection + 1;
    }
}

function updateHash() {
    const currentSlide = slides[state.currentSection];
    if (currentSlide) {
        const sectionId = currentSlide.getAttribute('id');
        if (sectionId) {
            history.replaceState(null, null, `#${sectionId}`);
        }
    }
}

// ============================================
// Sidebar Functions
// ============================================
function toggleSidebar() {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }
    
    // Update toggle button icon
    if (toggleSidebarBtn) {
        const icon = toggleSidebarBtn.querySelector('i');
        if (icon) {
            if (state.sidebarCollapsed) {
                icon.classList.remove('fa-chevron-left');
                icon.classList.add('fa-chevron-right');
            } else {
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-left');
            }
        }
    }
    
    // Save state
    localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed);
}

function loadSidebarState() {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved === 'true') {
        toggleSidebar();
    }
}

// ============================================
// Keyboard Shortcuts
// ============================================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                navigateToSection(state.currentSection + 1);
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                navigateToSection(state.currentSection - 1);
                break;
            case ' ':
                e.preventDefault();
                navigateToSection(state.currentSection + 1);
                break;
            case 'Home':
                e.preventDefault();
                navigateToSection(0);
                break;
            case 'End':
                e.preventDefault();
                navigateToSection(state.totalSections - 1);
                break;
            case 'f':
            case 'F':
                if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    toggleFullscreen();
                }
                break;
        }
    });
}

// ============================================
// Touch Gestures
// ============================================
function initTouchGestures() {
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 200;
        const difference = touchStartY - touchEndY;
        
        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                // Swiped up - next section
                navigateToSection(state.currentSection + 1);
            } else {
                // Swiped down - previous section
                navigateToSection(state.currentSection - 1);
            }
        }
    }
}

// ============================================
// Intersection Observer
// ============================================
function initIntersectionObserver() {
    const options = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !state.isScrolling) {
                const sectionIndex = parseInt(entry.target.dataset.section);
                if (!isNaN(sectionIndex) && sectionIndex !== state.currentSection) {
                    state.currentSection = sectionIndex;
                    updateUI();
                }
            }
        });
    }, options);
    
    slides.forEach(slide => observer.observe(slide));
}

// ============================================
// Utility Functions
// ============================================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function handleResize() {
    // Reinitialize simulations on resize if needed
    if (window.innerWidth <= 968) {
        // Mobile adjustments
        if (sidebar && !sidebar.classList.contains('collapsed')) {
            toggleSidebar();
        }
    }
}

function navigateToHash() {
    const hash = window.location.hash;
    if (hash) {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            const sectionIndex = parseInt(targetSection.dataset.section);
            if (!isNaN(sectionIndex)) {
                setTimeout(() => {
                    navigateToSection(sectionIndex);
                }, 100);
            }
        }
    }
}

// ============================================
// Page Visibility
// ============================================
function handleVisibilityChange() {
    if (document.hidden) {
        // Pause heavy animations when page is hidden
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations when page is visible
        console.log('Page visible - resuming animations');
    }
}

document.addEventListener('visibilitychange', handleVisibilityChange);

// ============================================
// Hash Change Handler
// ============================================
window.addEventListener('hashchange', navigateToHash);

// ============================================
// Loading Animation
// ============================================
function showLoadingAnimation() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// ============================================
// Mobile Menu Handler
// ============================================
function handleMobileMenu() {
    if (window.innerWidth <= 968) {
        // Close sidebar when clicking on main content on mobile
        if (mainContent) {
            mainContent.addEventListener('click', () => {
                if (sidebar && !sidebar.classList.contains('collapsed')) {
                    toggleSidebar();
                }
            });
        }
        
        // Close sidebar after clicking a nav link on mobile
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 968 && sidebar && !sidebar.classList.contains('collapsed')) {
                    setTimeout(() => toggleSidebar(), 300);
                }
            });
        });
    }
}

// ============================================
// Performance Monitoring
// ============================================
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            lastTime: performance.now(),
            frames: 0
        };
    }
    
    update() {
        this.metrics.frames++;
        const currentTime = performance.now();
        const delta = currentTime - this.metrics.lastTime;
        
        if (delta >= 1000) {
            this.metrics.fps = Math.round((this.metrics.frames * 1000) / delta);
            this.metrics.frames = 0;
            this.metrics.lastTime = currentTime;
            
            // Log if FPS is too low
            if (this.metrics.fps < 30) {
                console.warn('Low FPS detected:', this.metrics.fps);
            }
        }
        
        requestAnimationFrame(() => this.update());
    }
    
    start() {
        this.update();
    }
}

// ============================================
// API for External Access
// ============================================
window.presentationAPI = {
    navigateToSection,
    getCurrentSection: () => state.currentSection,
    getTotalSections: () => state.totalSections,
    toggleSidebar,
    toggleFullscreen,
    state,
    version: '2.0.0'
};

// ============================================
// Initialize Everything
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        showLoadingAnimation();
        init();
        handleMobileMenu();
        navigateToHash();
        
        // Start performance monitoring in development
        if (window.location.hostname === 'localhost') {
            const perfMonitor = new PerformanceMonitor();
            perfMonitor.start();
        }
    });
} else {
    showLoadingAnimation();
    init();
    handleMobileMenu();
    navigateToHash();
}

// ============================================
// Export for debugging
// ============================================
console.log('📱 Presentation API available at window.presentationAPI');
console.log('🎮 Bridge Demo:', 'bridgeDemo.sendPacket("PC-A", "PC-D")');
console.log('🎮 Router Demo:', 'routerDemo.sendPacket("192.168.1.10", "8.8.8.8")');
console.log('🎮 Switch Demo:', 'switchDemo.sendFrame("PC1", "PC2")');