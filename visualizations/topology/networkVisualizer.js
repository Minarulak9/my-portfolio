/* ================================
   Network Visualizer - D3.js Implementation
   ================================ */

class NetworkVisualizer {
    constructor(svgElement) {
        this.svg = d3.select(svgElement);
        this.width = svgElement.clientWidth;
        this.height = svgElement.clientHeight;
        this.currentNetwork = null;
        this.nodes = [];
        this.links = [];
        this.showLabels = true;
        this.showPackets = true;
        this.showLatency = true;
        
        // Groups for layering
        this.linkGroup = this.svg.append('g').attr('class', 'links');
        this.nodeGroup = this.svg.append('g').attr('class', 'nodes');
        this.labelGroup = this.svg.append('g').attr('class', 'labels');
        this.packetGroup = this.svg.append('g').attr('class', 'packets');
        
        // Resize handler
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        this.width = this.svg.node().clientWidth;
        this.height = this.svg.node().clientHeight;
        if (this.currentNetwork) {
            this.renderNetwork(this.currentNetwork);
        }
    }

    clearCanvas() {
        this.linkGroup.selectAll('*').remove();
        this.nodeGroup.selectAll('*').remove();
        this.labelGroup.selectAll('*').remove();
        this.packetGroup.selectAll('*').remove();
    }

    renderNetwork(networkKey) {
        this.clearCanvas();
        this.currentNetwork = networkKey;
        
        const networkData = NetworkData.networks[networkKey];
        if (!networkData) return;

        // Scale positions to fit canvas
        const scaleFactor = Math.min(this.width / 800, this.height / 600);
        const offsetX = (this.width - 800 * scaleFactor) / 2;
        const offsetY = (this.height - 600 * scaleFactor) / 2;

        // Prepare nodes with scaled positions
        this.nodes = networkData.devices.map(device => ({
            ...device,
            x: device.x * scaleFactor + offsetX,
            y: device.y * scaleFactor + offsetY,
            originalX: device.x,
            originalY: device.y
        }));

        // Prepare links
        this.links = networkData.connections.map(conn => {
            const source = this.nodes.find(n => n.id === conn.source);
            const target = this.nodes.find(n => n.id === conn.target);
            return {
                ...conn,
                source: source,
                target: target
            };
        });

        // Render links
        this.renderLinks();
        
        // Render nodes
        this.renderNodes();
        
        // Render labels
        if (this.showLabels) {
            this.renderLabels();
        }
    }

    renderLinks() {
        const links = this.linkGroup
            .selectAll('.link')
            .data(this.links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)
            .attr('stroke', '#475569')
            .attr('stroke-width', 2)
            .attr('opacity', 0)
            .style('stroke-dasharray', d => {
                // Calculate line length
                const dx = d.target.x - d.source.x;
                const dy = d.target.y - d.source.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                return `${length} ${length}`;
            })
            .style('stroke-dashoffset', d => {
                const dx = d.target.x - d.source.x;
                const dy = d.target.y - d.source.y;
                return Math.sqrt(dx * dx + dy * dy);
            });

        // Animate links
        links.transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .attr('opacity', 0.6)
            .style('stroke-dashoffset', 0);

        // Add latency labels if enabled
        if (this.showLatency) {
            const latencyLabels = this.labelGroup
                .selectAll('.latency-label')
                .data(this.links)
                .enter()
                .append('text')
                .attr('class', 'latency-label')
                .attr('x', d => (d.source.x + d.target.x) / 2)
                .attr('y', d => (d.source.y + d.target.y) / 2)
                .attr('text-anchor', 'middle')
                .attr('fill', '#f59e0b')
                .attr('font-size', '10px')
                .attr('opacity', 0)
                .text(d => `${d.latency}ms`);

            latencyLabels.transition()
                .duration(500)
                .delay(1000)
                .attr('opacity', 0.8);
        }
    }

    renderNodes() {
        const nodeGroups = this.nodeGroup
            .selectAll('.node')
            .data(this.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .attr('opacity', 0)
            .style('cursor', 'pointer');

        // Add glow filter
        const defs = this.svg.append('defs');
        const filter = defs.append('filter')
            .attr('id', 'glow');
        filter.append('feGaussianBlur')
            .attr('stdDeviation', '3')
            .attr('result', 'coloredBlur');
        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Draw node circles
        nodeGroups.append('circle')
            .attr('class', 'node-circle')
            .attr('r', d => this.getNodeRadius(d.type))
            .attr('fill', d => this.getNodeColor(d.type))
            .attr('stroke', '#3b82f6')
            .attr('stroke-width', 3)
            .attr('filter', 'url(#glow)');

        // Add device icons (as text emoji)
        nodeGroups.append('text')
            .attr('class', 'node-icon')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('font-size', d => this.getNodeRadius(d.type) * 1.2)
            .text(d => d.icon || '🔘')
            .style('pointer-events', 'none')
            .style('user-select', 'none');

        // Add pulse animation
        const self = this; // Store reference to NetworkVisualizer instance
        nodeGroups.append('circle')
            .attr('class', 'node-pulse')
            .attr('r', d => this.getNodeRadius(d.type))
            .attr('fill', 'none')
            .attr('stroke', '#3b82f6')
            .attr('stroke-width', 2)
            .attr('opacity', 0.8)
            .each(function(d) {
                const pulseElement = this;
                const baseRadius = self.getNodeRadius(d.type);
                const maxRadius = baseRadius * 1.5;
                
                function repeat() {
                    d3.select(pulseElement)
                        .attr('r', baseRadius)
                        .attr('opacity', 0.8)
                        .transition()
                        .duration(2000)
                        .ease(d3.easeLinear)
                        .attr('r', maxRadius)
                        .attr('opacity', 0)
                        .on('end', repeat);
                }
                
                d3.select(pulseElement)
                    .transition()
                    .duration(2000)
                    .ease(d3.easeLinear)
                    .attr('r', maxRadius)
                    .attr('opacity', 0)
                    .on('end', repeat);
            });

        // Animate nodes
        nodeGroups.transition()
            .duration(600)
            .delay((d, i) => i * 100 + 400)
            .attr('opacity', 1);

        // Store reference for interactions
        this.nodeElements = nodeGroups;
    }

    renderLabels() {
        const labels = this.labelGroup
            .selectAll('.node-label')
            .data(this.nodes)
            .enter()
            .append('text')
            .attr('class', 'node-label')
            .attr('x', d => d.x)
            .attr('y', d => d.y + this.getNodeRadius(d.type) + 20)
            .attr('text-anchor', 'middle')
            .attr('fill', '#f1f5f9')
            .attr('font-size', '12px')
            .attr('font-weight', '500')
            .attr('opacity', 0)
            .text(d => d.name);

        labels.transition()
            .duration(500)
            .delay(1200)
            .attr('opacity', 1);
    }

    getNodeRadius(type) {
        const radii = {
            router: 35,
            server: 40,
            computer: 30,
            laptop: 30,
            mobile: 25,
            printer: 28,
            lan: 45,
            default: 30
        };
        return radii[type] || radii.default;
    }

    getNodeColor(type) {
        const colors = {
            router: '#8b5cf6',
            server: '#3b82f6',
            computer: '#10b981',
            laptop: '#10b981',
            mobile: '#f59e0b',
            printer: '#ef4444',
            lan: '#06b6d4',
            default: '#64748b'
        };
        return colors[type] || colors.default;
    }

    highlightNode(nodeId) {
        this.nodeElements.each(function(d) {
            if (d.id === nodeId) {
                d3.select(this).select('.node-circle')
                    .transition()
                    .duration(300)
                    .attr('stroke-width', 5)
                    .attr('stroke', '#fbbf24');
            }
        });
    }

    unhighlightNode(nodeId) {
        this.nodeElements.each(function(d) {
            if (d.id === nodeId) {
                d3.select(this).select('.node-circle')
                    .transition()
                    .duration(300)
                    .attr('stroke-width', 3)
                    .attr('stroke', '#3b82f6');
            }
        });
    }

    highlightPath(sourceId, targetId) {
        // Find the link
        const link = this.links.find(l => 
            (l.source.id === sourceId && l.target.id === targetId) ||
            (l.source.id === targetId && l.target.id === sourceId)
        );

        if (link) {
            this.linkGroup.selectAll('.link').each(function(d) {
                if (d === link) {
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .attr('stroke', '#3b82f6')
                        .attr('stroke-width', 4)
                        .attr('opacity', 1);
                }
            });
        }
    }

    unhighlightPath(sourceId, targetId) {
        const link = this.links.find(l => 
            (l.source.id === sourceId && l.target.id === targetId) ||
            (l.source.id === targetId && l.target.id === sourceId)
        );

        if (link) {
            this.linkGroup.selectAll('.link').each(function(d) {
                if (d === link) {
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .attr('stroke', '#475569')
                        .attr('stroke-width', 2)
                        .attr('opacity', 0.6);
                }
            });
        }
    }

    sendPacket(sourceId, targetId, callback) {
        if (!this.showPackets) {
            if (callback) callback();
            return;
        }

        const source = this.nodes.find(n => n.id === sourceId);
        const target = this.nodes.find(n => n.id === targetId);

        if (!source || !target) return;

        // Highlight the path
        this.highlightPath(sourceId, targetId);

        // Create packet
        const packet = this.packetGroup
            .append('circle')
            .attr('class', 'packet')
            .attr('r', 6)
            .attr('cx', source.x)
            .attr('cy', source.y)
            .attr('fill', '#60a5fa')
            .attr('filter', 'url(#glow)');

        // Calculate path
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const duration = distance * 2; // Speed factor

        // Animate packet
        packet.transition()
            .duration(duration)
            .ease(d3.easeLinear)
            .attr('cx', target.x)
            .attr('cy', target.y)
            .on('end', () => {
                // Remove packet
                packet.transition()
                    .duration(200)
                    .attr('r', 15)
                    .attr('opacity', 0)
                    .remove();

                // Unhighlight path
                setTimeout(() => {
                    this.unhighlightPath(sourceId, targetId);
                }, 300);

                if (callback) callback();
            });
    }

    sendMultiplePackets(sourceId, targetId, count, interval) {
        let sent = 0;
        const sendNext = () => {
            if (sent < count) {
                this.sendPacket(sourceId, targetId, () => {
                    sent++;
                    if (sent < count) {
                        setTimeout(sendNext, interval);
                    }
                });
            }
        };
        sendNext();
    }

    animateDataFlow(sourceId, targetIds, options = {}) {
        const { sequential = true, interval = 500 } = options;
        
        if (sequential) {
            let index = 0;
            const sendToNext = () => {
                if (index < targetIds.length) {
                    this.sendPacket(sourceId, targetIds[index], () => {
                        index++;
                        setTimeout(sendToNext, interval);
                    });
                }
            };
            sendToNext();
        } else {
            // Send to all simultaneously
            targetIds.forEach((targetId, i) => {
                setTimeout(() => {
                    this.sendPacket(sourceId, targetId);
                }, i * 100);
            });
        }
    }

    simulateNetworkCongestion(linkIndex, duration = 3000) {
        const link = this.links[linkIndex];
        if (!link) return;

        // Visual indication of congestion
        this.linkGroup.selectAll('.link').each(function(d, i) {
            if (i === linkIndex) {
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr('stroke', '#ef4444')
                    .attr('stroke-width', 5);

                // Send multiple packets to show congestion
                const packets = [];
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => {
                        const packet = d3.select('.packets')
                            .append('circle')
                            .attr('class', 'packet')
                            .attr('r', 5)
                            .attr('cx', d.source.x)
                            .attr('cy', d.source.y)
                            .attr('fill', '#ef4444')
                            .attr('opacity', 0.8);

                        const progress = Math.random();
                        const cx = d.source.x + (d.target.x - d.source.x) * progress;
                        const cy = d.source.y + (d.target.y - d.source.y) * progress;

                        packet.attr('cx', cx).attr('cy', cy);
                        packets.push(packet);
                    }, i * 100);
                }

                // Clear after duration
                setTimeout(() => {
                    packets.forEach(p => p.remove());
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .attr('stroke', '#475569')
                        .attr('stroke-width', 2);
                }, duration);
            }
        });
    }

    simulateDeviceFailure(nodeId, duration = 3000) {
        const self = this;
        this.nodeElements.each(function(d) {
            if (d.id === nodeId) {
                // Red pulsing effect
                d3.select(this).select('.node-circle')
                    .transition()
                    .duration(300)
                    .attr('fill', '#ef4444')
                    .attr('stroke', '#dc2626');

                // Disable connections
                d3.selectAll('.link').each(function(link) {
                    if (link.source.id === nodeId || link.target.id === nodeId) {
                        d3.select(this)
                            .transition()
                            .duration(300)
                            .attr('stroke', '#ef4444')
                            .attr('stroke-dasharray', '5,5')
                            .attr('opacity', 0.3);
                    }
                });

                // Restore after duration
                setTimeout(() => {
                    const nodeType = d.type;
                    d3.select(this).select('.node-circle')
                        .transition()
                        .duration(300)
                        .attr('fill', self.getNodeColor(nodeType))
                        .attr('stroke', '#3b82f6');

                    d3.selectAll('.link').each(function(link) {
                        if (link.source.id === nodeId || link.target.id === nodeId) {
                            d3.select(this)
                                .transition()
                                .duration(300)
                                .attr('stroke', '#475569')
                                .attr('stroke-dasharray', 'none')
                                .attr('opacity', 0.6);
                        }
                    });
                }, duration);
            }
        });
    }

    showRoute(sourceId, targetId, intermediateIds = []) {
        const path = [sourceId, ...intermediateIds, targetId];
        let index = 0;

        const animateSegment = () => {
            if (index < path.length - 1) {
                this.sendPacket(path[index], path[index + 1], () => {
                    index++;
                    setTimeout(animateSegment, 300);
                });
            }
        };

        animateSegment();
    }

    toggleLabels(show) {
        this.showLabels = show;
        this.labelGroup.selectAll('.node-label')
            .transition()
            .duration(300)
            .attr('opacity', show ? 1 : 0);
    }

    togglePackets(show) {
        this.showPackets = show;
    }

    toggleLatency(show) {
        this.showLatency = show;
        this.labelGroup.selectAll('.latency-label')
            .transition()
            .duration(300)
            .attr('opacity', show ? 0.8 : 0);
    }

    addDevice(deviceData) {
        // Scale position
        const scaleFactor = Math.min(this.width / 800, this.height / 600);
        const offsetX = (this.width - 800 * scaleFactor) / 2;
        const offsetY = (this.height - 600 * scaleFactor) / 2;

        const newNode = {
            ...deviceData,
            x: deviceData.x * scaleFactor + offsetX,
            y: deviceData.y * scaleFactor + offsetY,
            originalX: deviceData.x,
            originalY: deviceData.y
        };

        this.nodes.push(newNode);

        // Render the new node
        const nodeGroup = this.nodeGroup
            .append('g')
            .attr('class', 'node')
            .attr('transform', `translate(${newNode.x}, ${newNode.y})`)
            .attr('opacity', 0)
            .style('cursor', 'pointer');

        nodeGroup.append('circle')
            .attr('class', 'node-circle')
            .attr('r', this.getNodeRadius(newNode.type))
            .attr('fill', this.getNodeColor(newNode.type))
            .attr('stroke', '#3b82f6')
            .attr('stroke-width', 3);

        nodeGroup.append('text')
            .attr('class', 'node-icon')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('font-size', this.getNodeRadius(newNode.type) * 1.2)
            .text(newNode.icon || '🔘');

        nodeGroup.transition()
            .duration(600)
            .attr('opacity', 1);

        return newNode;
    }

    removeDevice(nodeId) {
        // Remove from nodes array
        this.nodes = this.nodes.filter(n => n.id !== nodeId);

        // Remove from visualization
        this.nodeElements.each(function(d) {
            if (d.id === nodeId) {
                d3.select(this)
                    .transition()
                    .duration(400)
                    .attr('opacity', 0)
                    .remove();
            }
        });

        // Remove associated links
        this.links = this.links.filter(l => 
            l.source.id !== nodeId && l.target.id !== nodeId
        );

        // Remove link visualizations
        this.linkGroup.selectAll('.link').each(function(d) {
            if (d.source.id === nodeId || d.target.id === nodeId) {
                d3.select(this).remove();
            }
        });
    }

    getNodeAtPosition(x, y) {
        let foundNode = null;
        this.nodes.forEach(node => {
            const dx = node.x - x;
            const dy = node.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const radius = this.getNodeRadius(node.type);
            
            if (distance <= radius) {
                foundNode = node;
            }
        });
        return foundNode;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NetworkVisualizer;
}