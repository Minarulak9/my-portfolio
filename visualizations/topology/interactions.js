/* ================================
   Interaction Controller
   ================================ */

class InteractionController {
    constructor(visualizer, animator) {
        this.visualizer = visualizer;
        this.animator = animator;
        this.selectedNode = null;
        this.contextMenuNode = null;
        this.isDragging = false;
        this.draggedNode = null;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Canvas interactions
        const canvas = document.getElementById('networkCanvas');
        
        canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        canvas.addEventListener('contextmenu', (e) => this.handleContextMenu(e));
        canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Context menu close
        document.addEventListener('click', () => this.hideContextMenu());

        // Window events
        window.addEventListener('blur', () => this.handleWindowBlur());
    }

    handleCanvasClick(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const node = this.visualizer.getNodeAtPosition(x, y);

        if (node) {
            this.selectNode(node);
            this.showDeviceInfo(node);
            this.animator.pulse(event.target);
        } else {
            this.deselectNode();
            this.hideDeviceInfo();
        }
    }

    handleContextMenu(event) {
        event.preventDefault();
        
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const node = this.visualizer.getNodeAtPosition(x, y);

        if (node) {
            this.contextMenuNode = node;
            this.showContextMenu(event.clientX, event.clientY, node);
        }
    }

    handleMouseDown(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const node = this.visualizer.getNodeAtPosition(x, y);

        if (node && event.button === 0) { // Left click
            this.isDragging = true;
            this.draggedNode = node;
            event.target.style.cursor = 'grabbing';
        }
    }

    handleMouseMove(event) {
        const canvas = document.getElementById('networkCanvas');
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if hovering over a node
        const node = this.visualizer.getNodeAtPosition(x, y);
        
        if (node && !this.isDragging) {
            canvas.style.cursor = 'pointer';
            this.visualizer.highlightNode(node.id);
            this.showTooltip(node, event.clientX, event.clientY);
        } else if (!this.isDragging) {
            canvas.style.cursor = 'default';
            if (this.selectedNode) {
                this.visualizer.unhighlightNode(this.selectedNode.id);
            }
            this.hideTooltip();
        }

        // Handle dragging
        if (this.isDragging && this.draggedNode) {
            this.draggedNode.x = x;
            this.draggedNode.y = y;
            this.visualizer.renderNetwork(this.visualizer.currentNetwork);
        }
    }

    handleMouseUp(event) {
        if (this.isDragging) {
            this.isDragging = false;
            this.draggedNode = null;
            event.target.style.cursor = 'default';
        }
    }

    handleDoubleClick(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const node = this.visualizer.getNodeAtPosition(x, y);

        if (node) {
            this.showDetailedInfo(node);
        }
    }

    handleTouchStart(event) {
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const rect = event.target.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            const node = this.visualizer.getNodeAtPosition(x, y);
            
            if (node) {
                this.selectNode(node);
                this.showDeviceInfo(node);
            }
        }
    }

    handleTouchMove(event) {
        event.preventDefault(); // Prevent scrolling
        
        if (event.touches.length === 1 && this.selectedNode) {
            const touch = event.touches[0];
            const rect = event.target.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            this.selectedNode.x = x;
            this.selectedNode.y = y;
            this.visualizer.renderNetwork(this.visualizer.currentNetwork);
        }
    }

    handleTouchEnd(event) {
        // Touch end logic
    }

    handleKeyboard(event) {
        // Keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch(event.key.toLowerCase()) {
                case 's':
                    event.preventDefault();
                    this.startSimulation();
                    break;
                case 'p':
                    event.preventDefault();
                    this.pauseSimulation();
                    break;
                case 'r':
                    event.preventDefault();
                    this.resetSimulation();
                    break;
                case 'l':
                    event.preventDefault();
                    this.toggleLabels();
                    break;
                case 'i':
                    event.preventDefault();
                    this.toggleInfoPanel();
                    break;
                case 'm':
                    event.preventDefault();
                    this.toggleSidebar();
                    break;
            }
        }

        // Escape key
        if (event.key === 'Escape') {
            this.hideContextMenu();
            this.hideDeviceInfo();
            this.deselectNode();
        }

        // Delete key
        if (event.key === 'Delete' && this.selectedNode) {
            this.removeSelectedNode();
        }
    }

    handleWindowBlur() {
        // Pause animations when window loses focus
        if (this.animator.isPlaying) {
            this.animator.pause();
        }
    }

    selectNode(node) {
        // Deselect previous
        if (this.selectedNode) {
            this.visualizer.unhighlightNode(this.selectedNode.id);
        }

        this.selectedNode = node;
        this.visualizer.highlightNode(node.id);
    }

    deselectNode() {
        if (this.selectedNode) {
            this.visualizer.unhighlightNode(this.selectedNode.id);
            this.selectedNode = null;
        }
    }

    showDeviceInfo(node) {
        const panel = document.getElementById('devicePanel');
        const title = document.getElementById('deviceTitle');
        const info = document.getElementById('deviceInfo');

        const deviceType = NetworkData.deviceTypes[node.type] || {};
        
        title.textContent = node.name;
        
        info.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <div style="font-size: 2rem; text-align: center; margin-bottom: 0.5rem;">
                    ${node.icon}
                </div>
                <div style="font-weight: 600; color: #60a5fa; margin-bottom: 0.5rem;">
                    ${deviceType.name || node.type}
                </div>
                <div style="color: #cbd5e1; font-size: 0.875rem;">
                    ${deviceType.description || 'Network device'}
                </div>
            </div>
            
            <div style="border-top: 1px solid #475569; padding-top: 1rem;">
                <div style="font-weight: 600; margin-bottom: 0.5rem;">Specifications:</div>
                ${this.formatSpecifications(deviceType.specifications)}
            </div>
            
            <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem; border-left: 3px solid #3b82f6;">
                <div style="font-size: 0.75rem; color: #94a3b8;">Device ID</div>
                <div style="font-weight: 500; color: #e2e8f0;">${node.id}</div>
            </div>
        `;

        panel.classList.add('visible');
        this.animator.slideIn(panel, 'bottom');
    }

    hideDeviceInfo() {
        const panel = document.getElementById('devicePanel');
        panel.classList.remove('visible');
    }

    formatSpecifications(specs) {
        if (!specs) return '<div style="color: #94a3b8;">No specifications available</div>';
        
        return Object.entries(specs).map(([key, value]) => `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #334155;">
                <span style="color: #cbd5e1;">${key}:</span>
                <span style="color: #f1f5f9; font-weight: 500;">${value}</span>
            </div>
        `).join('');
    }

    showContextMenu(x, y, node) {
        const menu = document.getElementById('contextMenu');
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        menu.classList.add('visible');

        // Update menu items based on node
        const menuItems = menu.querySelectorAll('.context-item');
        menuItems.forEach(item => {
            item.onclick = () => {
                this.handleContextAction(item.dataset.action, node);
                this.hideContextMenu();
            };
        });

        this.animator.scaleIn(menu);
    }

    hideContextMenu() {
        const menu = document.getElementById('contextMenu');
        menu.classList.remove('visible');
    }

    handleContextAction(action, node) {
        switch(action) {
            case 'send-data':
                this.sendDataFromNode(node);
                break;
            case 'inspect':
                this.showDetailedInfo(node);
                break;
            case 'disconnect':
                this.disconnectNode(node);
                break;
            case 'remove':
                this.removeNode(node);
                break;
        }
    }

    sendDataFromNode(node) {
        // Find connected nodes
        const connections = this.visualizer.links.filter(link => 
            link.source.id === node.id || link.target.id === node.id
        );

        if (connections.length > 0) {
            // Send to first connected node
            const targetNode = connections[0].source.id === node.id 
                ? connections[0].target 
                : connections[0].source;
            
            this.visualizer.sendPacket(node.id, targetNode.id);
            this.animator.showToast(`Sending data from ${node.name} to ${targetNode.name}`, 'success');
        } else {
            this.animator.showToast('No connections available', 'warning');
        }
    }

    disconnectNode(node) {
        // Temporarily disable connections
        this.visualizer.links.forEach(link => {
            if (link.source.id === node.id || link.target.id === node.id) {
                // Visual feedback
                this.animator.showToast(`${node.name} disconnected`, 'warning');
            }
        });
        
        this.visualizer.simulateDeviceFailure(node.id, 2000);
    }

    removeNode(node) {
        this.visualizer.removeDevice(node.id);
        this.animator.showToast(`${node.name} removed`, 'info');
        this.hideDeviceInfo();
        this.deselectNode();
    }

    removeSelectedNode() {
        if (this.selectedNode) {
            this.removeNode(this.selectedNode);
        }
    }

    showDetailedInfo(node) {
        const modal = document.getElementById('explanationModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        const deviceType = NetworkData.deviceTypes[node.type] || {};
        
        title.textContent = `${node.name} - Detailed Information`;
        
        body.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${node.icon}</div>
                <h3 style="color: #60a5fa; margin-bottom: 0.5rem;">${deviceType.name || node.type}</h3>
                <p style="color: #cbd5e1;">${deviceType.description || ''}</p>
            </div>

            <h4 style="color: #f1f5f9; margin-top: 1.5rem; margin-bottom: 0.75rem;">Technical Specifications</h4>
            ${this.formatSpecifications(deviceType.specifications)}

            <h4 style="color: #f1f5f9; margin-top: 1.5rem; margin-bottom: 0.75rem;">Network Connections</h4>
            ${this.formatConnections(node)}

            <h4 style="color: #f1f5f9; margin-top: 1.5rem; margin-bottom: 0.75rem;">Quick Actions</h4>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.75rem;">
                <button class="chip-btn" onclick="interactionController.sendDataFromNode(interactionController.selectedNode)">
                    Send Data
                </button>
                <button class="chip-btn" onclick="interactionController.disconnectNode(interactionController.selectedNode)">
                    Simulate Disconnect
                </button>
                <button class="chip-btn" onclick="interactionController.showTrafficFromNode(interactionController.selectedNode)">
                    Show Traffic
                </button>
            </div>
        `;

        this.animator.showModal(modal);
    }

    formatConnections(node) {
        const connections = this.visualizer.links.filter(link => 
            link.source.id === node.id || link.target.id === node.id
        );

        if (connections.length === 0) {
            return '<div style="color: #94a3b8;">No active connections</div>';
        }

        return connections.map(conn => {
            const target = conn.source.id === node.id ? conn.target : conn.source;
            return `
                <div style="display: flex; justify-content: space-between; padding: 0.75rem; margin: 0.5rem 0; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem; align-items: center;">
                    <div>
                        <span style="font-size: 1.25rem; margin-right: 0.5rem;">${target.icon}</span>
                        <span style="color: #f1f5f9; font-weight: 500;">${target.name}</span>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: #10b981; font-size: 0.75rem;">Bandwidth: ${conn.bandwidth}</div>
                        <div style="color: #f59e0b; font-size: 0.75rem;">Latency: ${conn.latency}ms</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    showTrafficFromNode(node) {
        const connections = this.visualizer.links.filter(link => 
            link.source.id === node.id || link.target.id === node.id
        );

        connections.forEach((conn, index) => {
            const targetId = conn.source.id === node.id ? conn.target.id : conn.source.id;
            setTimeout(() => {
                this.visualizer.sendMultiplePackets(node.id, targetId, 5, 200);
            }, index * 500);
        });

        this.animator.showToast(`Showing traffic from ${node.name}`, 'info');
    }

    showTooltip(node, x, y) {
        let tooltip = document.getElementById('nodeTooltip');
        
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'nodeTooltip';
            tooltip.style.cssText = `
                position: fixed;
                background: rgba(30, 41, 59, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid #475569;
                border-radius: 0.5rem;
                padding: 0.75rem 1rem;
                color: #f1f5f9;
                font-size: 0.875rem;
                pointer-events: none;
                z-index: 10000;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                max-width: 200px;
            `;
            document.body.appendChild(tooltip);
        }

        tooltip.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${node.name}</div>
            <div style="color: #cbd5e1; font-size: 0.75rem;">${node.type}</div>
        `;

        tooltip.style.left = `${x + 15}px`;
        tooltip.style.top = `${y + 15}px`;
        tooltip.style.opacity = '1';
    }

    hideTooltip() {
        const tooltip = document.getElementById('nodeTooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }

    startSimulation() {
        this.animator.start();
        this.animator.showToast('Simulation started', 'success');
        
        // Start network traffic
        if (this.visualizer.links.length > 0) {
            this.animator.animateTraffic(this.visualizer.links, 'medium');
        }
    }

    pauseSimulation() {
        this.animator.pause();
        this.animator.showToast('Simulation paused', 'warning');
    }

    resetSimulation() {
        this.animator.reset();
        this.visualizer.renderNetwork(this.visualizer.currentNetwork);
        this.animator.showToast('Simulation reset', 'info');
    }

    toggleLabels() {
        this.visualizer.showLabels = !this.visualizer.showLabels;
        this.visualizer.toggleLabels(this.visualizer.showLabels);
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('hidden');
    }

    toggleInfoPanel() {
        const infoPanel = document.getElementById('infoPanel');
        infoPanel.classList.toggle('hidden');
    }

    // Quick action handlers
    handleQuickAction(action) {
        switch(action) {
            case 'send-packet':
                this.sendRandomPacket();
                break;
            case 'add-device':
                this.addRandomDevice();
                break;
            case 'simulate-congestion':
                this.simulateCongestion();
                break;
            case 'simulate-failure':
                this.simulateFailure();
                break;
            case 'show-route':
                this.showRandomRoute();
                break;
        }
    }

    sendRandomPacket() {
        if (this.visualizer.links.length > 0) {
            const randomLink = this.visualizer.links[
                Math.floor(Math.random() * this.visualizer.links.length)
            ];
            this.visualizer.sendPacket(randomLink.source.id, randomLink.target.id);
            this.animator.showToast('Packet sent!', 'success');
        }
    }

    addRandomDevice() {
        const types = ['computer', 'laptop', 'mobile'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const newDevice = {
            id: `device_${Date.now()}`,
            type: randomType,
            name: `New ${randomType}`,
            x: 200 + Math.random() * 400,
            y: 200 + Math.random() * 300,
            icon: randomType === 'computer' ? '💻' : randomType === 'laptop' ? '💻' : '📱'
        };

        this.visualizer.addDevice(newDevice);
        this.animator.showToast(`${newDevice.name} added!`, 'success');
    }

    simulateCongestion() {
        if (this.visualizer.links.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.visualizer.links.length);
            this.visualizer.simulateNetworkCongestion(randomIndex);
            this.animator.showToast('Network congestion simulated!', 'warning');
        }
    }

    simulateFailure() {
        if (this.visualizer.nodes.length > 0) {
            const randomNode = this.visualizer.nodes[
                Math.floor(Math.random() * this.visualizer.nodes.length)
            ];
            this.visualizer.simulateDeviceFailure(randomNode.id);
            this.animator.showToast(`${randomNode.name} failure simulated!`, 'error');
        }
    }

    showRandomRoute() {
        if (this.visualizer.nodes.length >= 2) {
            const shuffled = [...this.visualizer.nodes].sort(() => 0.5 - Math.random());
            const source = shuffled[0];
            const target = shuffled[1];
            
            this.visualizer.showRoute(source.id, target.id);
            this.animator.showToast(`Route: ${source.name} → ${target.name}`, 'info');
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractionController;
}