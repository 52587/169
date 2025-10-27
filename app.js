// Main Application
class SonicEchoChamber {
    constructor() {
        this.audioEngine = new AudioEngine();
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d');
        this.currentVisualization = null;
        this.currentMode = 'particles';
        this.sensitivity = 1.5;
        this.colorScheme = 'ethereal';
        this.isRunning = false;
        this.animationId = null;

        this.init();
    }

    async init() {
        // Set up canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Initialize audio engine
        await this.audioEngine.initialize();

        // Load audio devices
        await this.loadAudioDevices();

        // Set up UI event listeners
        this.setupEventListeners();

        // Initialize first visualization
        this.switchVisualization('particles');

        // Show instructions
        this.showInstructions();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    async loadAudioDevices(autoSelectDefault = false) {
        const devices = await this.audioEngine.getDevices();
        const select = document.getElementById('audioDevice');

        console.log('Loading audio devices, found:', devices.length);

        // Clear existing options except first
        select.innerHTML = '<option value="">Select Microphone...</option>';
        select.innerHTML += '<option value="demo">🎵 Demo Mode (Test Without Mic)</option>';

        if (devices.length === 0) {
            console.warn('No audio input devices detected');
            select.innerHTML += '<option value="" disabled>No microphone detected - try Demo Mode</option>';
            return null;
        }

        devices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.textContent = device.label || `Microphone ${select.options.length - 1}`;
            select.appendChild(option);
            console.log('Added device:', device.label, device.deviceId);
        });

        // Auto-select the default device if requested
        if (autoSelectDefault && devices.length > 0) {
            // Try to find the device marked as "default" first
            const defaultDevice = devices.find(d => d.deviceId === 'default');
            if (defaultDevice) {
                select.value = 'default';
                console.log('Auto-selected default device');
                return 'default';
            } else {
                // Otherwise select the first device
                select.value = devices[0].deviceId;
                console.log('Auto-selected first device:', devices[0].label);
                return devices[0].deviceId;
            }
        }

        // If only one device, select it automatically
        if (devices.length === 1) {
            select.value = devices[0].deviceId;
            console.log('Auto-selected the only device');
            return devices[0].deviceId;
        }

        return null;
    }

    setupEventListeners() {
        // Start button
        document.getElementById('startBtn').addEventListener('click', () => {
            this.toggleAudio();
        });

        // Fullscreen button
        document.getElementById('fullscreenBtn').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.switchVisualization(e.target.dataset.mode);
            });
        });

        // Sensitivity slider
        const sensitivitySlider = document.getElementById('sensitivity');
        const sensitivityValue = document.getElementById('sensitivityValue');
        sensitivitySlider.addEventListener('input', (e) => {
            this.sensitivity = parseFloat(e.target.value);
            sensitivityValue.textContent = this.sensitivity.toFixed(1);
        });

        // Color scheme selector
        document.getElementById('colorScheme').addEventListener('change', (e) => {
            this.colorScheme = e.target.value;
            if (this.currentVisualization) {
                this.currentVisualization.setColorScheme(this.colorScheme);
            }
        });

        // Audio device selector
        document.getElementById('audioDevice').addEventListener('change', async (e) => {
            if (this.isRunning && e.target.value) {
                await this.audioEngine.startMicrophone(e.target.value);
            }
        });

        // Close instructions
        document.getElementById('closeInstructions').addEventListener('click', () => {
            this.hideInstructions();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'f' || e.key === 'F') {
                this.toggleFullscreen();
            } else if (e.key === 'Escape') {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            } else if (e.key === ' ') {
                e.preventDefault();
                this.toggleAudio();
            }
        });
    }

    switchVisualization(mode) {
        this.currentMode = mode;

        switch (mode) {
            case 'particles':
                this.currentVisualization = new ParticleVisualization(this.canvas, this.colorScheme);
                break;
            case 'waveform':
                this.currentVisualization = new WaveformVisualization(this.canvas, this.colorScheme);
                break;
            case 'ripples':
                this.currentVisualization = new RippleVisualization(this.canvas, this.colorScheme);
                break;
        }

        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    async toggleAudio() {
        const startBtn = document.getElementById('startBtn');
        const deviceSelect = document.getElementById('audioDevice');

        if (!this.isRunning) {
            // Request microphone permission first (this will also populate devices if not done yet)
            try {
                let deviceId = deviceSelect.value;
                
                // If no device selected, request default and then reload devices
                if (!deviceId || deviceId === '') {
                    console.log('No device selected, requesting permission...');
                    
                    try {
                        // Request permission with default device
                        const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        console.log('Got temporary stream, stopping it...');
                        tempStream.getTracks().forEach(track => {
                            console.log('Track:', track.label, track.kind);
                            track.stop();
                        });
                        
                        // Now reload devices with labels and auto-select default
                        console.log('Reloading devices with labels...');
                        deviceId = await this.loadAudioDevices(true);
                        console.log('Selected device after reload:', deviceId);
                        
                        if (!deviceId || deviceId === '') {
                            alert('No microphone detected. Please:\n1. Check Windows Sound Settings\n2. Ensure microphone is enabled\n3. Try selecting "Demo Mode" to test the visualization\n\nPress F12 and check Console for details.');
                            return;
                        }
                    } catch (permError) {
                        console.error('Permission error:', permError);
                        alert('Microphone permission denied or no microphone available.\n\nTry:\n1. Check browser permissions (click lock icon in address bar)\n2. Check Windows Sound Settings\n3. Use "Demo Mode" option to test\n\nError: ' + permError.message);
                        return;
                    }
                }

                // Handle demo mode
                if (deviceId === 'demo') {
                    console.log('Starting in demo mode');
                    alert('Demo mode not fully implemented yet. Please connect a microphone or check Windows Sound Settings to see available devices.');
                    return;
                }

                // Start microphone
                console.log('Starting microphone with device:', deviceId);
                const success = await this.audioEngine.startMicrophone(deviceId);

                if (success) {
                    this.isRunning = true;
                    startBtn.textContent = 'Stop Experience';
                    startBtn.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                    this.start();
                    console.log('Audio started successfully');
                } else {
                    console.error('Failed to start microphone');
                }
            } catch (error) {
                console.error('Failed to start audio:', error);
                alert('Could not access microphone.\n\nError: ' + error.message + '\n\nPlease:\n1. Check browser console (F12)\n2. Verify microphone in Windows Sound Settings\n3. Try Demo Mode option');
            }
        } else {
            // Stop microphone
            this.audioEngine.stopMicrophone();
            this.isRunning = false;
            startBtn.textContent = 'Start Experience';
            startBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.stop();
        }
    }

    start() {
        if (!this.animationId) {
            this.animate();
        }
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Get audio data
        const frequencyData = this.audioEngine.getFrequencyData();
        const avgVolume = this.audioEngine.getAverageVolume();

        // Update audio level indicator
        this.updateAudioLevel(avgVolume);

        // Update and draw current visualization
        if (this.currentVisualization) {
            this.currentVisualization.update(frequencyData, this.sensitivity);
            this.currentVisualization.draw();
        }
    }

    updateAudioLevel(volume) {
        const levelBar = document.getElementById('audioLevel');
        const percentage = Math.min(100, (volume / 255) * 100 * 2);
        levelBar.style.width = percentage + '%';
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                document.body.classList.add('fullscreen');
            }).catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                document.body.classList.remove('fullscreen');
            });
        }
    }

    showInstructions() {
        document.getElementById('instructions').classList.remove('hidden');
    }

    hideInstructions() {
        document.getElementById('instructions').classList.add('hidden');
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new SonicEchoChamber();
    
    // Make app globally accessible for debugging
    window.app = app;
    
    console.log('%c Sonic Echo Chamber ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 20px; padding: 10px;');
    console.log('Installation art prototype loaded successfully.');
    console.log('Press F for fullscreen, Space to start/stop, ESC to exit fullscreen.');
});
