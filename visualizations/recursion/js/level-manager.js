// Level Manager - Handles Basic, Moderate, and Deep learning modes
class LevelManager {
    constructor() {
        this.currentLevel = 'basic';
        this.levels = {
            basic: {
                name: 'Basic',
                description: 'Simple visualization for beginners',
                features: {
                    codeEditor: false,
                    stepExecution: false,
                    pauseExecution: false,
                    memoryDetails: false,
                    complexityAnalysis: false,
                    view3D: false,
                    timelineView: false,
                    editCode: false
                },
                examples: ['factorial', 'power'],
                defaultSpeed: 1200,
                maxInput: {
                    factorial: 6,
                    power: 6,
                    fibonacci: 5,
                    binary: 8,
                    tower: 3,
                    merge: 6
                },
                explanation: 'basic'
            },
            moderate: {
                name: 'Moderate',
                description: 'Intermediate concepts and algorithms',
                features: {
                    codeEditor: true,
                    stepExecution: true,
                    pauseExecution: true,
                    memoryDetails: true,
                    complexityAnalysis: true,
                    view3D: false,
                    timelineView: true,
                    editCode: false
                },
                examples: ['factorial', 'fibonacci', 'binary', 'power'],
                defaultSpeed: 1000,
                maxInput: {
                    factorial: 8,
                    power: 8,
                    fibonacci: 7,
                    binary: 12,
                    tower: 4,
                    merge: 8
                },
                explanation: 'moderate'
            },
            deep: {
                name: 'Deep',
                description: 'Complete analysis with all features',
                features: {
                    codeEditor: true,
                    stepExecution: true,
                    pauseExecution: true,
                    memoryDetails: true,
                    complexityAnalysis: true,
                    view3D: true,
                    timelineView: true,
                    editCode: true
                },
                examples: ['factorial', 'fibonacci', 'tower', 'binary', 'merge', 'power'],
                defaultSpeed: 800,
                maxInput: {
                    factorial: 12,
                    power: 10,
                    fibonacci: 10,
                    binary: 15,
                    tower: 6,
                    merge: 12
                },
                explanation: 'deep'
            }
        };
        
        this.init();
    }
    
    init() {
        // Setup level selector buttons
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = e.currentTarget.dataset.level;
                this.switchLevel(level);
            });
        });
        
        // Set initial level
        this.switchLevel('basic');
    }
    
    switchLevel(levelName) {
        if (!this.levels[levelName]) {
            console.error(`Invalid level: ${levelName}`);
            return;
        }
        
        const oldLevel = this.currentLevel;
        this.currentLevel = levelName;
        const level = this.levels[levelName];
        
        // Update UI
        this.updateLevelButtons();
        this.updateContainerLevel();
        this.updateExampleAvailability();
        this.updateSpeedSlider(level.defaultSpeed);
        this.updateExplanation();
        this.updateTitle();
        
        // Log level change
        this.logLevelChange(oldLevel, levelName);
        
        // Show level-specific welcome message
        this.showWelcomeMessage(levelName);
        
        // Reset current visualization
        if (window.recursionEngine) {
            window.recursionEngine.reset();
        }
    }
    
    updateLevelButtons() {
        document.querySelectorAll('.level-btn').forEach(btn => {
            if (btn.dataset.level === this.currentLevel) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    updateContainerLevel() {
        const container = document.querySelector('.container');
        if (container) {
            container.setAttribute('data-level', this.currentLevel);
        }
    }
    
    updateExampleAvailability() {
        const level = this.levels[this.currentLevel];
        const exampleBtns = document.querySelectorAll('.example-btn');
        
        exampleBtns.forEach(btn => {
            const exampleName = btn.dataset.example;
            if (level.examples.includes(exampleName)) {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
                btn.disabled = false;
            } else {
                btn.style.opacity = '0.4';
                btn.style.pointerEvents = 'none';
                btn.disabled = true;
            }
        });
        
        // Auto-select first available example
        const firstAvailable = Array.from(exampleBtns).find(btn => 
            level.examples.includes(btn.dataset.example)
        );
        
        if (firstAvailable && window.recursionEngine) {
            firstAvailable.click();
        }
    }
    
    updateSpeedSlider(defaultSpeed) {
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        
        if (speedSlider && speedValue) {
            speedSlider.value = defaultSpeed;
            speedValue.textContent = `${defaultSpeed}ms`;
            
            if (window.recursionEngine) {
                window.recursionEngine.animationSpeed = defaultSpeed;
                window.recursionEngine.updateVisualizerSpeeds();
            }
        }
    }
    
    updateExplanation() {
        const level = this.levels[this.currentLevel];
        const explanationDiv = document.querySelector('.explanation-content');
        
        if (!explanationDiv) return;
        
        const explanations = {
            basic: `
                <h3>Welcome to Basic Mode! 🌱</h3>
                <p>This mode is perfect for beginners. We'll show you how recursion works with simple, visual examples.</p>
                
                <h3>What You'll Learn:</h3>
                <ul>
                    <li><strong>How functions call themselves</strong></li>
                    <li><strong>When recursion stops (Base Case)</strong></li>
                    <li><strong>How results build up (Recursive Case)</strong></li>
                </ul>
                
                <h3>Try This:</h3>
                <p>1. Click "Run" to see the animation<br>
                2. Watch how each function call appears<br>
                3. See how results flow back</p>
            `,
            moderate: `
                <h3>Welcome to Moderate Mode! 🌿</h3>
                <p>Ready to dive deeper? This mode introduces intermediate concepts and algorithms.</p>
                
                <h3>What You'll Learn:</h3>
                <ul>
                    <li><strong>Base Case:</strong> Condition that stops recursion</li>
                    <li><strong>Recursive Case:</strong> Function calling itself</li>
                    <li><strong>Call Stack:</strong> How function calls stack up</li>
                    <li><strong>Performance:</strong> Time and space complexity</li>
                </ul>
                
                <h3>New Features:</h3>
                <p>• View the actual C code<br>
                • See memory stack details<br>
                • Analyze complexity<br>
                • Pause and step through execution</p>
            `,
            deep: `
                <h3>Welcome to Deep Mode! 🌳</h3>
                <p>Experience the complete analysis with all advanced features enabled.</p>
                
                <h3>Advanced Concepts:</h3>
                <ul>
                    <li><strong>Base Case:</strong> The condition that stops recursion</li>
                    <li><strong>Recursive Case:</strong> The function calling itself</li>
                    <li><strong>Call Stack:</strong> Memory structure storing function calls</li>
                    <li><strong>Stack Frame:</strong> Memory allocated for each function call</li>
                    <li><strong>Memory Management:</strong> Understanding stack allocation</li>
                    <li><strong>Complexity Analysis:</strong> Big-O notation and performance</li>
                </ul>
                
                <h3>All Features Unlocked:</h3>
                <p>• 3D stack visualization<br>
                • Timeline analysis<br>
                • Edit and customize code<br>
                • Complete memory breakdown<br>
                • Advanced algorithms</p>
            `
        };
        
        explanationDiv.innerHTML = explanations[level.explanation] || explanations.basic;
    }
    
    updateTitle() {
        const level = this.levels[this.currentLevel];
        const subtitle = document.querySelector('.subtitle');
        
        if (subtitle) {
            const subtitles = {
                basic: 'Learn Recursion Step by Step',
                moderate: 'Understanding Recursive Algorithms',
                deep: 'Understanding Recursion Under The Hood'
            };
            
            subtitle.textContent = subtitles[this.currentLevel];
        }
    }
    
    showWelcomeMessage(levelName) {
        const messages = {
            basic: {
                title: '🌱 Welcome to Basic Mode!',
                message: 'Start with simple examples. Watch how functions call themselves and return values.',
                color: 'success'
            },
            moderate: {
                title: '🌿 Welcome to Moderate Mode!',
                message: 'Explore intermediate algorithms. Learn about complexity and performance.',
                color: 'info'
            },
            deep: {
                title: '🌳 Welcome to Deep Mode!',
                message: 'Full access to all features. Dive deep into memory, algorithms, and optimization.',
                color: 'info'
            }
        };
        
        const msg = messages[levelName];
        
        if (window.recursionEngine) {
            window.recursionEngine.logToConsole(`✨ ${msg.title}`, msg.color);
            window.recursionEngine.logToConsole(msg.message, msg.color);
        }
    }
    
    logLevelChange(oldLevel, newLevel) {
        console.log(`📊 Level changed: ${oldLevel} → ${newLevel}`);
        
        if (window.analytics) {
            window.analytics.trackLevelChange(oldLevel, newLevel);
        }
    }
    
    getMaxInput(exampleName) {
        const level = this.levels[this.currentLevel];
        return level.maxInput[exampleName] || 10;
    }
    
    isFeatureEnabled(featureName) {
        const level = this.levels[this.currentLevel];
        return level.features[featureName] || false;
    }
    
    getCurrentLevelInfo() {
        return {
            name: this.currentLevel,
            ...this.levels[this.currentLevel]
        };
    }
}

// Create global instance
window.levelManager = new LevelManager();