# 🌱 Ambient Intent Tracker v1

A privacy-first React application that captures, processes, and visualizes your ambient intentions using voice recognition and manual input, with all data stored locally and encrypted.

## ✨ Features

- **🎤 Voice Capture**: Automatic detection of intention-like phrases using Web Speech API
- **⌨️ Manual Input**: Quick text capture with keyboard shortcuts (Ctrl+I)
- **🔒 Privacy-First**: All data encrypted and stored locally using IndexedDB
- **📊 Smart Categorization**: Automatic classification of intentions into categories
- **📈 Analytics**: Track patterns, streaks, and visualization of your intention data
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Modern browser with Web Speech API support (Chrome, Edge, Safari)

### Installation

```bash
# Clone or create the project directory
mkdir ambient-intent-tracker
cd ambient-intent-tracker

# Initialize the React app
npx create-react-app . --template minimal

# Install additional dependencies
npm install compromise natural

# Copy the provided files to their respective locations
# (See file structure below)

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
ambient-intent-tracker/
├── public/
│   ├── index.html                 # Main HTML template
│   └── manifest.json              # PWA manifest
├── src/
│   ├── components/                # React components
│   │   ├── QuickCapture.jsx       # Manual text input
│   │   ├── IntentionsList.jsx     # Display intentions
│   │   ├── VoiceToggle.jsx        # Voice capture control
│   │   └── IntentionStats.jsx     # Analytics dashboard
│   ├── services/                  # Core services
│   │   ├── VoiceCapture.js        # Web Speech API integration
│   │   ├── EncryptedStorage.js    # Local encrypted storage
│   │   └── IntentProcessor.js     # NLP processing (future)
│   ├── styles/                    # CSS files
│   │   ├── App.css               # Main app styles
│   │   ├── components.css         # Component styles
│   │   └── index.css              # Global styles
│   ├── App.jsx                    # Main app component
│   └── index.js                   # Entry point
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🛠️ Core Technologies

- **React 18**: Modern React with hooks and functional components
- **Web Speech API**: Browser-native voice recognition
- **IndexedDB**: Local database storage
- **Web Crypto API**: Client-side encryption (AES-256-GCM)
- **CSS Grid/Flexbox**: Modern responsive layout

## 🔐 Privacy & Security

### Local-First Architecture
- All data processing happens in your browser
- No external servers or APIs used for core functionality
- Intentions never leave your device

### Encryption
- AES-256-GCM encryption for all stored data
- Encryption keys generated and stored locally
- No plaintext data in browser storage

### Voice Processing
- Voice recognition uses browser's built-in API
- Audio processing happens locally
- No audio data transmitted to external services

## 📋 Usage Guide

### Voice Capture
1. Click the microphone button to enable voice capture
2. Grant microphone permissions when prompted
3. Speak naturally - the app detects intention phrases like:
   - "I want to learn guitar"
   - "Maybe I should exercise more"
   - "I need to call my mom"
   - "I'm thinking of starting a blog"

### Manual Input
- Click the text area or press `Ctrl+I` to focus
- Type your intention and press `Enter` to save
- Text is automatically categorized and encrypted

### Viewing Your Data
- **Intentions List**: Browse all captured intentions
- **Stats Panel**: View analytics and patterns
- **Categories**: Filter by intention type
- **Timeline**: Track your intention capture over time

## 🎯 Intention Categories

The app automatically classifies intentions into:

- 📚 **Learning**: Education, skills, courses
- 💪 **Health**: Exercise, wellness, self-care
- 💼 **Career**: Work, professional development
- 🎨 **Creativity**: Art, writing, creative projects
- 👥 **Relationships**: Social connections, family
- 💰 **Finance**: Money management, investments
- ⚡ **Personal**: Organization, habits, goals
- 💭 **General**: Everything else

## 🔧 Development

### Available Scripts
- `npm start`: Development server
- `npm run build`: Production build
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

### Browser Support
- **Chrome/Chromium**: Full support (recommended)
- **Microsoft Edge**: Full support
- **Safari**: Limited Web Speech API support
- **Firefox**: No Web Speech API support (manual input only)

### Key Components

#### VoiceCapture Service
Handles Web Speech API integration with intention phrase detection.

#### EncryptedStorage Service
Manages local data with AES-256-GCM encryption using IndexedDB.

#### QuickCapture Component
Provides manual text input with keyboard shortcuts and real-time feedback.

#### IntentionsList Component
Displays captured intentions with filtering, sorting, and detailed views.

## 🚗 Roadmap (Future Versions)

### v2.0: Enhanced Intelligence
- [ ] Advanced NLP clustering with ML.js
- [ ] Visual intention mapping with D3.js
- [ ] Weekly intention digests
- [ ] Export/import functionality

### v3.0: Smart Integration
- [ ] Email/calendar integration
- [ ] Context-aware intention surfacing
- [ ] Collaborative features
- [ ] Mobile app (React Native)

### v4.0: Advanced Privacy
- [ ] End-to-end encrypted sync
- [ ] Zero-knowledge architecture
- [ ] Advanced privacy controls
- [ ] Federated learning

## 🤝 Contributing

This is a learning project perfect for:
- React development practice
- Privacy-first architecture exploration
- Web API integration (Speech, Crypto, IndexedDB)
- UX design for sensitive data applications

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by behavioral psychology research on intention-action gaps
- Built with privacy-first principles
- Designed for continuous learning and improvement

## 🐛 Troubleshooting

### Voice Recognition Not Working
- Ensure you're using Chrome, Edge, or Safari
- Check microphone permissions
- Try refreshing the page

### Data Not Persisting
- Check if browser supports IndexedDB
- Ensure sufficient browser storage space
- Check for browser privacy settings blocking storage

### Performance Issues
- Clear old intentions if storage is full
- Check browser console for errors
- Try disabling browser extensions

---

**Built with ❤️ for privacy-conscious intention tracking**