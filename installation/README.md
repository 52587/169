# Sonic Echo Chamber

**An Interactive Audio-Visual Installation Art Piece**

![Installation Preview](https://img.shields.io/badge/Type-Installation%20Art-purple?style=for-the-badge)
![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-Enabled-blue?style=for-the-badge)
![HTML5 Canvas](https://img.shields.io/badge/HTML5%20Canvas-Graphics-green?style=for-the-badge)

---

## 🎨 Concept

**Sonic Echo Chamber** is an immersive digital installation that transforms sound into persistent visual echoes, exploring themes of memory, presence, and the collective nature of human voice. Participants' sounds create layered, evolving visualizations that fade slowly over time—making the invisible visible.

### Key Themes
- **Memory & Impermanence**: Visual echoes that persist and fade
- **Collective Experience**: Layered voices creating complex patterns
- **Presence in Space**: Awareness of sonic occupation
- **Meditative Technology**: Art through interactive computation

---

## ✨ Features

### 🎵 Audio Input
- Real-time microphone capture with device selection
- Web Audio API frequency and amplitude analysis
- Responsive to voice, music, and environmental sounds

### 🌈 Three Visualization Modes

1. **Echo Particles**
   - Sounds spawn glowing particles that persist and fade
   - Different frequencies create different colors
   - Creates visual memory of sound history

2. **Fluid Waveform**
   - Organic, living waveforms using Perlin noise
   - Responds to pitch and amplitude
   - Multiple layers for depth

3. **Radial Ripples**
   - Sound emanates as waves from center
   - Mandala-like patterns
   - Rotation adds hypnotic quality

### 🎨 Color Schemes
- **Ethereal**: Purple and blue tones
- **Ocean**: Teal and aquamarine
- **Sunset**: Coral, orange, and pink
- **Aurora**: Green and purple northern lights

### 🎮 Interactive Controls
- Microphone device selection
- Sensitivity adjustment (0.5x - 3x)
- Visualization mode switching
- Color scheme selection
- Fullscreen mode
- Audio level monitoring

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Edge, Firefox, or Safari)
- Microphone access
- JavaScript enabled

### Installation

1. **Clone or Download** this repository
2. **Open** `index.html` in a web browser
3. **Allow** microphone permissions when prompted
4. **Interact** by making sounds!

### No Server Required
This is a completely client-side application. Simply open the HTML file in your browser—no build process or server needed.

---

## 📖 Usage Instructions

### Quick Start
1. Open `index.html` in your browser
2. Read the welcome instructions
3. Click "Begin" to dismiss instructions
4. Select your microphone from the dropdown
5. Click "Start Experience"
6. Allow microphone access
7. Make sounds and watch the visualization!

### Controls

#### Keyboard Shortcuts
- `F` - Toggle fullscreen
- `Space` - Start/Stop experience
- `ESC` - Exit fullscreen

#### Mouse/Touch Controls
- Click visualization mode buttons to switch
- Drag sensitivity slider to adjust responsiveness
- Select color scheme from dropdown
- Click fullscreen button for immersive view

### Tips for Best Experience
- Use in a quiet room for best audio capture
- Experiment with different sounds: whispers, singing, clapping
- Try sustained tones vs. percussive sounds
- Collaborate with others for complex patterns
- Use fullscreen mode for maximum immersion
- Adjust sensitivity based on your sound levels

---

## 🎯 For Installation/Exhibition

### Recommended Setup

**Display**:
- Projector (3000+ lumens) or large screen (55"+)
- Dark or dimly lit room
- 8-12 feet viewing distance

**Audio**:
- Boundary microphone (ceiling-mounted) or USB mic
- Quiet environment for clean capture

**Computer**:
- Modern laptop or desktop
- Dedicated graphics recommended
- Browser in kiosk mode for exhibitions

**See [INSTALLATION_DOCUMENTATION.md](INSTALLATION_DOCUMENTATION.md)** for complete setup guide including:
- Hardware requirements and budget
- Ideal space specifications
- Set dressing ideas
- Immersive environment design

---

## 📁 Project Structure

```
installation/
│
├── index.html                      # Main HTML file
├── style.css                       # Styles and UI design
├── app.js                          # Main application logic
├── audio.js                        # Audio engine and Web Audio API
├── visualizations.js               # Visualization classes
├── README.md                       # This file
└── INSTALLATION_DOCUMENTATION.md   # Full installation guide
```

---

## 🛠️ Technical Details

### Technologies Used
- **HTML5 Canvas** - 2D graphics rendering
- **Web Audio API** - Real-time audio processing
- **JavaScript ES6+** - Application logic
- **CSS3** - UI styling and effects

### Audio Processing
- FFT Size: 2048 samples
- Frequency analysis for visualization mapping
- Time domain data for waveform display
- Smoothing for visual continuity

### Rendering
- 60 FPS target with RequestAnimationFrame
- Particle system with pooling
- Alpha blending for trails and glow
- Gradient fills for ethereal effects

### Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Requires microphone permissions
- ⚠️ Requires Web Audio API support

---

## 🎓 Academic Context

This project was created for **CMPM 169 - Installation Art** and meets the following requirements:

- ✅ **Interactive**: Responds to microphone input in real-time
- ✅ **Immersive**: Fullscreen mode with atmospheric visuals
- ✅ **Utilizes Environment**: Sound from physical space drives the experience
- ✅ **Prototype**: Functional web-based demonstration
- ✅ **Documentation**: Complete installation plan with hardware specs and budget
- ✅ **Immersive Design**: Set dressing ideas and environmental considerations

---

## 🎬 Demo Video

To create a demo video:
1. Use screen recording software (OBS, QuickTime, Xbox Game Bar)
2. Start the installation in fullscreen
3. Record yourself interacting with different sounds
4. Show mode switching and color scheme changes
5. Demonstrate sustained interaction (2-3 minutes)

### Suggested Demo Script
- Welcome and concept explanation (30s)
- Start experience and begin with whispers (30s)
- Try louder sounds and singing (30s)
- Switch visualization modes (30s)
- Change color schemes (30s)
- Show collaborative interaction if possible (30s)

---

## 📚 Inspiration and References

### Art Installations
- **teamLab** - Digital art collectives creating immersive installations
- **Meow Wolf** - Interactive, narrative-driven art experiences  
- **Ryoji Ikeda** - Data-driven audiovisual performances
- **James Turrell** - Light and space installations
- **Rafael Lozano-Hemmer** - Interactive installations with biometric data

### Technical References
- Web Audio API Documentation
- HTML5 Canvas Performance Optimization
- Particle System Design Patterns
- Perlin Noise for Organic Motion

---

## 🔧 Customization

### Modifying Visualizations
Edit `visualizations.js` to adjust:
- Particle count and behavior
- Color mappings
- Animation speeds
- Decay rates

### Adding New Color Schemes
Add to the `colorSchemes` object in `visualizations.js`:
```javascript
newScheme: {
    primary: [R, G, B],
    secondary: [R, G, B],
    accent: [R, G, B],
    glow: [R, G, B]
}
```

### Adjusting Sensitivity
Modify default sensitivity in `app.js`:
```javascript
this.sensitivity = 2.0; // Increase for more responsiveness
```

---

## 🐛 Troubleshooting

### No Audio Input
- Check microphone permissions in browser
- Verify microphone is selected in dropdown
- Test microphone in system settings
- Try refreshing the page

### Poor Performance
- Close other browser tabs
- Reduce window size (before going fullscreen)
- Try Chrome/Edge for better performance
- Update graphics drivers

### Visualizations Not Appearing
- Check browser console for errors (F12)
- Ensure JavaScript is enabled
- Try a different browser
- Clear browser cache

### Audio Level Too Low/High
- Adjust sensitivity slider
- Move closer/farther from microphone
- Check system audio input levels
- Test with different sound types

---

## 📄 License

This project is created for educational purposes as part of CMPM 169.

Feel free to use, modify, and adapt for educational and non-commercial purposes.

### Attribution
If you use or adapt this work, please credit:
- Original concept and implementation
- Course: CMPM 169 - Installation Art
- Date: October 2025

---

## 🤝 Contributing

This is an academic project, but suggestions are welcome!

### Ideas for Future Development
- [ ] Add motion tracking for body-based interaction
- [ ] Implement spatial audio output
- [ ] Create recording/playback feature
- [ ] Add WebGL for 3D visualizations
- [ ] Network multiple installations together
- [ ] Machine learning for pattern recognition

---

## 📧 Contact

**Created by**: [Your Name]  
**Course**: CMPM 169 - Installation Art  
**Institution**: [Your University]  
**Email**: [your.email@university.edu]  
**Portfolio**: [your-portfolio-url]

---

## 🙏 Acknowledgments

- Course instructor and TAs
- Web Audio API community
- HTML5 Canvas tutorials and documentation
- teamLab and Meow Wolf for installation inspiration
- All the artists creating immersive experiences

---

## 🌟 Project Status

**Status**: ✅ Complete Prototype  
**Version**: 1.0  
**Last Updated**: October 2025

**Prototype Features Complete**:
- [x] Web Audio API integration
- [x] Three visualization modes
- [x] Device selection
- [x] Sensitivity controls
- [x] Color schemes
- [x] Fullscreen mode
- [x] Touch-friendly UI
- [x] Installation documentation

**Ready for**:
- Demonstration
- Exhibition (with appropriate hardware)
- Documentation submission
- Video recording

---

*"Making the invisible visible, one sound at a time."*

