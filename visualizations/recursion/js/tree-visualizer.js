// Tree Visualizer - D3.js based recursive call tree visualization
class TreeVisualizer {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        this.width = 0;
        this.height = 0;
        this.root = null;
        this.animationSpeed = 800;
        this.init();
    }
    
    init() {
        this.container.html('');
        const containerNode = this.container.node();
        this.width = containerNode.clientWidth || 800;
        this.height = containerNode.clientHeight || 600;
        
        this.svg = this.container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('background', 'transparent')
            .style('display', 'block');
        
        this.g = this.svg.append('g')
            .attr('transform', `translate(${this.width / 2}, 50)`);
        
        // Add placeholder
        this.placeholder = this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', '#94a3b8')
            .attr('font-size', '18px')
            .text('Click "Run" to visualize the call tree');
        
        // Add zoom capability
        const zoom = d3.zoom()
            .scaleExtent([0.5, 3])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });
        
        this.svg.call(zoom);
        
        // Add window resize handler
        window.addEventListener('resize', () => this.handleResize());
    }
    
    handleResize() {
        const containerNode = this.container.node();
        if (!containerNode) return;
        
        this.width = containerNode.clientWidth || 800;
        this.height = containerNode.clientHeight || 600;
        
        this.svg
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('viewBox', `0 0 ${this.width} ${this.height}`);
    }
    
    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
    }
    
    clear() {
        this.g.selectAll('*').remove();
        this.root = null;
        
        // Show placeholder
        if (this.placeholder) {
            this.placeholder.style('opacity', 1);
        }
    }
    
    async visualize(calls, speed) {
        this.animationSpeed = speed;
        this.clear();
        
        // Hide placeholder
        if (this.placeholder) {
            this.placeholder.style('opacity', 0);
        }
        
        // Build tree structure from calls
        const treeData = this.buildTree(calls);
        if (!treeData) return;
        
        // Create D3 hierarchy
        this.root = d3.hierarchy(treeData);
        
        // Create tree layout
        const treeLayout = d3.tree()
            .size([this.width - 200, this.height - 200])
            .separation((a, b) => (a.parent === b.parent ? 1 : 1.2));
        
        treeLayout(this.root);
        
        // Adjust positions to center
        this.root.descendants().forEach(d => {
            d.y = d.depth * 120;
        });
        
        await this.drawTree();
    }
    
    buildTree(calls) {
        if (calls.length === 0) return null;
        
        const callMap = new Map();
        const rootCalls = [];
        
        // Filter only 'call' type entries and create map
        const callEntries = calls.filter(c => c.type === 'call');
        
        callEntries.forEach(call => {
            const node = {
                id: call.id,
                params: call.params,
                depth: call.depth,
                isBase: call.isBase,
                return: call.return,
                children: []
            };
            callMap.set(call.id, node);
        });
        
        // Build tree structure
        callEntries.forEach(call => {
            const node = callMap.get(call.id);
            if (call.parentId !== null && callMap.has(call.parentId)) {
                const parent = callMap.get(call.parentId);
                parent.children.push(node);
            } else {
                rootCalls.push(node);
            }
        });
        
        // Get return values from return entries
        calls.filter(c => c.type === 'return').forEach(ret => {
            if (callMap.has(ret.id)) {
                callMap.get(ret.id).return = ret.return;
            }
        });
        
        return rootCalls.length > 0 ? rootCalls[0] : null;
    }
    
    async drawTree() {
        // Draw links
        const links = this.g.selectAll('.link')
            .data(this.root.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y)
            )
            .attr('fill', 'none')
            .attr('stroke', '#6366f1')
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0)
            .transition()
            .duration(this.animationSpeed)
            .attr('stroke-opacity', 0.6);
        
        // Draw nodes
        const nodes = this.g.selectAll('.node')
            .data(this.root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .style('opacity', 0);
        
        // Add circles
        nodes.append('circle')
            .attr('r', 0)
            .attr('fill', d => this.getNodeColor(d))
            .attr('stroke', d => d.data.isBase ? '#10b981' : '#6366f1')
            .attr('stroke-width', d => d.data.isBase ? 4 : 2)
            .transition()
            .duration(this.animationSpeed)
            .attr('r', 30);
        
        // Add parameter text
        nodes.append('text')
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .text(d => this.getNodeLabel(d));
        
        // Add return value below
        nodes.append('text')
            .attr('dy', '50')
            .attr('text-anchor', 'middle')
            .attr('fill', '#10b981')
            .attr('font-size', '11px')
            .attr('font-weight', 'bold')
            .text(d => d.data.return !== undefined ? `→ ${d.data.return}` : '');
        
        // Add depth indicator
        nodes.append('text')
            .attr('dy', '-40')
            .attr('text-anchor', 'middle')
            .attr('fill', '#cbd5e1')
            .attr('font-size', '10px')
            .text(d => `D:${d.data.depth}`);
        
        // Animate nodes
        nodes.transition()
            .duration(this.animationSpeed)
            .style('opacity', 1);
        
        // Add glow effect to base case nodes
        nodes.filter(d => d.data.isBase)
            .append('circle')
            .attr('r', 35)
            .attr('fill', 'none')
            .attr('stroke', '#10b981')
            .attr('stroke-width', 2)
            .style('filter', 'url(#treeGlow)')
            .style('opacity', 0)
            .transition()
            .duration(this.animationSpeed)
            .style('opacity', 0.6);
        
        this.addTreeDefs();
    }
    
    getNodeColor(node) {
        if (node.data.isBase) {
            return '#10b981';
        }
        const colorScale = d3.scaleLinear()
            .domain([0, this.root.height])
            .range(['#6366f1', '#ec4899']);
        return colorScale(node.depth);
    }
    
    getNodeLabel(node) {
        const params = node.data.params;
        const values = Object.values(params);
        return values.length > 0 ? values.join(',') : '()';
    }
    
    addTreeDefs() {
        if (this.svg.select('defs').empty()) {
            const defs = this.svg.append('defs');
            
            // Tree glow filter
            const filter = defs.append('filter')
                .attr('id', 'treeGlow')
                .attr('x', '-100%')
                .attr('y', '-100%')
                .attr('width', '300%')
                .attr('height', '300%');
            
            filter.append('feGaussianBlur')
                .attr('stdDeviation', '4')
                .attr('result', 'coloredBlur');
            
            const feMerge = filter.append('feMerge');
            feMerge.append('feMergeNode').attr('in', 'coloredBlur');
            feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
        }
    }
}

// Additional tree utilities for complex visualizations
class TreeAnimator {
    constructor(treeVisualizer) {
        this.treeViz = treeVisualizer;
    }
    
    async animateTraversal(order = 'preorder') {
        // Animate tree traversal in different orders
        const nodes = this.treeViz.root.descendants();
        
        for (const node of this.getTraversalOrder(nodes, order)) {
            await this.highlightNode(node);
            await this.delay(this.treeViz.animationSpeed / 2);
        }
    }
    
    getTraversalOrder(nodes, order) {
        switch (order) {
            case 'preorder':
                return nodes; // Default D3 order is preorder
            case 'postorder':
                return nodes.reverse();
            case 'levelorder':
                return nodes.sort((a, b) => a.depth - b.depth);
            default:
                return nodes;
        }
    }
    
    async highlightNode(node) {
        const nodeElement = this.treeViz.g.selectAll('.node')
            .filter(d => d.data.id === node.data.id);
        
        nodeElement.select('circle')
            .transition()
            .duration(200)
            .attr('r', 35)
            .attr('stroke-width', 4)
            .transition()
            .duration(200)
            .attr('r', 30)
            .attr('stroke-width', 2);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}