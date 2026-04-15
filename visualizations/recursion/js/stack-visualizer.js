// Stack Visualizer - D3.js based call stack visualization
class StackVisualizer {
    constructor(containerId) {
        this.container = d3.select(`#${containerId}`);
        this.frames = [];
        this.animationSpeed = 800;
        this.isPaused = false;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.init();
    }
    
    init() {
        this.container.html('');
        
        // Get container dimensions
        const containerNode = this.container.node();
        const width = containerNode.clientWidth || 800;
        const height = containerNode.clientHeight || 600;
        
        this.svg = this.container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('background', 'transparent')
            .style('display', 'block');
            
        this.stackGroup = this.svg.append('g')
            .attr('class', 'stack-group')
            .attr('transform', 'translate(50, 50)');
        
        // Add placeholder text
        this.placeholder = this.svg.append('text')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', '#94a3b8')
            .attr('font-size', '18px')
            .text('Click "Run" to visualize the call stack');
        
        // Add window resize handler
        window.addEventListener('resize', () => this.handleResize());
    }
    
    handleResize() {
        const containerNode = this.container.node();
        if (!containerNode) return;
        
        const width = containerNode.clientWidth || 800;
        const height = containerNode.clientHeight || 600;
        
        this.svg
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`);
    }
    
    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
    }
    
    clear() {
        this.frames = [];
        this.currentStep = 0;
        this.totalSteps = 0;
        this.stackGroup.selectAll('*').remove();
        
        // Show placeholder again
        if (this.placeholder) {
            this.placeholder.style('opacity', 1);
        }
    }
    
    async visualize(calls, speed) {
        this.animationSpeed = speed;
        this.totalSteps = calls.length;
        
        // Hide placeholder
        if (this.placeholder) {
            this.placeholder.style('opacity', 0);
        }
        
        for (let i = 0; i < calls.length; i++) {
            if (this.isPaused) {
                await new Promise(resolve => {
                    const checkPause = setInterval(() => {
                        if (!this.isPaused) {
                            clearInterval(checkPause);
                            resolve();
                        }
                    }, 100);
                });
            }
            
            this.currentStep = i;
            const call = calls[i];
            
            if (call.type === 'call') {
                await this.pushFrame(call);
                this.logToConsole(`📞 Call: ${this.getCallSignature(call)}`, 'info');
            } else if (call.type === 'return') {
                await this.popFrame(call);
                this.logToConsole(`↩️ Return: ${call.return}`, 'success');
            }
            
            this.updateStats();
            await this.delay(this.animationSpeed);
        }
        
        this.logToConsole('✅ Execution completed!', 'success');
    }
    
    async pushFrame(call) {
        this.frames.push(call);
        await this.renderStack();
        
        // Update current execution info
        this.updateExecutionInfo(call, 'calling');
    }
    
    async popFrame(call) {
        const frameIndex = this.frames.findIndex(f => f.id === call.id);
        if (frameIndex !== -1) {
            this.frames.splice(frameIndex, 1);
        }
        await this.renderStack();
        
        // Update current execution info
        this.updateExecutionInfo(call, 'returning');
    }
    
    async renderStack() {
        const frameHeight = 100;
        const frameWidth = 400;
        const spacing = 10;
        
        // Calculate total height needed
        const totalHeight = this.frames.length * (frameHeight + spacing) + 100;
        this.svg.attr('height', Math.max(600, totalHeight));
        
        // Bind data
        const frameElements = this.stackGroup.selectAll('.stack-frame')
            .data(this.frames, d => d.id);
        
        // Enter
        const frameEnter = frameElements.enter()
            .append('g')
            .attr('class', 'stack-frame')
            .attr('transform', (d, i) => {
                const y = (this.frames.length - i - 1) * (frameHeight + spacing);
                return `translate(0, ${y + 200})`;
            })
            .style('opacity', 0);
        
        // Frame background
        frameEnter.append('rect')
            .attr('class', 'frame-bg')
            .attr('width', frameWidth)
            .attr('height', frameHeight)
            .attr('rx', 10)
            .attr('fill', (d, i) => {
                const isActive = i === this.frames.length - 1;
                return isActive ? 
                    'url(#activeGradient)' : 
                    'url(#frameGradient)';
            })
            .attr('stroke', '#6366f1')
            .attr('stroke-width', 2);
        
        // Frame header
        frameEnter.append('rect')
            .attr('class', 'frame-header')
            .attr('width', frameWidth)
            .attr('height', 30)
            .attr('rx', 10)
            .attr('fill', 'rgba(99, 102, 241, 0.3)');
        
        // Depth badge
        frameEnter.append('circle')
            .attr('cx', frameWidth - 30)
            .attr('cy', 15)
            .attr('r', 15)
            .attr('fill', '#6366f1');
        
        frameEnter.append('text')
            .attr('x', frameWidth - 30)
            .attr('y', 15)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .text(d => d.depth);
        
        // Function name
        frameEnter.append('text')
            .attr('class', 'frame-title')
            .attr('x', 15)
            .attr('y', 15)
            .attr('dy', '0.35em')
            .attr('fill', '#f1f5f9')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text(d => this.getFunctionName(d));
        
        // Parameters
        frameEnter.append('text')
            .attr('class', 'frame-params')
            .attr('x', 15)
            .attr('y', 50)
            .attr('fill', '#cbd5e1')
            .attr('font-size', '12px')
            .text(d => this.getParamsText(d));
        
        // Return value (if available)
        frameEnter.append('text')
            .attr('class', 'frame-return')
            .attr('x', 15)
            .attr('y', 75)
            .attr('fill', '#10b981')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .text(d => d.return !== undefined ? `↩️ Returns: ${d.return}` : '');
        
        // Add glow effect for active frame
        frameEnter.filter((d, i) => i === this.frames.length - 1)
            .append('rect')
            .attr('class', 'frame-glow')
            .attr('width', frameWidth)
            .attr('height', frameHeight)
            .attr('rx', 10)
            .attr('fill', 'none')
            .attr('stroke', '#818cf8')
            .attr('stroke-width', 3)
            .style('filter', 'url(#glow)');
        
        // Animate enter
        frameEnter.transition()
            .duration(this.animationSpeed / 2)
            .attr('transform', (d, i) => {
                const y = (this.frames.length - i - 1) * (frameHeight + spacing);
                return `translate(0, ${y})`;
            })
            .style('opacity', 1);
        
        // Update
        frameElements.transition()
            .duration(this.animationSpeed / 2)
            .attr('transform', (d, i) => {
                const y = (this.frames.length - i - 1) * (frameHeight + spacing);
                return `translate(0, ${y})`;
            });
        
        // Update return values
        frameElements.select('.frame-return')
            .text(d => d.return !== undefined ? `↩️ Returns: ${d.return}` : '');
        
        // Exit
        frameElements.exit()
            .transition()
            .duration(this.animationSpeed / 2)
            .style('opacity', 0)
            .attr('transform', `translate(0, ${-frameHeight})`)
            .remove();
        
        // Add gradients and filters if not exist
        this.addDefs();
    }
    
    addDefs() {
        if (this.svg.select('defs').empty()) {
            const defs = this.svg.append('defs');
            
            // Frame gradient
            const frameGradient = defs.append('linearGradient')
                .attr('id', 'frameGradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '100%');
            
            frameGradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', 'rgba(99, 102, 241, 0.2)');
            
            frameGradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', 'rgba(236, 72, 153, 0.2)');
            
            // Active gradient
            const activeGradient = defs.append('linearGradient')
                .attr('id', 'activeGradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '100%');
            
            activeGradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', 'rgba(99, 102, 241, 0.4)');
            
            activeGradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', 'rgba(236, 72, 153, 0.4)');
            
            // Glow filter
            const filter = defs.append('filter')
                .attr('id', 'glow')
                .attr('x', '-50%')
                .attr('y', '-50%')
                .attr('width', '200%')
                .attr('height', '200%');
            
            filter.append('feGaussianBlur')
                .attr('stdDeviation', '3')
                .attr('result', 'coloredBlur');
            
            const feMerge = filter.append('feMerge');
            feMerge.append('feMergeNode').attr('in', 'coloredBlur');
            feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
        }
    }
    
    getFunctionName(call) {
        return Object.keys(call.params)[0] ? 
            `function(${Object.keys(call.params).join(', ')})` : 
            'function()';
    }
    
    getParamsText(call) {
        return Object.entries(call.params)
            .map(([key, value]) => `${key} = ${value}`)
            .join(', ');
    }
    
    getCallSignature(call) {
        const params = Object.entries(call.params)
            .map(([key, value]) => `${key}=${value}`)
            .join(', ');
        return `depth=${call.depth}(${params})`;
    }
    
    updateExecutionInfo(call, action) {
        const infoDiv = document.getElementById('currentExecution');
        const signature = this.getCallSignature(call);
        
        let html = `
            <div class="exec-detail">
                <p><strong>Action:</strong> <span class="highlight">${action}</span></p>
                <p><strong>Call:</strong> ${signature}</p>
                <p><strong>Depth:</strong> ${call.depth}</p>
        `;
        
        if (call.isBase) {
            html += `<p><strong>Status:</strong> <span style="color: #10b981;">Base Case Reached ✓</span></p>`;
        }
        
        if (call.return !== undefined) {
            html += `<p><strong>Return Value:</strong> <span style="color: #10b981;">${call.return}</span></p>`;
        }
        
        html += '</div>';
        infoDiv.innerHTML = html;
    }
    
    updateStats() {
        document.getElementById('totalCalls').textContent = Math.ceil(this.totalSteps / 2);
        document.getElementById('currentDepth').textContent = this.frames.length;
        
        const maxDepth = this.frames.length > 0 ? 
            Math.max(...this.frames.map(f => f.depth)) : 0;
        document.getElementById('maxDepth').textContent = maxDepth;
        
        // Estimate memory (rough calculation)
        const bytesPerFrame = 64; // Approximate
        const memoryUsed = this.frames.length * bytesPerFrame;
        document.getElementById('memoryUsed').textContent = `${memoryUsed} bytes`;
        
        this.updateMemoryDetail();
    }
    
    updateMemoryDetail() {
        const memoryDiv = document.getElementById('memoryDetail');
        if (!memoryDiv) return;
        
        let html = '';
        this.frames.forEach((frame, index) => {
            const address = `0x${(1000 + index * 64).toString(16).toUpperCase()}`;
            html += `
                <div class="memory-block">
                    <div class="memory-address">Frame ${index} @ ${address}</div>
                    <div class="memory-content">
                        Depth: ${frame.depth}<br>
                        Params: ${this.getParamsText(frame)}<br>
                        ${frame.return !== undefined ? `Return: ${frame.return}` : 'Pending...'}
                    </div>
                </div>
            `;
        });
        
        memoryDiv.innerHTML = html || '<p style="color: #94a3b8;">Stack is empty</p>';
    }
    
    logToConsole(message, type = 'info') {
        const consoleDiv = document.getElementById('console');
        if (!consoleDiv) return;
        
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        consoleDiv.appendChild(line);
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}