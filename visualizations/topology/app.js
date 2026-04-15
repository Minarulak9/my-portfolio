/* ================================
   Main Application Controller
   ================================ */

// Global instances
let visualizer;
let animator;
let interactionController;

// Application state
const AppState = {
    currentNetwork: 'lan',
    isPlaying: false,
    speed: 1,
    packetSize: 5,
    showLabels: true,
    showPackets: true,
    showLatency: true,
    stats: {
        packetsSent: 0,
        activeConnections: 0,
        avgLatency: 0,
        dataTransferred: 0
    }
};

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Show loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    
    setTimeout(() => {
        // Initialize components
        visualizer = new NetworkVisualizer(document.getElementById('networkCanvas'));
        animator = new AnimationController();
        interactionController = new InteractionController(visualizer, animator);

        // Make interaction controller globally accessible
        window.interactionController = interactionController;

        // Setup event listeners
        setupEventListeners();

        // Load default network
        loadNetwork('lan');

        // Hide loading screen
        loadingScreen.classList.add('hidden');

        // Show welcome message
        animator.showToast('Welcome to Network Playground! 🌐', 'success', 4000);
        
        // Update info panel with initial content
        updateInfoPanel();

    }, 1000);
}

function setupEventListeners() {
    // Network type buttons
    document.querySelectorAll('.network-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const networkType = button.dataset.network;
            loadNetwork(networkType);
            
            // Update active state
            document.querySelectorAll('.network-btn').forEach(btn => 
                btn.classList.remove('active')
            );
            button.classList.add('active');
            
            animator.buttonClickEffect(button);
        });
    });

    // Protocol buttons
    document.querySelectorAll('.protocol-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const protocol = button.dataset.protocol;
            showProtocolInfo(protocol);
            
            // Toggle active state
            button.classList.toggle('active');
            animator.buttonClickEffect(button);
        });
    });

    // Sidebar toggle
    document.getElementById('toggleSidebar').addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('hidden');
        
        if (window.innerWidth <= 1200) {
            sidebar.classList.toggle('visible');
        }
    });

    // Info panel toggle
    document.getElementById('toggleInfo').addEventListener('click', () => {
        const infoPanel = document.getElementById('infoPanel');
        infoPanel.classList.toggle('hidden');
        
        if (window.innerWidth <= 1200) {
            infoPanel.classList.toggle('visible');
        }
    });

    // Control inputs
    document.getElementById('speedControl').addEventListener('input', (e) => {
        AppState.speed = parseFloat(e.target.value);
        animator.setSpeed(AppState.speed);
        document.querySelector('.speed-value').textContent = `${AppState.speed}x`;
    });

    document.getElementById('packetSize').addEventListener('input', (e) => {
        AppState.packetSize = parseInt(e.target.value);
        animator.setPacketSize(AppState.packetSize);
        document.querySelector('.packet-value').textContent = AppState.packetSize;
    });

    document.getElementById('showLabels').addEventListener('change', (e) => {
        AppState.showLabels = e.target.checked;
        visualizer.toggleLabels(AppState.showLabels);
    });

    document.getElementById('showPackets').addEventListener('change', (e) => {
        AppState.showPackets = e.target.checked;
        visualizer.togglePackets(AppState.showPackets);
    });

    document.getElementById('showLatency').addEventListener('change', (e) => {
        AppState.showLatency = e.target.checked;
        visualizer.toggleLatency(AppState.showLatency);
    });

    // Simulation controls
    document.getElementById('startSimulation').addEventListener('click', () => {
        startSimulation();
    });

    document.getElementById('pauseSimulation').addEventListener('click', () => {
        pauseSimulation();
    });

    document.getElementById('resetSimulation').addEventListener('click', () => {
        resetSimulation();
    });

    // Device panel close
    document.getElementById('closeDevicePanel').addEventListener('click', () => {
        document.getElementById('devicePanel').classList.remove('visible');
    });

    // Info panel close
    document.getElementById('closeInfoPanel').addEventListener('click', () => {
        document.getElementById('infoPanel').classList.add('hidden');
    });

    // Modal controls
    document.getElementById('closeModal').addEventListener('click', () => {
        closeModal();
    });

    document.getElementById('closeModalBtn').addEventListener('click', () => {
        closeModal();
    });

    // Click outside modal to close
    document.getElementById('explanationModal').addEventListener('click', (e) => {
        if (e.target.id === 'explanationModal') {
            closeModal();
        }
    });

    // Quick action chips
    document.querySelectorAll('.chip-btn').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            interactionController.handleQuickAction(action);
            animator.buttonClickEffect(button);
        });
    });

    // Stats update interval
    setInterval(updateStats, 1000);
}

function loadNetwork(networkKey) {
    AppState.currentNetwork = networkKey;
    
    // Clear existing animations
    animator.stop();
    
    // Render new network
    visualizer.renderNetwork(networkKey);
    
    // Update info panel
    updateInfoPanel();
    
    // Reset stats
    resetStats();
    
    // Show notification
    const networkData = NetworkData.networks[networkKey];
    animator.showToast(`Loaded: ${networkData.name}`, 'info');
}

function updateInfoPanel() {
    const networkData = NetworkData.networks[AppState.currentNetwork];
    if (!networkData) return;

    const infoTitle = document.getElementById('infoTitle');
    const infoBody = document.getElementById('infoBody');
    const analogyContent = document.getElementById('analogyContent');

    infoTitle.textContent = networkData.name;
    infoBody.innerHTML = networkData.info.content;
    analogyContent.innerHTML = networkData.analogy.content;
}

function showProtocolInfo(protocolKey) {
    const protocolData = NetworkData.protocols[protocolKey];
    if (!protocolData) return;

    const modal = document.getElementById('explanationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = protocolData.name;
    
    if (protocolKey === 'osi' && protocolData.layers) {
        // Special rendering for OSI model
        modalBody.innerHTML = `
            <div style="margin-bottom: 2rem;">
                <p>${protocolData.description}</p>
            </div>
            <div id="osiLayers"></div>
            ${protocolData.info}
        `;
        
        animator.showModal(modal);
        
        // Animate protocol layers
        setTimeout(() => {
            animator.animateProtocolLayers(
                protocolData.layers,
                document.getElementById('osiLayers')
            );
        }, 300);
    } else if (protocolKey === 'tcp' && protocolData.layers) {
        // Special rendering for TCP/IP
        modalBody.innerHTML = `
            <div style="margin-bottom: 2rem;">
                <p>${protocolData.description}</p>
            </div>
            <div id="tcpLayers"></div>
            ${protocolData.info}
        `;
        
        animator.showModal(modal);
        
        setTimeout(() => {
            animator.animateProtocolLayers(
                protocolData.layers,
                document.getElementById('tcpLayers')
            );
        }, 300);
    } else {
        modalBody.innerHTML = protocolData.info;
        animator.showModal(modal);
    }
}

function closeModal() {
    const modal = document.getElementById('explanationModal');
    animator.hideModal(modal);
}

function startSimulation() {
    if (AppState.isPlaying) return;
    
    AppState.isPlaying = true;
    animator.start();
    
    // Start continuous packet sending
    startPacketSimulation();
    
    animator.showToast('Simulation started', 'success');
    
    // Visual feedback
    document.getElementById('startSimulation').style.opacity = '0.5';
    document.getElementById('pauseSimulation').style.opacity = '1';
}

function pauseSimulation() {
    if (!AppState.isPlaying) return;
    
    AppState.isPlaying = false;
    animator.pause();
    
    animator.showToast('Simulation paused', 'warning');
    
    // Visual feedback
    document.getElementById('startSimulation').style.opacity = '1';
    document.getElementById('pauseSimulation').style.opacity = '0.5';
}

function resetSimulation() {
    AppState.isPlaying = false;
    animator.reset();
    
    // Reload network
    visualizer.renderNetwork(AppState.currentNetwork);
    
    // Reset stats
    resetStats();
    
    animator.showToast('Simulation reset', 'info');
    
    // Visual feedback
    document.getElementById('startSimulation').style.opacity = '1';
    document.getElementById('pauseSimulation').style.opacity = '1';
}

function startPacketSimulation() {
    if (!AppState.isPlaying || visualizer.links.length === 0) return;

    const sendRandomPacket = () => {
        if (!AppState.isPlaying) return;

        const randomLink = visualizer.links[
            Math.floor(Math.random() * visualizer.links.length)
        ];

        visualizer.sendPacket(randomLink.source.id, randomLink.target.id, () => {
            // Update stats
            AppState.stats.packetsSent++;
            AppState.stats.dataTransferred += Math.random() * 10;
        });

        // Schedule next packet
        const delay = (500 + Math.random() * 1500) / AppState.speed;
        setTimeout(sendRandomPacket, delay);
    };

    // Start sending packets
    sendRandomPacket();
}

function updateStats() {
    // Update active connections
    AppState.stats.activeConnections = visualizer.links ? visualizer.links.length : 0;

    // Calculate average latency
    if (visualizer.links && visualizer.links.length > 0) {
        const totalLatency = visualizer.links.reduce((sum, link) => sum + link.latency, 0);
        AppState.stats.avgLatency = Math.round(totalLatency / visualizer.links.length);
    }

    // Update UI
    document.getElementById('packetsSent').textContent = AppState.stats.packetsSent;
    document.getElementById('activeConnections').textContent = AppState.stats.activeConnections;
    document.getElementById('avgLatency').textContent = `${AppState.stats.avgLatency}ms`;
    document.getElementById('dataTransferred').textContent = 
        `${AppState.stats.dataTransferred.toFixed(2)} KB`;
}

function resetStats() {
    AppState.stats = {
        packetsSent: 0,
        activeConnections: 0,
        avgLatency: 0,
        dataTransferred: 0
    };
    updateStats();
}

// Keyboard shortcut help
function showKeyboardShortcuts() {
    const modal = document.getElementById('explanationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = 'Keyboard Shortcuts';
    modalBody.innerHTML = `
        <div style="display: grid; gap: 1rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem;">
                <span>Start Simulation</span>
                <kbd style="background: #334155; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">Ctrl + S</kbd>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem;">
                <span>Pause Simulation</span>
                <kbd style="background: #334155; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">Ctrl + P</kbd>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem;">
                <span>Reset Simulation</span>
                <kbd style="background: #334155; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">Ctrl + R</kbd>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem;">
                <span>Toggle Labels</span>
                <kbd style="background: #334155; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">Ctrl + L</kbd>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem;">
                <span>Toggle Info Panel</span>
                <kbd style="background: #334155; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">Ctrl + I</kbd>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem;">
                <span>Toggle Menu</span>
                <kbd style="background: #334155; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">Ctrl + M</kbd>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem;">
                <span>Close Panels</span>
                <kbd style="background: #334155; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">Esc</kbd>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem;">
                <span>Delete Selected Node</span>
                <kbd style="background: #334155; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace;">Delete</kbd>
            </div>
        </div>

        <div style="margin-top: 2rem; padding: 1rem; background: rgba(139, 92, 246, 0.1); border-radius: 0.5rem; border-left: 3px solid #8b5cf6;">
            <h4 style="color: #a78bfa; margin-bottom: 0.5rem;">💡 Pro Tips</h4>
            <ul style="margin-left: 1.5rem; color: #cbd5e1;">
                <li>Click on devices to see details</li>
                <li>Right-click for context menu</li>
                <li>Double-click for detailed information</li>
                <li>Drag devices to reposition them</li>
            </ul>
        </div>
    `;

    animator.showModal(modal);
}

// Demo mode - automatically cycles through features
function startDemoMode() {
    animator.showToast('Starting demo mode...', 'info');

    const demoSequence = [
        () => loadNetwork('lan'),
        () => animator.showToast('Local Area Network', 'info'),
        () => startSimulation(),
        () => interactionController.sendRandomPacket(),
        () => interactionController.sendRandomPacket(),
        () => pauseSimulation(),
        () => loadNetwork('clientserver'),
        () => animator.showToast('Client-Server Model', 'info'),
        () => startSimulation(),
        () => interactionController.simulateCongestion(),
        () => pauseSimulation(),
        () => loadNetwork('mesh'),
        () => animator.showToast('Mesh Network', 'info'),
        () => startSimulation(),
        () => interactionController.showRandomRoute(),
        () => resetSimulation(),
        () => animator.showToast('Demo completed!', 'success')
    ];

    let step = 0;
    const executeNextStep = () => {
        if (step < demoSequence.length) {
            demoSequence[step]();
            step++;
            setTimeout(executeNextStep, 3000);
        }
    };

    executeNextStep();
}

// Educational tour
function startTour() {
    const tourSteps = [
        {
            title: 'Welcome to Network Playground! 🌐',
            content: 'This interactive tool helps you understand networking concepts through visualization and hands-on exploration.',
            action: () => {}
        },
        {
            title: 'Network Types 📡',
            content: 'On the left sidebar, you can select different network types like LAN, WAN, Internet, and more. Each has unique characteristics and use cases.',
            action: () => {
                document.getElementById('sidebar').classList.remove('hidden');
            }
        },
        {
            title: 'Interactive Canvas 🖼️',
            content: 'Click on devices to see details, right-click for options, and watch packets flow between nodes in real-time.',
            action: () => {}
        },
        {
            title: 'Simulation Controls ⚙️',
            content: 'Use the controls to adjust animation speed, packet size, and toggle various display options.',
            action: () => {}
        },
        {
            title: 'Real-Life Analogies 💡',
            content: 'The info panel on the right explains concepts using everyday analogies to make networking easier to understand.',
            action: () => {
                document.getElementById('infoPanel').classList.remove('hidden');
            }
        },
        {
            title: 'Start Exploring! 🚀',
            content: 'Try clicking the "Start" button to see your network come to life with animated packet flows.',
            action: () => {}
        }
    ];

    let currentStep = 0;

    const showTourStep = () => {
        if (currentStep < tourSteps.length) {
            const step = tourSteps[currentStep];
            const modal = document.getElementById('explanationModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');

            modalTitle.textContent = step.title;
            modalBody.innerHTML = `
                <p style="font-size: 1rem; line-height: 1.8; margin-bottom: 2rem;">${step.content}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #94a3b8;">Step ${currentStep + 1} of ${tourSteps.length}</span>
                    <div style="display: flex; gap: 0.5rem;">
                        ${currentStep > 0 ? '<button class="btn btn-secondary" onclick="previousTourStep()">Previous</button>' : ''}
                        ${currentStep < tourSteps.length - 1 
                            ? '<button class="btn btn-primary" onclick="nextTourStep()">Next</button>' 
                            : '<button class="btn btn-success" onclick="closeModal()">Get Started!</button>'}
                    </div>
                </div>
            `;

            step.action();
            animator.showModal(modal);
        }
    };

    window.nextTourStep = () => {
        currentStep++;
        showTourStep();
    };

    window.previousTourStep = () => {
        currentStep--;
        showTourStep();
    };

    showTourStep();
}

// Auto-start tour for first-time users
const hasVisited = localStorage.getItem('networkPlaygroundVisited');
if (!hasVisited) {
    setTimeout(() => {
        startTour();
        localStorage.setItem('networkPlaygroundVisited', 'true');
    }, 2000);
}

// Export functions for global access
window.loadNetwork = loadNetwork;
window.startSimulation = startSimulation;
window.pauseSimulation = pauseSimulation;
window.resetSimulation = resetSimulation;
window.showProtocolInfo = showProtocolInfo;
window.closeModal = closeModal;
window.startDemoMode = startDemoMode;
window.startTour = startTour;
window.showKeyboardShortcuts = showKeyboardShortcuts;

// Console welcome message
console.log('%c🌐 Network Playground', 'font-size: 24px; color: #3b82f6; font-weight: bold;');
console.log('%cWelcome! Type startDemoMode() to see an automated demo.', 'font-size: 14px; color: #8b5cf6;');
console.log('%cType startTour() to restart the guided tour.', 'font-size: 14px; color: #8b5cf6;');
console.log('%cType showKeyboardShortcuts() to see all shortcuts.', 'font-size: 14px; color: #8b5cf6;');