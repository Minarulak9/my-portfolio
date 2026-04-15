// ============================================
// Interactive Network Simulations with D3.js
// ============================================

// ============================================
// Bridge Simulation
// ============================================
class BridgeSimulation {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        this.width = this.container.node().getBoundingClientRect().width;
        this.height = 400;
        this.macTable = {};
        
        this.init();
    }

    init() {
        // Create SVG
        this.svg = this.container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Create segments
        const segmentWidth = this.width / 3;
        
        // Segment A (Left)
        this.segmentA = this.svg.append('g')
            .attr('class', 'segment-a')
            .attr('transform', `translate(0, 0)`);
            
        this.segmentA.append('rect')
            .attr('x', 20)
            .attr('y', 50)
            .attr('width', segmentWidth - 40)
            .attr('height', 300)
            .attr('fill', 'rgba(102, 126, 234, 0.2)')
            .attr('stroke', '#667eea')
            .attr('stroke-width', 2)
            .attr('rx', 12);
            
        this.segmentA.append('text')
            .attr('x', segmentWidth / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .text('Segment A');

        // Bridge (Center)
        this.bridge = this.svg.append('g')
            .attr('class', 'bridge')
            .attr('transform', `translate(${segmentWidth}, 0)`);
            
        this.bridge.append('rect')
            .attr('x', segmentWidth * 0.3)
            .attr('y', 150)
            .attr('width', segmentWidth * 0.4)
            .attr('height', 100)
            .attr('fill', '#f093fb')
            .attr('stroke', 'white')
            .attr('stroke-width', 3)
            .attr('rx', 12);
            
        this.bridge.append('text')
            .attr('x', segmentWidth * 0.5)
            .attr('y', 205)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '18px')
            .text('BRIDGE');

        // Segment B (Right)
        this.segmentB = this.svg.append('g')
            .attr('class', 'segment-b')
            .attr('transform', `translate(${segmentWidth * 2}, 0)`);
            
        this.segmentB.append('rect')
            .attr('x', 20)
            .attr('y', 50)
            .attr('width', segmentWidth - 40)
            .attr('height', 300)
            .attr('fill', 'rgba(240, 147, 251, 0.2)')
            .attr('stroke', '#f093fb')
            .attr('stroke-width', 2)
            .attr('rx', 12);
            
        this.segmentB.append('text')
            .attr('x', segmentWidth / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .text('Segment B');

        // Add devices
        this.devices = [
            { name: 'PC-A', mac: 'AA:BB:CC:11:22:33', segment: 'A', x: segmentWidth * 0.25, y: 120 },
            { name: 'PC-B', mac: 'AA:BB:CC:44:55:66', segment: 'A', x: segmentWidth * 0.25, y: 280 },
            { name: 'PC-C', mac: 'DD:EE:FF:11:22:33', segment: 'B', x: segmentWidth * 2.25, y: 120 },
            { name: 'PC-D', mac: 'DD:EE:FF:44:55:66', segment: 'B', x: segmentWidth * 2.25, y: 280 }
        ];

        this.drawDevices();
        this.updateMACTable();
    }

    drawDevices() {
        const deviceGroups = this.svg.selectAll('.device')
            .data(this.devices)
            .enter()
            .append('g')
            .attr('class', 'device')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        // Device icon
        deviceGroups.append('circle')
            .attr('r', 30)
            .attr('fill', '#667eea')
            .attr('stroke', 'white')
            .attr('stroke-width', 2);

        deviceGroups.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', -40)
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .text(d => d.name);

        deviceGroups.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', 5)
            .attr('fill', 'white')
            .attr('font-size', '20px')
            .text('💻');
    }

    sendPacket(sourceName, destName) {
        const source = this.devices.find(d => d.name === sourceName);
        const dest = this.devices.find(d => d.name === destName);
        
        if (!source || !dest) return;

        // Learn source MAC
        this.macTable[source.mac] = source.segment;
        this.updateMACTable();

        // Determine if packet needs to cross bridge
        const crossBridge = source.segment !== dest.segment;

        // Create packet
        const packet = this.svg.append('circle')
            .attr('class', 'packet')
            .attr('cx', source.x)
            .attr('cy', source.y)
            .attr('r', 8)
            .attr('fill', '#fdbb2d')
            .attr('stroke', 'white')
            .attr('stroke-width', 2);

        // Animate packet
        if (crossBridge) {
            // Goes through bridge
            const bridgeCenterX = this.width / 2;
            const bridgeCenterY = 200;

            packet.transition()
                .duration(1000)
                .attr('cx', bridgeCenterX)
                .attr('cy', bridgeCenterY)
                .transition()
                .duration(1000)
                .attr('cx', dest.x)
                .attr('cy', dest.y)
                .on('end', () => {
                    packet.remove();
                    this.showMessage(`Packet forwarded from ${sourceName} to ${destName} through bridge`);
                });

            // Highlight bridge
            this.bridge.select('rect')
                .transition()
                .duration(500)
                .attr('fill', '#fdbb2d')
                .transition()
                .duration(500)
                .attr('fill', '#f093fb');
        } else {
            // Direct within segment
            packet.transition()
                .duration(1500)
                .attr('cx', dest.x)
                .attr('cy', dest.y)
                .on('end', () => {
                    packet.remove();
                    this.showMessage(`Packet sent directly in Segment ${source.segment}`);
                });
        }

        // Learn destination MAC
        this.macTable[dest.mac] = dest.segment;
        setTimeout(() => this.updateMACTable(), 1000);
    }

    updateMACTable() {
        const tableDiv = d3.select('#macTable');
        
        // Clear existing entries (except header)
        tableDiv.selectAll('.table-row:not(.header)').remove();
        
        // Add MAC table entries
        Object.entries(this.macTable).forEach(([mac, segment]) => {
            const row = tableDiv.append('div')
                .attr('class', 'table-row')
                .style('animation', 'fadeIn 0.3s ease');

            row.append('span').text(segment === 'A' ? 'Port 1' : 'Port 2');
            row.append('span').text(mac);
        });
    }

    showMessage(text) {
        console.log(text);
        // You can add a toast notification here
    }

    reset() {
        this.macTable = {};
        this.updateMACTable();
        this.svg.selectAll('.packet').remove();
        this.showMessage('Bridge reset!');
    }
}

// ============================================
// Router Simulation
class RouterSimulation {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        this.width = this.container.node().getBoundingClientRect().width;
        this.height = 400;
        
        this.init();
    }

    init() {
        this.svg = this.container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        const networkWidth = this.width / 4;

        // Network A (192.168.1.0/24)
        this.networkA = this.svg.append('g')
            .attr('transform', `translate(20, 150)`);
            
        this.drawNetwork(this.networkA, 'Network A', '192.168.1.0/24', '#4ecdc4', 0);

        // Router
        this.router = this.svg.append('g')
            .attr('transform', `translate(${this.width / 2 - 50}, 150)`);
            
        this.router.append('rect')
            .attr('width', 100)
            .attr('height', 100)
            .attr('fill', '#71b280')
            .attr('stroke', 'white')
            .attr('stroke-width', 3)
            .attr('rx', 12);
            
        this.router.append('text')
            .attr('x', 50)
            .attr('y', 55)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '16px')
            .text('ROUTER');

        // Network B (10.0.0.0/24)
        this.networkB = this.svg.append('g')
            .attr('transform', `translate(${this.width - networkWidth - 20}, 50)`);
            
        this.drawNetwork(this.networkB, 'Network B', '10.0.0.0/24', '#45a247', 1);

        // Internet
        this.internet = this.svg.append('g')
            .attr('transform', `translate(${this.width - networkWidth - 20}, 250)`);
            
        this.drawNetwork(this.internet, 'Internet', '0.0.0.0/0', '#90ee90', 2);

        // Draw connections
        this.drawConnections();
    }

    drawNetwork(group, name, subnet, color, index) {
        const networkWidth = this.width / 4;
        
        group.append('rect')
            .attr('width', networkWidth)
            .attr('height', 80)
            .attr('fill', `${color}33`)
            .attr('stroke', color)
            .attr('stroke-width', 2)
            .attr('rx', 12);

        group.append('text')
            .attr('x', networkWidth / 2)
            .attr('y', 25)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .text(name);

        group.append('text')
            .attr('x', networkWidth / 2)
            .attr('y', 50)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '12px')
            .text(subnet);
    }

    drawConnections() {
        const routerCenterX = this.width / 2;
        const routerCenterY = 200;
        const networkWidth = this.width / 4;

        // Connection to Network A
        this.svg.append('line')
            .attr('x1', networkWidth + 20)
            .attr('y1', 190)
            .attr('x2', routerCenterX - 50)
            .attr('y2', 200)
            .attr('stroke', '#4ecdc4')
            .attr('stroke-width', 3);

        // Connection to Network B
        this.svg.append('line')
            .attr('x1', routerCenterX + 50)
            .attr('y1', 180)
            .attr('x2', this.width - networkWidth - 20)
            .attr('y2', 90)
            .attr('stroke', '#45a247')
            .attr('stroke-width', 3);

        // Connection to Internet
        this.svg.append('line')
            .attr('x1', routerCenterX + 50)
            .attr('y1', 220)
            .attr('x2', this.width - networkWidth - 20)
            .attr('y2', 290)
            .attr('stroke', '#90ee90')
            .attr('stroke-width', 3);
    }

    sendPacket(sourceIP, destIP) {
        const routerCenterX = this.width / 2;
        const routerCenterY = 200;
        const networkWidth = this.width / 4;

        let startX, startY, endX, endY, path;

        // Determine source and destination
        if (sourceIP.startsWith('192.168.1')) {
            startX = networkWidth / 2 + 20;
            startY = 190;
            
            if (destIP.startsWith('192.168.1')) {
                // Same network - no routing needed
                this.showMessage('Same network - no routing needed!');
                return;
            } else if (destIP.startsWith('10.0')) {
                endX = this.width - networkWidth / 2 - 20;
                endY = 90;
                path = 'Network B';
            } else {
                endX = this.width - networkWidth / 2 - 20;
                endY = 290;
                path = 'Internet';
            }
        }

        // Create packet
        const packet = this.svg.append('g')
            .attr('class', 'packet');

        packet.append('circle')
            .attr('cx', startX)
            .attr('cy', startY)
            .attr('r', 10)
            .attr('fill', '#fdbb2d')
            .attr('stroke', 'white')
            .attr('stroke-width', 2);

        packet.append('text')
            .attr('x', startX)
            .attr('y', startY - 15)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '10px')
            .text(destIP);

        // Animate to router
        packet.transition()
            .duration(1000)
            .attr('transform', `translate(${routerCenterX - startX}, ${routerCenterY - startY})`)
            .on('end', () => {
                // Highlight router
                this.router.select('rect')
                    .transition()
                    .duration(300)
                    .attr('fill', '#fdbb2d')
                    .transition()
                    .duration(300)
                    .attr('fill', '#71b280');

                // Animate to destination
                packet.transition()
                    .delay(600)
                    .duration(1000)
                    .attr('transform', `translate(${endX - startX}, ${endY - startY})`)
                    .on('end', () => {
                        packet.remove();
                        this.showMessage(`Packet routed from ${sourceIP} to ${destIP} via ${path}`);
                    });
            });
    }

    showMessage(text) {
        console.log(text);
    }

    reset() {
        this.svg.selectAll('.packet').remove();
        this.showMessage('Router reset!');
    }
}

// ============================================
// Switch Simulation
// ============================================
class SwitchSimulation {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        this.width = this.container.node().getBoundingClientRect().width;
        this.height = 400;
        this.mode = 'switch'; // 'switch' or 'hub'
        this.stats = { framesSent: 0, collisions: 0 };
        
        this.init();
    }

    init() {
        this.svg = this.container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Switch/Hub in center
        this.switch = this.svg.append('g')
            .attr('transform', `translate(${this.width / 2 - 60}, ${this.height / 2 - 60})`);
            
        this.switch.append('rect')
            .attr('width', 120)
            .attr('height', 120)
            .attr('fill', '#45a247')
            .attr('stroke', 'white')
            .attr('stroke-width', 3)
            .attr('rx', 12);
            
        this.switchText = this.switch.append('text')
            .attr('x', 60)
            .attr('y', 65)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '18px')
            .text('SWITCH');

        // PCs around the switch
        this.pcs = [
            { name: 'PC1', x: this.width / 2 - 200, y: this.height / 2 - 100 },
            { name: 'PC2', x: this.width / 2 + 200, y: this.height / 2 - 100 },
            { name: 'PC3', x: this.width / 2 - 200, y: this.height / 2 + 100 },
            { name: 'PC4', x: this.width / 2 + 200, y: this.height / 2 + 100 }
        ];

        this.drawPCs();
        this.drawConnections();
    }

    drawPCs() {
        const pcGroups = this.svg.selectAll('.pc')
            .data(this.pcs)
            .enter()
            .append('g')
            .attr('class', 'pc')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        pcGroups.append('circle')
            .attr('r', 35)
            .attr('fill', '#283c86')
            .attr('stroke', 'white')
            .attr('stroke-width', 2);

        pcGroups.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', 5)
            .attr('fill', 'white')
            .attr('font-size', '24px')
            .text('💻');

        pcGroups.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', -45)
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .text(d => d.name);
    }

    drawConnections() {
        const switchCenterX = this.width / 2;
        const switchCenterY = this.height / 2;

        this.pcs.forEach(pc => {
            this.svg.append('line')
                .attr('x1', pc.x)
                .attr('y1', pc.y)
                .attr('x2', switchCenterX)
                .attr('y2', switchCenterY)
                .attr('stroke', 'rgba(255, 255, 255, 0.3)')
                .attr('stroke-width', 2);
        });
    }

    setMode(mode) {
        this.mode = mode;
        this.switchText.text(mode === 'switch' ? 'SWITCH' : 'HUB');
        this.switch.select('rect')
            .attr('fill', mode === 'switch' ? '#45a247' : '#c0392b');
        this.reset();
    }

    sendFrame(sourceName, destName) {
        const source = this.pcs.find(p => p.name === sourceName);
        const dest = this.pcs.find(p => p.name === destName);
        
        if (!source || !dest) return;

        this.stats.framesSent++;
        this.updateStats();

        if (this.mode === 'switch') {
            // Switch mode - direct path
            this.animateFrame(source, dest, '#90ee90');
        } else {
            // Hub mode - broadcast to all
            this.pcs.forEach(pc => {
                if (pc.name !== sourceName) {
                    this.animateFrame(source, pc, pc.name === destName ? '#90ee90' : '#e74c3c');
                }
            });
        }
    }

    animateFrame(source, dest, color) {
        const switchCenterX = this.width / 2;
        const switchCenterY = this.height / 2;

        const frame = this.svg.append('circle')
            .attr('class', 'frame')
            .attr('cx', source.x)
            .attr('cy', source.y)
            .attr('r', 8)
            .attr('fill', color)
            .attr('stroke', 'white')
            .attr('stroke-width', 2);

        frame.transition()
            .duration(800)
            .attr('cx', switchCenterX)
            .attr('cy', switchCenterY)
            .transition()
            .duration(800)
            .attr('cx', dest.x)
            .attr('cy', dest.y)
            .on('end', () => frame.remove());
    }

    simultaneousSend() {
        if (this.mode === 'hub') {
            this.stats.collisions++;
            this.stats.framesSent += 2;
            this.updateStats();
            
            // Show collision animation
            const collision = this.svg.append('text')
                .attr('x', this.width / 2)
                .attr('y', this.height / 2 - 80)
                .attr('text-anchor', 'middle')
                .attr('fill', '#e74c3c')
                .attr('font-size', '24px')
                .attr('font-weight', 'bold')
                .text('⚠️ COLLISION!')
                .style('opacity', 0);

            collision.transition()
                .duration(500)
                .style('opacity', 1)
                .transition()
                .delay(1000)
                .duration(500)
                .style('opacity', 0)
                .on('end', () => collision.remove());
        } else {
            this.sendFrame('PC1', 'PC2');
            setTimeout(() => this.sendFrame('PC3', 'PC4'), 100);
        }
    }

    updateStats() {
        d3.select('#framesSent').text(this.stats.framesSent);
        d3.select('#collisions').text(this.stats.collisions);
        
        const efficiency = this.stats.framesSent > 0 
            ? Math.round((1 - this.stats.collisions / this.stats.framesSent) * 100)
            : 100;
        d3.select('#efficiency').text(efficiency + '%');
    }

    reset() {
        this.stats = { framesSent: 0, collisions: 0 };
        this.updateStats();
        this.svg.selectAll('.frame').remove();
    }
}

// Initialize simulations
let bridgeDemo, routerDemo, switchDemo;

document.addEventListener('DOMContentLoaded', () => {
    // Wait for sections to be visible before initializing
    setTimeout(() => {
        if (document.getElementById('bridgeSimulation')) {
            bridgeDemo = new BridgeSimulation('bridgeSimulation');
        }
        if (document.getElementById('routerSimulation')) {
            routerDemo = new RouterSimulation('routerSimulation');
        }
        if (document.getElementById('switchSimulation')) {
            switchDemo = new SwitchSimulation('switchSimulation');
        }
    }, 500);
});


// ============================================
// REMAINING SIMULATIONS (Gateway, Firewall, VPN, Subnet)
// ADD THIS CODE TO simulations.js FILE
// ============================================

// ============================================
// Gateway Simulation
// ============================================
// ============================================
// Enhanced Gateway Simulation - Educationally Accurate
// ============================================
class GatewaySimulation {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        if (!this.container.node()) return;
        
        this.width = this.container.node().getBoundingClientRect().width;
        this.height = 450;
        this.animating = false;
        this.init();
    }

    init() {
        this.svg = this.container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Add arrow marker definition
        const defs = this.svg.append('defs');
        defs.append('marker')
            .attr('id', 'arrowhead')
            .attr('markerWidth', 10)
            .attr('markerHeight', 10)
            .attr('refX', 9)
            .attr('refY', 3)
            .attr('orient', 'auto')
            .append('polygon')
            .attr('points', '0 0, 10 3, 0 6')
            .attr('fill', 'white');

        this.drawInitialState();
    }

    drawInitialState() {
        this.svg.selectAll('*:not(defs)').remove();

        const centerX = this.width / 2;

        // Source Network (Left)
        this.drawNetworkBox(50, 50, 'Source Network', '#4ecdc4', 
            'Legacy System', 'SNA Protocol', '📟');

        // Gateway (Center) - Show it as a multi-layer device
        this.drawGateway(centerX);

        // Destination Network (Right)
        this.drawNetworkBox(this.width - 230, 50, 'Destination Network', '#71b280',
            'Modern System', 'TCP/IP', '💻');

        // Connection lines
        this.drawConnectionLine(230, 120, centerX - 90, 180, '#4ecdc4');
        this.drawConnectionLine(centerX + 90, 180, this.width - 230, 120, '#71b280');

        // Add info text
        this.svg.append('text')
            .attr('x', this.width/2)
            .attr('y', this.height - 20)
            .attr('text-anchor', 'middle')
            .attr('fill', '#95a5a6')
            .attr('font-size', '12px')
            .text('Gateway converts between different network architectures and protocols');
    }

    drawNetworkBox(x, y, title, color, systemType, protocol, icon) {
        const group = this.svg.append('g');
        
        // Main box
        group.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', 180)
            .attr('height', 140)
            .attr('fill', `${color}22`)
            .attr('stroke', color)
            .attr('stroke-width', 3)
            .attr('rx', 12);

        // Title
        group.append('text')
            .attr('x', x + 90)
            .attr('y', y + 25)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '14px')
            .text(title);

        // Icon
        group.append('text')
            .attr('x', x + 90)
            .attr('y', y + 65)
            .attr('text-anchor', 'middle')
            .attr('font-size', '32px')
            .text(icon);

        // System type
        group.append('text')
            .attr('x', x + 90)
            .attr('y', y + 95)
            .attr('text-anchor', 'middle')
            .attr('fill', '#bbb')
            .attr('font-size', '12px')
            .text(systemType);

        // Protocol badge
        const badge = group.append('g')
            .attr('transform', `translate(${x + 90}, ${y + 120})`);

        badge.append('rect')
            .attr('x', -45)
            .attr('y', -10)
            .attr('width', 90)
            .attr('height', 20)
            .attr('fill', color)
            .attr('rx', 10);

        badge.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', 5)
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '11px')
            .text(protocol);
    }

    drawGateway(centerX) {
        this.gateway = this.svg.append('g')
            .attr('transform', `translate(${centerX - 90}, 150)`);

        // Gateway main body
        this.gateway.append('rect')
            .attr('width', 180)
            .attr('height', 120)
            .attr('fill', 'rgba(155, 89, 182, 0.3)')
            .attr('stroke', '#9b59b6')
            .attr('stroke-width', 3)
            .attr('rx', 12);

        // Gateway icon
        this.gateway.append('text')
            .attr('x', 90)
            .attr('y', 35)
            .attr('text-anchor', 'middle')
            .attr('font-size', '28px')
            .text('🔄');

        // Gateway label
        this.gateway.append('text')
            .attr('x', 90)
            .attr('y', 60)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .text('GATEWAY');

        // Show OSI layers being processed
        const layers = ['Layer 7-4', 'Layer 3-1'];
        layers.forEach((layer, i) => {
            this.gateway.append('text')
                .attr('x', 90)
                .attr('y', 82 + i * 16)
                .attr('text-anchor', 'middle')
                .attr('fill', '#dda0dd')
                .attr('font-size', '10px')
                .text(layer);
        });
    }

    drawConnectionLine(x1, y1, x2, y2, color) {
        this.svg.append('line')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2)
            .attr('stroke', color)
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .style('opacity', 0.5);
    }

    translate(sourceProtocol, destProtocol) {
        if (this.animating) return;
        this.animating = true;

        // Map protocols to real-world scenarios
        const translations = {
            'HTTP-FTP': {
                source: 'HTTP',
                dest: 'FTP',
                description: 'Web request to file transfer',
                sourceIcon: '🌐',
                destIcon: '📁',
                sourceDetails: 'HTTP/1.1 GET request',
                destDetails: 'FTP RETR command',
                layers: ['Application', 'Presentation', 'Session']
            },
            'Email-SMS': {
                source: 'Email (SMTP)',
                dest: 'SMS (GSM)',
                description: 'Email to text message',
                sourceIcon: '📧',
                destIcon: '📱',
                sourceDetails: 'SMTP protocol',
                destDetails: 'SMS PDU format',
                layers: ['Application', 'Presentation', 'Transport']
            },
            'IPv4-IPv6': {
                source: 'IPv4',
                dest: 'IPv6',
                description: 'IPv4 to IPv6 translation',
                sourceIcon: '4️⃣',
                destIcon: '6️⃣',
                sourceDetails: '192.168.1.10',
                destDetails: '2001:0db8::1',
                layers: ['Network', 'Data Link']
            }
        };

        const key = `${sourceProtocol}-${destProtocol}`;
        const config = translations[key] || {
            source: sourceProtocol,
            dest: destProtocol,
            description: 'Protocol conversion',
            sourceIcon: '📦',
            destIcon: '📦',
            sourceDetails: sourceProtocol,
            destDetails: destProtocol,
            layers: ['All Layers']
        };

        // Create data packet with detailed info
        const packetGroup = this.svg.append('g')
            .attr('class', 'packet-animation');

        const packet = packetGroup.append('g')
            .attr('transform', 'translate(140, 120)');

        // Packet visual
        packet.append('rect')
            .attr('x', -30)
            .attr('y', -30)
            .attr('width', 60)
            .attr('height', 60)
            .attr('fill', '#fdbb2d')
            .attr('stroke', 'white')
            .attr('stroke-width', 3)
            .attr('rx', 8);

        packet.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', 5)
            .attr('fill', 'white')
            .attr('font-size', '24px')
            .text(config.sourceIcon);

        // Protocol label
        const protocolLabel = packet.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 45)
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '11px')
            .text(config.source);

        // Step 1: Move to gateway
        packet.transition()
            .duration(1200)
            .attr('transform', `translate(${this.width/2}, 210)`)
            .on('end', () => {
                // Step 2: Gateway processing animation
                this.animateGatewayProcessing(config, () => {
                    // Step 3: Change packet appearance
                    packet.select('text').text(config.destIcon);
                    protocolLabel.text(config.dest);
                    
                    packet.select('rect')
                        .transition()
                        .duration(300)
                        .attr('fill', '#2ecc71');

                    // Step 4: Move to destination
                    packet.transition()
                        .delay(500)
                        .duration(1200)
                        .attr('transform', `translate(${this.width - 140}, 120)`)
                        .on('end', () => {
                            // Success animation
                            packet.select('rect')
                                .transition()
                                .duration(200)
                                .attr('width', 80)
                                .attr('height', 80)
                                .attr('x', -40)
                                .attr('y', -40)
                                .transition()
                                .duration(300)
                                .style('opacity', 0);

                            packetGroup.transition()
                                .delay(500)
                                .remove();

                            this.animating = false;
                        });
                });
            });

        // Log the translation with details
        this.logTranslation(config);
    }

    animateGatewayProcessing(config, callback) {
        // Show processing layers
        const processingGroup = this.gateway.append('g')
            .attr('class', 'processing');

        // Pulsing effect
        this.gateway.select('rect')
            .transition()
            .duration(300)
            .attr('fill', 'rgba(253, 187, 45, 0.5)')
            .transition()
            .duration(300)
            .attr('fill', 'rgba(46, 204, 113, 0.5)')
            .transition()
            .duration(300)
            .attr('fill', 'rgba(155, 89, 182, 0.3)');

        // Show layer processing
        config.layers.forEach((layer, i) => {
            const layerText = processingGroup.append('text')
                .attr('x', 90)
                .attr('y', 30 + i * 15)
                .attr('text-anchor', 'middle')
                .attr('fill', '#fdbb2d')
                .attr('font-size', '10px')
                .attr('font-weight', 'bold')
                .style('opacity', 0)
                .text(`✓ ${layer}`);

            layerText.transition()
                .delay(i * 200)
                .duration(300)
                .style('opacity', 1);
        });

        setTimeout(() => {
            processingGroup.transition()
                .duration(400)
                .style('opacity', 0)
                .remove();
            callback();
        }, config.layers.length * 200 + 500);
    }

    logTranslation(config) {
        const log = d3.select('#translationLog');
        
        const timestamp = new Date().toLocaleTimeString();
        
        const entry = log.insert('div', ':first-child')
            .attr('class', 'log-entry')
            .style('animation', 'slideIn 0.4s ease')
            .style('border-left', '3px solid #9b59b6')
            .style('padding-left', '10px')
            .style('margin-bottom', '8px')
            .html(`
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <strong style="color: #fdbb2d;">⏰ ${timestamp}</strong>
                    <span style="color: #2ecc71; font-weight: bold;">✓ Success</span>
                </div>
                <div style="color: #fff; margin-bottom: 4px;">
                    <strong>Translation:</strong> ${config.description}
                </div>
                <div style="color: #95a5a6; font-size: 11px; display: flex; gap: 10px;">
                    <span>📤 ${config.sourceDetails}</span>
                    <span>→</span>
                    <span>📥 ${config.destDetails}</span>
                </div>
                <div style="color: #9b59b6; font-size: 10px; margin-top: 4px;">
                    Processed layers: ${config.layers.join(', ')}
                </div>
            `);

        // Keep only last 4 entries
        const entries = log.selectAll('.log-entry');
        if (entries.size() > 4) {
            entries.filter((d, i) => i >= 4).remove();
        }
    }

    reset() {
        this.animating = false;
        this.svg.selectAll('.packet-animation').remove();
        this.svg.selectAll('.processing').remove();
        d3.select('#translationLog').html(`
            <div class="log-entry" style="color: #95a5a6; text-align: center; padding: 20px;">
                <div style="font-size: 24px; margin-bottom: 10px;">🔄</div>
                <div>Click a button above to see gateway translation in action!</div>
                <div style="font-size: 11px; margin-top: 8px; color: #7f8c8d;">
                    Gateways work at all 7 OSI layers to convert protocols
                </div>
            </div>
        `);
        this.drawInitialState();
    }
}

// ============================================
// Firewall Simulation
// ============================================
class FirewallSimulation {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        if (!this.container.node()) return;
        
        this.width = this.container.node().getBoundingClientRect().width;
        this.height = 400;
        this.stats = { allowed: 0, blocked: 0 };
        
        this.rules = {
            '80': 'allow',
            '443': 'allow',
            '22': 'deny',
            '53': 'allow'
        };
        
        this.init();
    }

    init() {
        this.svg = this.container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Internet (left)
        this.drawCloud(100, this.height/2, 'Internet', '#e74c3c');

        // Firewall (center)
        this.firewall = this.svg.append('g')
            .attr('transform', `translate(${this.width/2 - 60}, ${this.height/2 - 60})`);

        this.firewall.append('rect')
            .attr('width', 120)
            .attr('height', 120)
            .attr('fill', '#c31432')
            .attr('stroke', '#ff6b6b')
            .attr('stroke-width', 3)
            .attr('rx', 12);

        this.firewall.append('text')
            .attr('x', 60)
            .attr('y', 50)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .text('🛡️');

        this.firewall.append('text')
            .attr('x', 60)
            .attr('y', 75)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text('FIREWALL');

        // Protected Network (right)
        this.drawCloud(this.width - 100, this.height/2, 'Protected\nNetwork', '#2ecc71');
    }

    drawCloud(x, y, label, color) {
        const group = this.svg.append('g');
        
        group.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 60)
            .attr('fill', `${color}33`)
            .attr('stroke', color)
            .attr('stroke-width', 2);

        group.append('text')
            .attr('x', x)
            .attr('y', y)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .text(label);
    }

    sendPacket(sourceIP, port, protocol) {
        const action = this.rules[port] || 'deny';
        const isAllowed = action === 'allow';

        // Create packet
        const packet = this.svg.append('g')
            .attr('class', 'packet')
            .attr('transform', `translate(160, ${this.height/2})`);

        packet.append('circle')
            .attr('r', 12)
            .attr('fill', isAllowed ? '#2ecc71' : '#e74c3c')
            .attr('stroke', 'white')
            .attr('stroke-width', 2);

        packet.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', 4)
            .attr('fill', 'white')
            .attr('font-size', '10px')
            .attr('font-weight', 'bold')
            .text(port);

        // Animate to firewall
        packet.transition()
            .duration(800)
            .attr('transform', `translate(${this.width/2}, ${this.height/2})`)
            .on('end', () => {
                // Flash firewall
                this.firewall.select('rect')
                    .transition()
                    .duration(200)
                    .attr('fill', isAllowed ? '#2ecc71' : '#ff0000')
                    .transition()
                    .duration(200)
                    .attr('fill', '#c31432');

                if (isAllowed) {
                    // Allow - continue to protected network
                    packet.transition()
                        .delay(400)
                        .duration(800)
                        .attr('transform', `translate(${this.width - 160}, ${this.height/2})`)
                        .on('end', () => {
                            packet.transition().duration(300).style('opacity', 0).remove();
                        });
                    this.stats.allowed++;
                } else {
                    // Deny - show X and remove
                    packet.append('text')
                        .attr('text-anchor', 'middle')
                        .attr('dy', 4)
                        .attr('fill', 'white')
                        .attr('font-size', '20px')
                        .attr('font-weight', 'bold')
                        .text('✗');
                    
                    packet.transition()
                        .delay(400)
                        .duration(500)
                        .style('opacity', 0)
                        .remove();
                    
                    this.stats.blocked++;
                }

                this.updateStats();
            });
    }

    updateStats() {
        d3.select('#allowedCount').text(this.stats.allowed);
        d3.select('#blockedCount').text(this.stats.blocked);
    }

    reset() {
        this.svg.selectAll('.packet').remove();
        this.stats = { allowed: 0, blocked: 0 };
        this.updateStats();
    }
}

// ============================================
// VPN Simulation
// ============================================
class VPNSimulation {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        if (!this.container.node()) return;
        
        this.width = this.container.node().getBoundingClientRect().width;
        this.height = 400;
        this.mode = 'without';
        this.init();
    }

    init() {
        this.svg = this.container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Your Device
        this.drawDevice(80, this.height/2, '💻 You', '#3498db');

        // Internet (middle) - dangerous zone
        this.internet = this.svg.append('g')
            .attr('transform', `translate(${this.width/2 - 100}, 100)`);

        this.internet.append('rect')
            .attr('width', 200)
            .attr('height', 200)
            .attr('fill', 'rgba(231, 76, 60, 0.2)')
            .attr('stroke', '#e74c3c')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('rx', 12);

        this.internet.append('text')
            .attr('x', 100)
            .attr('y', 100)
            .attr('text-anchor', 'middle')
            .attr('fill', '#e74c3c')
            .attr('font-weight', 'bold')
            .attr('font-size', '16px')
            .text('🌐 Internet');

        this.internet.append('text')
            .attr('x', 100)
            .attr('y', 120)
            .attr('text-anchor', 'middle')
            .attr('fill', '#e74c3c')
            .attr('font-size', '12px')
            .text('(Hackers can see!)');

        // Destination
        this.drawDevice(this.width - 80, this.height/2, '🏢 Website', '#2ecc71');

        // VPN Tunnel (hidden initially)
        this.tunnel = this.svg.append('line')
            .attr('x1', 150)
            .attr('y1', this.height/2)
            .attr('x2', this.width - 150)
            .attr('y2', this.height/2)
            .attr('stroke', '#00d4ff')
            .attr('stroke-width', 20)
            .attr('opacity', 0);
    }

    drawDevice(x, y, label, color) {
        const group = this.svg.append('g');

        group.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 40)
            .attr('fill', `${color}33`)
            .attr('stroke', color)
            .attr('stroke-width', 2);

        group.append('text')
            .attr('x', x)
            .attr('y', y - 50)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .text(label);
    }

    setMode(mode) {
        this.mode = mode;

        if (mode === 'with') {
            // Show VPN tunnel
            this.tunnel.transition()
                .duration(500)
                .attr('opacity', 0.6);

            // Update info
            d3.select('#visibleIP').text('VPN Server IP: 104.28.12.45').style('color', '#2ecc71');
            d3.select('#encryption').text('AES-256 Encrypted').style('color', '#2ecc71');
        } else {
            // Hide VPN tunnel
            this.tunnel.transition()
                .duration(500)
                .attr('opacity', 0);

            // Update info
            d3.select('#visibleIP').text('192.168.1.100').style('color', '#e74c3c');
            d3.select('#encryption').text('None (Exposed!)').style('color', '#e74c3c');
        }
    }

    sendData(dataType) {
        const isSecure = this.mode === 'with';
        
        // Create data packet
        const packet = this.svg.append('g')
            .attr('class', 'packet')
            .attr('transform', `translate(150, ${this.height/2})`);

        packet.append('rect')
            .attr('x', -40)
            .attr('y', -15)
            .attr('width', 80)
            .attr('height', 30)
            .attr('fill', isSecure ? '#2ecc71' : '#e74c3c')
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .attr('rx', 8);

        packet.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', 5)
            .attr('fill', 'white')
            .attr('font-size', '10px')
            .attr('font-weight', 'bold')
            .text(isSecure ? '🔒 ' + dataType : dataType);

        // Animate
        const path = isSecure ? 
            `translate(${this.width/2}, ${this.height/2})` : 
            `translate(${this.width/2}, ${this.height/2 - 50})`;

        packet.transition()
            .duration(1000)
            .attr('transform', path)
            .transition()
            .duration(1000)
            .attr('transform', `translate(${this.width - 150}, ${this.height/2})`)
            .on('end', () => {
                packet.transition().duration(300).style('opacity', 0).remove();
            });

        // Show warning if not secure
        if (!isSecure) {
            const warning = this.svg.append('text')
                .attr('x', this.width/2)
                .attr('y', this.height/2 + 50)
                .attr('text-anchor', 'middle')
                .attr('fill', '#e74c3c')
                .attr('font-weight', 'bold')
                .attr('font-size', '14px')
                .text('⚠️ Data Exposed!')
                .style('opacity', 0);

            warning.transition()
                .duration(300)
                .style('opacity', 1)
                .transition()
                .delay(1500)
                .duration(300)
                .style('opacity', 0)
                .remove();
        }
    }

    reset() {
        this.svg.selectAll('.packet').remove();
    }
}

// ============================================
// Subnet Simulation
// ============================================
class SubnetSimulation {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        if (!this.container.node()) return;
        
        this.width = this.container.node().getBoundingClientRect().width;
        this.height = 450;
        this.currentNetwork = null;
        this.currentCIDR = null;
        this.animating = false;
        
        this.init();
    }

    init() {
        this.svg = this.container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Draw initial large network
        this.drawInitialNetwork();
    }

    drawInitialNetwork() {
        this.svg.selectAll('*').remove();

        // Create a visual representation of a large, unorganized network
        const networkGroup = this.svg.append('g');

        // Main network boundary
        networkGroup.append('rect')
            .attr('x', 30)
            .attr('y', 30)
            .attr('width', this.width - 60)
            .attr('height', 360)
            .attr('fill', 'rgba(241, 196, 15, 0.15)')
            .attr('stroke', '#f39c12')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', '10,5')
            .attr('rx', 12);

        // Title
        networkGroup.append('text')
            .attr('x', this.width/2)
            .attr('y', 60)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '20px')
            .text('🏢 Unorganized Network (Before Subnetting)');

        // Subtitle
        networkGroup.append('text')
            .attr('x', this.width/2)
            .attr('y', 85)
            .attr('text-anchor', 'middle')
            .attr('fill', '#bbb')
            .attr('font-size', '14px')
            .text('All devices in one big network - Hard to manage!');

        // Draw scattered devices to show chaos
        const devices = [
            { x: 80, y: 140, icon: '💻', label: 'PC-1', type: 'Sales' },
            { x: 200, y: 160, icon: '🖥️', label: 'Server', type: 'IT' },
            { x: 140, y: 220, icon: '💻', label: 'PC-2', type: 'HR' },
            { x: 280, y: 180, icon: '📱', label: 'Phone', type: 'Sales' },
            { x: 100, y: 280, icon: '🖨️', label: 'Printer', type: 'IT' },
            { x: 250, y: 250, icon: '💻', label: 'PC-3', type: 'HR' },
            { x: 320, y: 140, icon: '💻', label: 'PC-4', type: 'Sales' },
            { x: 180, y: 320, icon: '🖥️', label: 'Server-2', type: 'IT' }
        ];

        // Add more devices for wider screens
        if (this.width > 600) {
            devices.push(
                { x: this.width - 150, y: 140, icon: '💻', label: 'PC-5', type: 'HR' },
                { x: this.width - 200, y: 200, icon: '📱', label: 'Phone-2', type: 'Sales' },
                { x: this.width - 100, y: 250, icon: '🖨️', label: 'Printer-2', type: 'HR' },
                { x: this.width - 250, y: 300, icon: '💻', label: 'PC-6', type: 'IT' }
            );
        }

        devices.forEach((device, i) => {
            const deviceGroup = networkGroup.append('g')
                .attr('transform', `translate(${device.x}, ${device.y})`)
                .style('opacity', 0);

            // Device circle background
            deviceGroup.append('circle')
                .attr('r', 25)
                .attr('fill', 'rgba(52, 152, 219, 0.3)')
                .attr('stroke', '#3498db')
                .attr('stroke-width', 2);

            // Device icon
            deviceGroup.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .attr('font-size', '24px')
                .text(device.icon);

            // Device label
            deviceGroup.append('text')
                .attr('text-anchor', 'middle')
                .attr('y', 40)
                .attr('fill', 'white')
                .attr('font-size', '11px')
                .text(device.label);

            // Department badge
            deviceGroup.append('text')
                .attr('text-anchor', 'middle')
                .attr('y', 55)
                .attr('fill', '#95a5a6')
                .attr('font-size', '9px')
                .text(`(${device.type})`);

            // Animate in
            deviceGroup.transition()
                .delay(i * 80)
                .duration(400)
                .style('opacity', 1);

            // Add chaotic connection lines to show traffic
            if (i > 0 && i % 2 === 0) {
                const prevDevice = devices[i - 1];
                networkGroup.append('line')
                    .attr('x1', device.x)
                    .attr('y1', device.y)
                    .attr('x2', prevDevice.x)
                    .attr('y2', prevDevice.y)
                    .attr('stroke', 'rgba(231, 76, 60, 0.3)')
                    .attr('stroke-width', 1)
                    .attr('stroke-dasharray', '5,5')
                    .style('opacity', 0)
                    .transition()
                    .delay(devices.length * 80)
                    .duration(600)
                    .style('opacity', 1);
            }
        });

        // Add warning icon
        networkGroup.append('text')
            .attr('x', this.width/2)
            .attr('y', this.height - 30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#e74c3c')
            .attr('font-size', '16px')
            .style('opacity', 0)
            .text('⚠️ Broadcast storms! Security issues! Hard to manage!')
            .transition()
            .delay(1000)
            .duration(600)
            .style('opacity', 1);
    }

    calculateSubnet(network, cidr) {
        if (this.animating) return;
        this.animating = true;

        this.currentNetwork = network;
        this.currentCIDR = cidr;

        const parts = network.split('.');
        const baseIP = parts.map(Number);

        const hostBits = 32 - cidr;
        const totalHosts = Math.pow(2, hostBits) - 2;
        
        const subnetMask = this.cidrToMask(cidr);
        const firstHost = [...baseIP];
        firstHost[3] += 1;
        
        const lastHost = [...baseIP];
        const maxValue = Math.pow(2, hostBits) - 2;
        lastHost[3] += maxValue;
        
        const broadcast = [...baseIP];
        broadcast[3] += Math.pow(2, hostBits) - 1;

        // Update display with animation
        this.animateValueUpdate('#networkAddr', network + '/' + cidr);
        this.animateValueUpdate('#subnetMask', subnetMask, 100);
        this.animateValueUpdate('#firstHost', firstHost.join('.'), 200);
        this.animateValueUpdate('#lastHost', lastHost.join('.'), 300);
        this.animateValueUpdate('#broadcast', broadcast.join('.'), 400);
        this.animateValueUpdate('#totalHosts', totalHosts.toLocaleString() + ' usable hosts', 500);

        // Visualize the subnetting
        setTimeout(() => {
            this.visualizeSubnetting(cidr);
        }, 600);
    }

    animateValueUpdate(selector, value, delay = 0) {
        setTimeout(() => {
            const element = d3.select(selector);
            element.style('color', '#f39c12')
                .style('transform', 'scale(1.2)')
                .text(value)
                .transition()
                .duration(400)
                .style('transform', 'scale(1)')
                .style('color', 'white');
        }, delay);
    }

    cidrToMask(cidr) {
        const mask = [];
        for (let i = 0; i < 4; i++) {
            const n = Math.min(cidr, 8);
            mask.push(256 - Math.pow(2, 8 - n));
            cidr -= n;
        }
        return mask.join('.');
    }

    visualizeSubnetting(cidr) {
        this.svg.selectAll('*').remove();

        // Determine number of subnets to show
        const numSubnets = cidr === 24 ? 4 : cidr === 26 ? 4 : 2;
        const departments = ['Sales 💼', 'IT 💻', 'HR 👥', 'Management 📊'];
        const colors = [
            'rgba(46, 204, 113, 0.3)',
            'rgba(52, 152, 219, 0.3)',
            'rgba(155, 89, 182, 0.3)',
            'rgba(230, 126, 34, 0.3)'
        ];

        // Calculate layout
        const cols = numSubnets === 2 ? 2 : 2;
        const rows = Math.ceil(numSubnets / cols);
        const boxWidth = (this.width - 80) / cols - 20;
        const boxHeight = (this.height - 100) / rows - 20;

        // Title
        this.svg.append('text')
            .attr('x', this.width/2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '20px')
            .style('opacity', 0)
            .text('🎯 Organized Network (After Subnetting)')
            .transition()
            .duration(600)
            .style('opacity', 1);

        // Create subnets
        for (let i = 0; i < numSubnets; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            
            const x = 40 + col * (boxWidth + 20);
            const y = 60 + row * (boxHeight + 20);

            this.createSubnetBox(x, y, boxWidth, boxHeight, i, departments[i], colors[i], cidr);
        }

        // Add benefits text
        this.svg.append('text')
            .attr('x', this.width/2)
            .attr('y', this.height - 15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#2ecc71')
            .attr('font-size', '14px')
            .style('opacity', 0)
            .text('✓ Better organization  ✓ Enhanced security  ✓ Reduced broadcast traffic')
            .transition()
            .delay(1500)
            .duration(600)
            .style('opacity', 1);

        this.animating = false;
    }

    createSubnetBox(x, y, width, height, index, department, color, cidr) {
        const group = this.svg.append('g');

        // Subnet box
        group.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', color)
            .attr('stroke', this.getStrokeColor(index))
            .attr('stroke-width', 3)
            .attr('rx', 12)
            .style('opacity', 0)
            .transition()
            .delay(index * 250)
            .duration(600)
            .style('opacity', 1);

        // Department label
        group.append('text')
            .attr('x', x + width/2)
            .attr('y', y + 30)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .attr('font-size', '16px')
            .style('opacity', 0)
            .text(department)
            .transition()
            .delay(index * 250 + 300)
            .duration(400)
            .style('opacity', 1);

        // Subnet address
        const subnetAddr = this.calculateSubnetAddress(index, cidr);
        group.append('text')
            .attr('x', x + width/2)
            .attr('y', y + 55)
            .attr('text-anchor', 'middle')
            .attr('fill', '#bbb')
            .attr('font-size', '13px')
            .style('opacity', 0)
            .text(subnetAddr)
            .transition()
            .delay(index * 250 + 400)
            .duration(400)
            .style('opacity', 1);

        // Draw devices in subnet
        const devicePositions = [
            { dx: -40, dy: 30 },
            { dx: 40, dy: 30 },
            { dx: -40, dy: 80 },
            { dx: 40, dy: 80 }
        ];

        const icons = ['💻', '🖥️', '📱', '🖨️'];

        devicePositions.forEach((pos, i) => {
            if (height > 150) { // Only show if box is tall enough
                const deviceGroup = group.append('g')
                    .attr('transform', `translate(${x + width/2 + pos.dx}, ${y + 80 + pos.dy})`)
                    .style('opacity', 0);

                deviceGroup.append('circle')
                    .attr('r', 18)
                    .attr('fill', 'rgba(255, 255, 255, 0.1)')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 1.5);

                deviceGroup.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '0.35em')
                    .attr('font-size', '18px')
                    .text(icons[i]);

                deviceGroup.transition()
                    .delay(index * 250 + 600 + i * 100)
                    .duration(400)
                    .style('opacity', 1);
            }
        });

        // Host count badge
        const hostCount = Math.pow(2, 32 - cidr) - 2;
        const badge = group.append('g')
            .attr('transform', `translate(${x + width - 15}, ${y + height - 15})`);

        badge.append('circle')
            .attr('r', 25)
            .attr('fill', 'rgba(241, 196, 15, 0.9)')
            .style('opacity', 0)
            .transition()
            .delay(index * 250 + 800)
            .duration(400)
            .style('opacity', 1);

        badge.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '-0.1em')
            .attr('fill', 'white')
            .attr('font-size', '11px')
            .attr('font-weight', 'bold')
            .style('opacity', 0)
            .text(hostCount)
            .transition()
            .delay(index * 250 + 800)
            .duration(400)
            .style('opacity', 1);

        badge.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .attr('fill', 'white')
            .attr('font-size', '8px')
            .style('opacity', 0)
            .text('hosts')
            .transition()
            .delay(index * 250 + 800)
            .duration(400)
            .style('opacity', 1);
    }

    calculateSubnetAddress(subnetIndex, cidr) {
        if (!this.currentNetwork) return '';
        
        const parts = this.currentNetwork.split('.');
        const baseIP = parts.map(Number);
        const hostBits = 32 - cidr;
        const increment = Math.pow(2, hostBits);
        
        baseIP[3] += subnetIndex * increment;
        
        return `${baseIP.join('.')}/${cidr}`;
    }

    getStrokeColor(index) {
        const colors = ['#2ecc71', '#3498db', '#9b59b6', '#e67e22'];
        return colors[index % colors.length];
    }

    showDivision() {
        // Show a practical example of subnetting
        this.calculateSubnet('192.168.1.0', 26);
    }

    reset() {
        this.animating = false;
        this.currentNetwork = null;
        this.currentCIDR = null;
        this.drawInitialNetwork();
        
        // Reset info display
        d3.select('#networkAddr').text('-');
        d3.select('#subnetMask').text('-');
        d3.select('#firstHost').text('-');
        d3.select('#lastHost').text('-');
        d3.select('#broadcast').text('-');
        d3.select('#totalHosts').text('-');
    }
}

// ============================================
// Initialize all remaining simulations
// ============================================
let gatewayDemo, firewallDemo, vpnDemo, subnetDemo;

// Add to existing DOMContentLoaded or create new one
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('gatewaySimulation')) {
            gatewayDemo = new GatewaySimulation('gatewaySimulation');
        }
        if (document.getElementById('firewallSimulation')) {
            firewallDemo = new FirewallSimulation('firewallSimulation');
        }
        if (document.getElementById('vpnSimulation')) {
            vpnDemo = new VPNSimulation('vpnSimulation');
        }
        if (document.getElementById('subnetSimulation')) {
            subnetDemo = new SubnetSimulation('subnetSimulation');
        }
    }, 1000);
});

console.log('🎮 Gateway Demo:', 'gatewayDemo.translate("HTTP", "FTP")');
console.log('🎮 Firewall Demo:', 'firewallDemo.sendPacket("192.168.1.10", "80", "TCP")');
console.log('🎮 VPN Demo:', 'vpnDemo.sendData("Login Credentials")');
console.log('🎮 Subnet Demo:', 'subnetDemo.calculateSubnet("192.168.1.0", 24)');