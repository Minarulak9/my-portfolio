// Timeline Visualizer - GSAP and D3.js based execution timeline
class TimelineVisualizer {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        this.width = 0;
        this.height = 0;
        this.animationSpeed = 800;
        this.timeline = [];
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
            .attr('transform', 'translate(50, 50)');
        
        // Add placeholder
        this.placeholder = this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', '#94a3b8')
            .attr('font-size', '18px')
            .text('Click "Run" to visualize the execution timeline');
        
        // Timeline axis group
        this.axisGroup = this.g.append('g')
            .attr('class', 'timeline-axis');
        
        // Events group
        this.eventsGroup = this.g.append('g')
            .attr('class', 'timeline-events');
        
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
        this.timeline = [];
        this.g.selectAll('*').remove();
        this.axisGroup = this.g.append('g').attr('class', 'timeline-axis');
        this.eventsGroup = this.g.append('g').attr('class', 'timeline-events');
        
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
        
        // Build timeline from calls
        this.buildTimeline(calls);
        
        // Draw timeline
        await this.drawTimeline();
        
        // Animate events
        await this.animateEvents();
    }
    
    buildTimeline(calls) {
        let time = 0;
        const timelineEvents = [];
        const stackDepth = [];
        
        calls.forEach((call, index) => {
            const event = {
                id: call.id,
                type: call.type,
                time: time,
                depth: call.depth,
                params: call.params,
                return: call.return,
                isBase: call.isBase,
                stackSize: stackDepth.length
            };
            
            if (call.type === 'call') {
                stackDepth.push(call.id);
                event.action = 'push';
            } else if (call.type === 'return') {
                stackDepth.pop();
                event.action = 'pop';
            }
            
            timelineEvents.push(event);
            time += 1;
        });
        
        this.timeline = timelineEvents;
    }
    
    async drawTimeline() {
        const timeScale = d3.scaleLinear()
            .domain([0, this.timeline.length])
            .range([0, this.width - 100]);
        
        const depthScale = d3.scaleLinear()
            .domain([0, d3.max(this.timeline, d => d.stackSize) || 1])
            .range([0, this.height - 100]);
        
        // Draw time axis
        const timeAxis = d3.axisBottom(timeScale)
            .ticks(10)
            .tickFormat(d => `T${d}`);
        
        this.axisGroup.append('g')
            .attr('transform', `translate(0, ${this.height - 50})`)
            .call(timeAxis)
            .selectAll('text')
            .attr('fill', '#cbd5e1');
        
        this.axisGroup.selectAll('line, path')
            .attr('stroke', '#475569');
        
        // Draw depth axis
        const depthAxis = d3.axisLeft(depthScale)
            .ticks(5)
            .tickFormat(d => `Stack: ${d}`);
        
        this.axisGroup.append('g')
            .call(depthAxis)
            .selectAll('text')
            .attr('fill', '#cbd5e1');
        
        // Draw timeline path (stack size over time)
        const line = d3.line()
            .x((d, i) => timeScale(i))
            .y(d => this.height - 50 - depthScale(d.stackSize))
            .curve(d3.curveMonotoneX);
        
        const path = this.eventsGroup.append('path')
            .datum(this.timeline)
            .attr('class', 'timeline-path')
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', '#6366f1')
            .attr('stroke-width', 3)
            .attr('stroke-opacity', 0.6);
        
        // Animate path drawing
        const totalLength = path.node().getTotalLength();
        
        path.attr('stroke-dasharray', totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(this.animationSpeed * 2)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0);
        
        // Draw area under curve
        const area = d3.area()
            .x((d, i) => timeScale(i))
            .y0(this.height - 50)
            .y1(d => this.height - 50 - depthScale(d.stackSize))
            .curve(d3.curveMonotoneX);
        
        this.eventsGroup.append('path')
            .datum(this.timeline)
            .attr('class', 'timeline-area')
            .attr('d', area)
            .attr('fill', 'url(#timelineGradient)')
            .attr('opacity', 0)
            .transition()
            .duration(this.animationSpeed * 2)
            .attr('opacity', 0.3);
        
        this.addTimelineDefs();
    }
    
    async animateEvents() {
        const timeScale = d3.scaleLinear()
            .domain([0, this.timeline.length])
            .range([0, this.width - 100]);
        
        const depthScale = d3.scaleLinear()
            .domain([0, d3.max(this.timeline, d => d.stackSize) || 1])
            .range([0, this.height - 100]);
        
        // Draw event markers
        const events = this.eventsGroup.selectAll('.event-marker')
            .data(this.timeline)
            .enter()
            .append('g')
            .attr('class', 'event-marker')
            .attr('transform', (d, i) => 
                `translate(${timeScale(i)}, ${this.height - 50 - depthScale(d.stackSize)})`
            )
            .style('opacity', 0);
        
        // Add circles for events
        events.append('circle')
            .attr('r', 0)
            .attr('fill', d => this.getEventColor(d))
            .attr('stroke', d => d.isBase ? '#10b981' : '#818cf8')
            .attr('stroke-width', 2);
        
        // Add labels
        events.append('text')
            .attr('y', -15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#cbd5e1')
            .attr('font-size', '10px')
            .text(d => this.getEventLabel(d));
        
        // Animate events sequentially
        for (let i = 0; i < this.timeline.length; i++) {
            const event = d3.select(events.nodes()[i]);
            
            // Animate appearance with GSAP
            gsap.to(event.node(), {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(event.select('circle').node(), {
                attr: { r: 6 },
                duration: 0.3,
                ease: 'elastic.out(1, 0.5)'
            });
            
            await this.delay(this.animationSpeed / 10);
        }
        
        // Add connecting lines between call and return
        this.drawConnections(events, timeScale, depthScale);
    }
    
    drawConnections(events, timeScale, depthScale) {
        const callReturns = new Map();
        
        // Map calls to their returns
        this.timeline.forEach((event, index) => {
            if (event.type === 'call') {
                const returnIndex = this.timeline.findIndex((e, i) => 
                    i > index && e.type === 'return' && e.id === event.id
                );
                if (returnIndex !== -1) {
                    callReturns.set(index, returnIndex);
                }
            }
        });
        
        // Draw arcs
        callReturns.forEach((returnIdx, callIdx) => {
            const callEvent = this.timeline[callIdx];
            const returnEvent = this.timeline[returnIdx];
            
            const x1 = timeScale(callIdx);
            const y1 = this.height - 50 - depthScale(callEvent.stackSize);
            const x2 = timeScale(returnIdx);
            const y2 = this.height - 50 - depthScale(returnEvent.stackSize);
            
            const path = this.eventsGroup.append('path')
                .attr('d', this.createArc(x1, y1, x2, y2))
                .attr('fill', 'none')
                .attr('stroke', '#ec4899')
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '4,4')
                .attr('opacity', 0);
            
            // Animate connection
            gsap.to(path.node(), {
                opacity: 0.4,
                duration: 0.5,
                delay: (returnIdx - callIdx) * this.animationSpeed / 10000
            });
        });
    }
    
    createArc(x1, y1, x2, y2) {
        const midX = (x1 + x2) / 2;
        const midY = Math.min(y1, y2) - 30;
        
        return `M ${x1},${y1} Q ${midX},${midY} ${x2},${y2}`;
    }
    
    getEventColor(event) {
        if (event.type === 'call') {
            return event.isBase ? '#10b981' : '#6366f1';
        } else {
            return '#ec4899';
        }
    }
    
    getEventLabel(event) {
        if (event.type === 'call') {
            const params = Object.values(event.params).join(',');
            return `(${params})`;
        } else {
            return event.return !== undefined ? `${event.return}` : '✓';
        }
    }
    
    addTimelineDefs() {
        if (this.svg.select('defs').empty()) {
            const defs = this.svg.append('defs');
            
            // Timeline gradient
            const gradient = defs.append('linearGradient')
                .attr('id', 'timelineGradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '0%')
                .attr('y2', '100%');
            
            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', '#6366f1')
                .attr('stop-opacity', 0.6);
            
            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', '#ec4899')
                .attr('stop-opacity', 0.1);
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Timeline analytics and insights
class TimelineAnalyzer {
    constructor(timeline) {
        this.timeline = timeline;
    }
    
    getMaxStackDepth() {
        return d3.max(this.timeline, d => d.stackSize) || 0;
    }
    
    getAverageStackDepth() {
        const sum = d3.sum(this.timeline, d => d.stackSize);
        return sum / this.timeline.length;
    }
    
    getTotalExecutionTime() {
        return this.timeline.length;
    }
    
    getCallReturnPairs() {
        const pairs = [];
        const callStack = [];
        
        this.timeline.forEach((event, index) => {
            if (event.type === 'call') {
                callStack.push({ event, index });
            } else if (event.type === 'return' && callStack.length > 0) {
                const call = callStack.pop();
                pairs.push({
                    callIndex: call.index,
                    returnIndex: index,
                    duration: index - call.index,
                    depth: event.depth
                });
            }
        });
        
        return pairs;
    }
    
    getInsights() {
        return {
            maxDepth: this.getMaxStackDepth(),
            avgDepth: this.getAverageStackDepth().toFixed(2),
            totalTime: this.getTotalExecutionTime(),
            pairs: this.getCallReturnPairs().length
        };
    }
}