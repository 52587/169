// Color Schemes
const colorSchemes = {
    ethereal: {
        primary: [102, 126, 234],    // Purple-Blue
        secondary: [118, 75, 162],   // Deep Purple
        accent: [240, 147, 251],     // Light Purple
        glow: [150, 100, 255]
    },
    ocean: {
        primary: [64, 224, 208],     // Turquoise
        secondary: [0, 191, 255],    // Deep Sky Blue
        accent: [135, 206, 250],     // Light Blue
        glow: [100, 200, 255]
    },
    sunset: {
        primary: [255, 107, 107],    // Coral
        secondary: [255, 159, 64],   // Orange
        accent: [255, 195, 113],     // Light Orange
        glow: [255, 150, 100]
    },
    aurora: {
        primary: [127, 255, 212],    // Aquamarine
        secondary: [138, 43, 226],   // Blue Violet
        accent: [154, 205, 50],      // Yellow Green
        glow: [150, 200, 150]
    }
};

// Simple Perlin Noise Implementation
class PerlinNoise {
    constructor() {
        this.gradients = {};
        this.memory = {};
    }

    rand_vect() {
        let theta = Math.random() * 2 * Math.PI;
        return { x: Math.cos(theta), y: Math.sin(theta) };
    }

    dot_prod_grid(x, y, vx, vy) {
        let g_vect;
        let d_vect = { x: x - vx, y: y - vy };
        let grid_key = `${vx},${vy}`;

        if (this.gradients[grid_key]) {
            g_vect = this.gradients[grid_key];
        } else {
            g_vect = this.rand_vect();
            this.gradients[grid_key] = g_vect;
        }

        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    }

    smootherstep(x) {
        return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
    }

    interp(x, a, b) {
        return a + this.smootherstep(x) * (b - a);
    }

    get(x, y) {
        let xf = Math.floor(x);
        let yf = Math.floor(y);
        let tl = this.dot_prod_grid(x, y, xf, yf);
        let tr = this.dot_prod_grid(x, y, xf + 1, yf);
        let bl = this.dot_prod_grid(x, y, xf, yf + 1);
        let br = this.dot_prod_grid(x, y, xf + 1, yf + 1);
        let xt = this.interp(x - xf, tl, tr);
        let xb = this.interp(x - xf, bl, br);
        let v = this.interp(y - yf, xt, xb);
        return v;
    }
}

// Particle Visualization
class ParticleVisualization {
    constructor(canvas, colorScheme) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.colorScheme = colorSchemes[colorScheme];
        this.maxParticles = 1000; // Increased from 300
    }

    update(audioData, sensitivity) {
        const avgVolume = this.getAverage(audioData);
        
        // Spawn new particles based on audio (more dramatic threshold)
        if (avgVolume > 5) { // Lower threshold from 10
            const numParticles = Math.floor((avgVolume / 255) * sensitivity * 15); // Increased from 5 to 15
            
            for (let i = 0; i < numParticles && this.particles.length < this.maxParticles; i++) {
                // Analyze frequency to determine particle properties
                const freqIndex = Math.floor(Math.random() * audioData.length);
                const intensity = audioData[freqIndex] / 255;
                
                // Create explosion effect from center
                const angle = Math.random() * Math.PI * 2;
                const speed = 5 + intensity * 20; // Increased speed
                
                this.particles.push({
                    x: this.canvas.width / 2,
                    y: this.canvas.height / 2,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1.0,
                    decay: 0.002 + Math.random() * 0.003, // Slower decay for longer trails
                    size: 3 + intensity * 15, // Larger particles
                    color: this.getColorForFrequency(freqIndex, audioData.length),
                    intensity: intensity
                });
            }
        }

        // Update existing particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.985; // Less friction for more dramatic movement
            p.vy *= 0.985;
            p.life -= p.decay;
            p.size *= 0.992; // Slower size decay
            return p.life > 0;
        });
    }

    draw() {
        // Fade effect for trails (less fade for more dramatic trails)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw particles with enhanced glow effect
        this.particles.forEach(p => {
            const alpha = p.life * p.intensity;
            
            // Outer glow (larger, more dramatic)
            this.ctx.beginPath();
            const outerGradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
            outerGradient.addColorStop(0, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${alpha * 0.5})`);
            outerGradient.addColorStop(0.3, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${alpha * 0.25})`);
            outerGradient.addColorStop(1, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0)`);
            this.ctx.fillStyle = outerGradient;
            this.ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Inner glow
            this.ctx.beginPath();
            const innerGradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
            innerGradient.addColorStop(0, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${alpha * 0.8})`);
            innerGradient.addColorStop(0.5, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${alpha * 0.4})`);
            innerGradient.addColorStop(1, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0)`);
            this.ctx.fillStyle = innerGradient;
            this.ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
            this.ctx.fill();

            // Bright core
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
            this.ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Colored core
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${alpha})`;
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    getColorForFrequency(index, total) {
        const ratio = index / total;
        if (ratio < 0.33) {
            return this.colorScheme.primary;
        } else if (ratio < 0.66) {
            return this.colorScheme.secondary;
        } else {
            return this.colorScheme.accent;
        }
    }

    getAverage(array) {
        return array.reduce((a, b) => a + b, 0) / array.length;
    }

    setColorScheme(scheme) {
        this.colorScheme = colorSchemes[scheme];
    }
}

// Waveform Visualization
class WaveformVisualization {
    constructor(canvas, colorScheme) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.colorScheme = colorSchemes[colorScheme];
        this.noise = new PerlinNoise();
        this.time = 0;
        this.waves = [];
        this.numWaves = 8; // More waves for more dramatic effect
        
        // Initialize waves
        for (let i = 0; i < this.numWaves; i++) {
            this.waves.push({
                offset: i * 40,
                speed: 0.8 + i * 0.3, // Faster movement
                amplitude: 0,
                targetAmplitude: 0
            });
        }
    }

    update(audioData, sensitivity) {
        this.time += 0.02; // Faster animation
        
        const avgVolume = this.getAverage(audioData);
        
        // Update wave amplitudes based on audio (more dramatic)
        this.waves.forEach((wave, i) => {
            const dataIndex = Math.floor((i / this.numWaves) * audioData.length);
            const audioValue = audioData[dataIndex] / 255;
            // Add base amplitude so waves always move, even without sound
            const baseAmplitude = 30; // Minimum movement
            wave.targetAmplitude = baseAmplitude + (audioValue * sensitivity * 300);
            wave.amplitude += (wave.targetAmplitude - wave.amplitude) * 0.15; // Faster response
        });
    }

    draw() {
        // Clear with fade (less for more trails)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const centerY = this.canvas.height / 2;

        this.waves.forEach((wave, waveIndex) => {
            this.ctx.beginPath();
            
            const points = [];
            const segments = 100;
            
            for (let i = 0; i <= segments; i++) {
                const x = (i / segments) * this.canvas.width;
                const normalizedX = i / segments;
                
                // Use Perlin noise for organic movement
                const noiseValue = this.noise.get(
                    normalizedX * 3 + this.time * wave.speed,
                    waveIndex * 0.5
                );
                
                const y = centerY + 
                         (noiseValue * wave.amplitude) +
                         Math.sin((normalizedX * Math.PI * 2) + this.time * wave.speed) * wave.amplitude * 0.5;
                
                points.push({ x, y });
            }

            // Draw wave with gradient
            const colorIndex = waveIndex / this.numWaves;
            let color;
            if (colorIndex < 0.5) {
                color = this.interpolateColor(
                    this.colorScheme.primary,
                    this.colorScheme.secondary,
                    colorIndex * 2
                );
            } else {
                color = this.interpolateColor(
                    this.colorScheme.secondary,
                    this.colorScheme.accent,
                    (colorIndex - 0.5) * 2
                );
            }

            // Draw outer glow (more dramatic)
            this.ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.4)`;
            this.ctx.lineWidth = 40; // Thicker glow
            this.ctx.shadowBlur = 60; // More blur
            this.ctx.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.9)`;
            
            this.ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                this.ctx.lineTo(points[i].x, points[i].y);
            }
            this.ctx.stroke();

            // Draw middle glow
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.7)`;
            this.ctx.lineWidth = 15;
            this.ctx.shadowBlur = 30;
            
            this.ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                this.ctx.lineTo(points[i].x, points[i].y);
            }
            this.ctx.stroke();

            // Draw core line (brighter)
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(${color[0] + 50}, ${color[1] + 50}, ${color[2] + 50}, 1.0)`;
            this.ctx.lineWidth = 6; // Thicker core
            this.ctx.shadowBlur = 20;
            
            this.ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                this.ctx.lineTo(points[i].x, points[i].y);
            }
            this.ctx.stroke();
        });

        this.ctx.shadowBlur = 0;
    }

    interpolateColor(color1, color2, factor) {
        return [
            Math.round(color1[0] + (color2[0] - color1[0]) * factor),
            Math.round(color1[1] + (color2[1] - color1[1]) * factor),
            Math.round(color1[2] + (color2[2] - color1[2]) * factor)
        ];
    }

    getAverage(array) {
        return array.reduce((a, b) => a + b, 0) / array.length;
    }

    setColorScheme(scheme) {
        this.colorScheme = colorSchemes[scheme];
    }
}

// Radial Ripples Visualization
class RippleVisualization {
    constructor(canvas, colorScheme) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.colorScheme = colorSchemes[colorScheme];
        this.ripples = [];
        this.rotation = 0;
    }

    update(audioData, sensitivity) {
        this.rotation += 0.005; // Faster rotation
        
        const avgVolume = this.getAverage(audioData);
        
        // Create new ripples based on audio - OPTIMIZED
        if (avgVolume > 10 && this.ripples.length < 200) { // Limit total ripples for performance
            const intensity = avgVolume / 255;
            
            // Analyze frequency ranges - fewer bands for better performance
            const numBands = 32; // Reduced from 64
            const bandSize = Math.floor(audioData.length / numBands);
            
            for (let i = 0; i < numBands; i++) {
                const bandStart = i * bandSize;
                const bandValue = this.getAverage(audioData.slice(bandStart, bandStart + bandSize));
                
                if (bandValue > 30) { // Higher threshold to reduce quantity
                    this.ripples.push({
                        angle: (i / numBands) * Math.PI * 2,
                        radius: 0,
                        maxRadius: 80 + (bandValue / 255) * sensitivity * 400, // Reduced size
                        speed: 4 + (bandValue / 255) * 6, // Balanced speed
                        life: 1.0,
                        decay: 0.005, // Faster decay to clean up quicker
                        width: 3 + (bandValue / 255) * 12, // Moderate width
                        intensity: bandValue / 255,
                        color: this.getColorForIntensity(bandValue / 255)
                    });
                }
            }
        }

        // Update ripples
        this.ripples = this.ripples.filter(r => {
            r.radius += r.speed;
            r.life -= r.decay;
            r.width *= 1.01; // Grow width slightly as they move out
            return r.life > 0 && r.radius < r.maxRadius;
        });
    }

    draw() {
        // Clear with fade (less fade for more dramatic trails)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.rotation);

        // Draw ripples - OPTIMIZED (fewer draw calls)
        this.ripples.forEach(r => {
            const x = Math.cos(r.angle) * r.radius;
            const y = Math.sin(r.angle) * r.radius;
            
            const alpha = r.life * r.intensity;
            
            // Single glow layer (optimized)
            this.ctx.beginPath();
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, r.width * 4);
            gradient.addColorStop(0, `rgba(${r.color[0]}, ${r.color[1]}, ${r.color[2]}, ${alpha * 0.8})`);
            gradient.addColorStop(0.5, `rgba(${r.color[0]}, ${r.color[1]}, ${r.color[2]}, ${alpha * 0.4})`);
            gradient.addColorStop(1, `rgba(${r.color[0]}, ${r.color[1]}, ${r.color[2]}, 0)`);
            this.ctx.fillStyle = gradient;
            this.ctx.arc(x, y, r.width * 4, 0, Math.PI * 2);
            this.ctx.fill();

            // Bright core (combined)
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(${r.color[0] + 100}, ${r.color[1] + 100}, ${r.color[2] + 100}, ${alpha})`;
            this.ctx.arc(x, y, r.width, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw radial line (simplified)
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(${r.color[0]}, ${r.color[1]}, ${r.color[2]}, ${alpha * 0.4})`;
            this.ctx.lineWidth = r.width * 0.5;
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        });

        this.ctx.restore();

        // Draw center glow
        const avgIntensity = this.ripples.length > 0 
            ? this.ripples.reduce((sum, r) => sum + r.intensity, 0) / this.ripples.length 
            : 0;
        
        if (avgIntensity > 0) {
            const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100);
            gradient.addColorStop(0, `rgba(${this.colorScheme.glow[0]}, ${this.colorScheme.glow[1]}, ${this.colorScheme.glow[2]}, ${avgIntensity * 0.3})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    getColorForIntensity(intensity) {
        if (intensity < 0.33) {
            return this.colorScheme.primary;
        } else if (intensity < 0.66) {
            return this.colorScheme.secondary;
        } else {
            return this.colorScheme.accent;
        }
    }

    getAverage(array) {
        return array.reduce((a, b) => a + b, 0) / array.length;
    }

    setColorScheme(scheme) {
        this.colorScheme = colorSchemes[scheme];
    }
}
