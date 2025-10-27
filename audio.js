// Audio Engine Class
class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.bufferLength = 0;
        this.frequencyData = null;
        this.timeData = null;
        this.isActive = false;
        this.devices = [];
        this.selectedDeviceId = null;
        this.demoMode = false;
        this.demoOscillator = null;
        this.demoTime = 0;
    }

    async initialize() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create analyser node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8;
            
            this.bufferLength = this.analyser.frequencyBinCount;
            this.frequencyData = new Uint8Array(this.bufferLength);
            this.timeData = new Uint8Array(this.bufferLength);
            
            return true;
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
            return false;
        }
    }

    async getDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            console.log('All devices found:', devices);
            this.devices = devices.filter(device => device.kind === 'audioinput');
            console.log('Audio input devices:', this.devices);
            return this.devices;
        } catch (error) {
            console.error('Failed to enumerate devices:', error);
            return [];
        }
    }

    async startMicrophone(deviceId = null) {
        try {
            // Stop existing microphone if any
            if (this.microphone) {
                this.stopMicrophone();
            }

            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                console.log('Resuming suspended audio context...');
                await this.audioContext.resume();
            }
            console.log('Audio context state:', this.audioContext.state);

            // Request microphone access
            const constraints = {
                audio: deviceId ? { deviceId: { exact: deviceId } } : true,
                video: false
            };

            console.log('Requesting microphone with constraints:', constraints);
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('Got media stream:', stream);
            console.log('Stream tracks:', stream.getTracks());
            
            // Create microphone source
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            console.log('Created media stream source');
            
            // Connect to analyser
            this.microphone.connect(this.analyser);
            console.log('Connected to analyser');
            
            this.isActive = true;
            this.selectedDeviceId = deviceId;
            
            // Test reading data immediately
            const testData = new Uint8Array(this.bufferLength);
            this.analyser.getByteFrequencyData(testData);
            const testAvg = testData.reduce((a, b) => a + b) / testData.length;
            console.log('Initial audio test - Average level:', testAvg);
            
            return true;
        } catch (error) {
            console.error('Failed to start microphone:', error);
            alert('Could not access microphone. Please check permissions.');
            return false;
        }
    }

    stopMicrophone() {
        if (this.microphone) {
            // Get the stream and stop all tracks
            const stream = this.microphone.mediaStream;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            
            this.microphone.disconnect();
            this.microphone = null;
            this.isActive = false;
        }
    }

    getFrequencyData() {
        if (this.analyser && this.isActive) {
            this.analyser.getByteFrequencyData(this.frequencyData);
            return this.frequencyData;
        }
        return new Uint8Array(this.bufferLength);
    }

    getTimeData() {
        if (this.analyser && this.isActive) {
            this.analyser.getByteTimeDomainData(this.timeData);
            return this.timeData;
        }
        return new Uint8Array(this.bufferLength);
    }

    getAverageVolume() {
        const data = this.getFrequencyData();
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += data[i];
        }
        return sum / data.length;
    }

    getFrequencyRanges() {
        const data = this.getFrequencyData();
        const ranges = {
            bass: 0,      // 20-250 Hz
            mid: 0,       // 250-2000 Hz
            high: 0       // 2000-20000 Hz
        };

        // Approximate frequency ranges based on buffer positions
        const bassEnd = Math.floor(this.bufferLength * 0.1);
        const midEnd = Math.floor(this.bufferLength * 0.4);

        // Calculate average for each range
        let bassSum = 0, midSum = 0, highSum = 0;
        
        for (let i = 0; i < bassEnd; i++) {
            bassSum += data[i];
        }
        ranges.bass = bassSum / bassEnd;

        for (let i = bassEnd; i < midEnd; i++) {
            midSum += data[i];
        }
        ranges.mid = midSum / (midEnd - bassEnd);

        for (let i = midEnd; i < data.length; i++) {
            highSum += data[i];
        }
        ranges.high = highSum / (data.length - midEnd);

        return ranges;
    }

    getPeakFrequency() {
        const data = this.getFrequencyData();
        let maxIndex = 0;
        let maxValue = 0;

        for (let i = 0; i < data.length; i++) {
            if (data[i] > maxValue) {
                maxValue = data[i];
                maxIndex = i;
            }
        }

        // Convert index to approximate frequency
        const nyquist = this.audioContext.sampleRate / 2;
        const frequency = (maxIndex / this.bufferLength) * nyquist;

        return { frequency, amplitude: maxValue };
    }

    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    suspend() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioEngine;
}
