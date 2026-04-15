// Recursion Engine - Orchestrates all visualizations and execution
class RecursionEngine {
    constructor() {
        this.currentExample = 'factorial';
        this.currentCalls = [];
        this.currentResult = null;
        this.isRunning = false;
        this.isPaused = false;
        this.animationSpeed = 800;
        
        // Initialize visualizers
        this.stackViz = new StackVisualizer('callStack');
        this.treeViz = new TreeVisualizer('callTree');
        this.viz3D = new Stack3DVisualizer('stack3D');
        this.timelineViz = new TimelineVisualizer('timeline');
        
        this.init();
    }
    
    init() {
        this.loadExample(this.currentExample);
        this.setupEventListeners();
        this.updateComplexityInfo();
    }
    
    setupEventListeners() {
        // Example selection
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exampleName = e.target.dataset.example;
                this.selectExample(exampleName);
            });
        });
        
        // Execution controls
        document.getElementById('runBtn').addEventListener('click', () => this.run());
        document.getElementById('stepBtn').addEventListener('click', () => this.step());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        
        // Speed control
        const speedSlider = document.getElementById('speedSlider');
        speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            document.getElementById('speedValue').textContent = `${this.animationSpeed}ms`;
            this.updateVisualizerSpeeds();
        });
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Visualization options
        document.getElementById('showMemory').addEventListener('change', (e) => {
            this.toggleMemoryView(e.target.checked);
        });
        
        document.getElementById('show3D').addEventListener('change', (e) => {
            this.toggle3DView(e.target.checked);
        });
        
        // Code editing
        document.getElementById('editCodeBtn').addEventListener('click', () => this.enableCodeEdit());
        document.getElementById('saveCodeBtn').addEventListener('click', () => this.saveCode());
        document.getElementById('cancelCodeBtn').addEventListener('click', () => this.cancelCodeEdit());
        
        // Console clear
        document.getElementById('clearConsole').addEventListener('click', () => {
            document.getElementById('console').innerHTML = '';
        });
    }
    
    selectExample(exampleName) {
        // Update active button
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.example === exampleName) {
                btn.classList.add('active');
            }
        });
        
        this.currentExample = exampleName;
        this.loadExample(exampleName);
        this.reset();
    }
    
    loadExample(exampleName) {
        const example = RecursionExamples[exampleName];
        if (!example) return;
        
        // Update code display
        document.getElementById('codeDisplay').textContent = example.code;
        document.getElementById('codeEditor').value = example.code;
        
        // Highlight code
        Prism.highlightAll();
        
        // Update parameters
        this.updateParameterInputs(example.parameters);
        
        // Update explanation
        this.updateExplanation(example);
        
        // Update complexity
        this.updateComplexityInfo();
    }
    
    updateParameterInputs(parameters) {
        const container = document.getElementById('parameterInputs');
        container.innerHTML = '';
        
        parameters.forEach(param => {
            const group = document.createElement('div');
            group.className = 'param-group';
            
            const label = document.createElement('label');
            label.textContent = param.label;
            
            const input = document.createElement('input');
            input.type = param.type;
            input.name = param.name;
            input.value = param.default;
            
            // Apply level-specific max limits
            if (window.levelManager) {
                const maxForLevel = window.levelManager.getMaxInput(this.currentExample);
                input.max = Math.min(param.max, maxForLevel);
            } else {
                input.max = param.max;
            }
            
            input.min = param.min;
            input.id = `param-${param.name}`;
            
            // Add tooltip for level limits
            if (window.levelManager && window.levelManager.currentLevel !== 'deep') {
                const levelInfo = window.levelManager.getCurrentLevelInfo();
                input.title = `Max value for ${levelInfo.name} mode: ${input.max}`;
            }
            
            group.appendChild(label);
            group.appendChild(input);
            container.appendChild(group);
        });
    }
    
    updateExplanation(example) {
        const explanationDiv = document.getElementById('explanation');
        
        // Get current level
        const currentLevel = window.levelManager ? window.levelManager.currentLevel : 'deep';
        const explanationData = example.explanation[currentLevel] || example.explanation.deep || example.explanation;
        
        let html = `
            <div class="explanation-content">
                <h3>${example.name}</h3>
                <p>${example.description}</p>
        `;
        
        // Basic mode gets simplified explanation
        if (currentLevel === 'basic' && explanationData.simple) {
            html += `
                <h3>Simple Explanation:</h3>
                <p>${explanationData.simple}</p>
            `;
        }
        
        html += `
                <h3>How It Works:</h3>
                <ul>
                    <li><strong>Base Case:</strong> ${explanationData.baseCase}</li>
                    <li><strong>Recursive Case:</strong> ${explanationData.recursiveCase}</li>`;
        
        if (currentLevel !== 'basic') {
            html += `<li><strong>Purpose:</strong> ${explanationData.purpose}</li>`;
        }
        
        html += `</ul>`;
        
        // Show complexity only for moderate and deep
        if (currentLevel !== 'basic') {
            html += `
                <h3>Complexity:</h3>
                <ul>
                    <li><strong>Time:</strong> ${example.complexity.time}</li>
                    <li><strong>Space:</strong> ${example.complexity.space}</li>
                </ul>
            `;
        }
        
        html += '</div>';
        
        explanationDiv.innerHTML = html;
    }
    
    updateComplexityInfo() {
        const example = RecursionExamples[this.currentExample];
        if (!example) return;
        
        document.getElementById('timeComplexity').textContent = example.complexity.time;
        document.getElementById('spaceComplexity').textContent = example.complexity.space;
    }
    
    getParameterValues() {
        const example = RecursionExamples[this.currentExample];
        const values = [];
        
        example.parameters.forEach(param => {
            const input = document.getElementById(`param-${param.name}`);
            values.push(parseInt(input.value));
        });
        
        return values;
    }
    
    async run() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.updateControlButtons();
        
        // Get parameters
        const params = this.getParameterValues();
        
        // Execute the example
        const example = RecursionExamples[this.currentExample];
        const execution = example.execute(...params);
        
        this.currentCalls = execution.calls;
        this.currentResult = execution.result;
        
        // Log start
        this.logToConsole(`🚀 Starting ${example.name} with parameters: ${params.join(', ')}`, 'info');
        
        // Clear all visualizations
        this.clearAllVisualizations();
        
        // Run visualizations in parallel
        const vizPromises = [];
        
        if (document.getElementById('showCallTree').checked) {
            vizPromises.push(this.stackViz.visualize(this.currentCalls, this.animationSpeed));
        }
        
        if (document.getElementById('show3D').checked) {
            vizPromises.push(this.viz3D.visualize(this.currentCalls, this.animationSpeed));
        }
        
        vizPromises.push(this.treeViz.visualize(this.currentCalls, this.animationSpeed));
        vizPromises.push(this.timelineViz.visualize(this.currentCalls, this.animationSpeed));
        
        await Promise.all(vizPromises);
        
        // Log result
        this.logToConsole(`✅ Execution completed! Result: ${this.currentResult}`, 'success');
        
        if (execution.moves) {
            execution.moves.forEach(move => {
                this.logToConsole(move, 'info');
            });
        }
        
        this.isRunning = false;
        this.updateControlButtons();
    }
    
    async step() {
        // Implement single-step execution
        this.logToConsole('⏭️ Step execution not yet implemented', 'warning');
    }
    
    pause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.stackViz.pause();
            this.logToConsole('⏸️ Paused', 'warning');
        } else {
            this.stackViz.resume();
            this.logToConsole('▶️ Resumed', 'info');
        }
        
        this.updateControlButtons();
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentCalls = [];
        this.currentResult = null;
        
        this.clearAllVisualizations();
        this.updateControlButtons();
        
        // Reset stats
        document.getElementById('totalCalls').textContent = '0';
        document.getElementById('maxDepth').textContent = '0';
        document.getElementById('currentDepth').textContent = '0';
        document.getElementById('memoryUsed').textContent = '0 bytes';
        
        // Reset execution info
        document.getElementById('currentExecution').innerHTML = '<p>Click "Run" to start visualization</p>';
        
        this.logToConsole('🔄 Reset complete', 'info');
    }
    
    clearAllVisualizations() {
        this.stackViz.clear();
        this.treeViz.clear();
        this.viz3D.clear();
        this.timelineViz.clear();
    }
    
    updateControlButtons() {
        const runBtn = document.getElementById('runBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const stepBtn = document.getElementById('stepBtn');
        const resetBtn = document.getElementById('resetBtn');
        
        runBtn.disabled = this.isRunning;
        pauseBtn.disabled = !this.isRunning;
        stepBtn.disabled = this.isRunning;
        resetBtn.disabled = this.isRunning && !this.isPaused;
        
        if (this.isPaused) {
            pauseBtn.textContent = '▶️ Resume';
        } else {
            pauseBtn.textContent = '⏸️ Pause';
        }
    }
    
    updateVisualizerSpeeds() {
        this.stackViz.setAnimationSpeed(this.animationSpeed);
        this.treeViz.setAnimationSpeed(this.animationSpeed);
        this.viz3D.setAnimationSpeed(this.animationSpeed);
        this.timelineViz.setAnimationSpeed(this.animationSpeed);
    }
    
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const tabMap = {
            'stack': 'stackTab',
            'tree': 'treeTab',
            '3d': '3dTab',
            'timeline': 'timelineTab'
        };
        
        document.getElementById(tabMap[tabName]).classList.add('active');
    }
    
    toggleMemoryView(show) {
        const memoryDetail = document.getElementById('memoryDetail');
        if (memoryDetail) {
            memoryDetail.style.display = show ? 'block' : 'none';
        }
    }
    
    toggle3DView(show) {
        if (!show) {
            this.viz3D.clear();
        }
    }
    
    enableCodeEdit() {
        document.getElementById('codeDisplay').parentElement.style.display = 'none';
        document.getElementById('codeEditor').style.display = 'block';
        document.getElementById('codeControls').style.display = 'flex';
        document.getElementById('editCodeBtn').style.display = 'none';
    }
    
    saveCode() {
        const newCode = document.getElementById('codeEditor').value;
        document.getElementById('codeDisplay').textContent = newCode;
        Prism.highlightAll();
        
        this.cancelCodeEdit();
        this.logToConsole('💾 Code saved (Note: Execution logic not updated)', 'warning');
    }
    
    cancelCodeEdit() {
        document.getElementById('codeDisplay').parentElement.style.display = 'block';
        document.getElementById('codeEditor').style.display = 'none';
        document.getElementById('codeControls').style.display = 'none';
        document.getElementById('editCodeBtn').style.display = 'block';
    }
    
    logToConsole(message, type = 'info') {
        this.stackViz.logToConsole(message, type);
    }
}