# 🌱 Ambient Intent Tracker v1.0

A privacy-first React application that captures, processes, and visualizes your ambient intentions using voice recognition and manual input, with all data stored locally and encrypted.

---

## ✨ Features

- **🎤 Voice Capture**: Automatic detection of intention-like phrases using Web Speech API with continuous recognition, silence detection, and noise filtering.
- **⌨️ Manual Input**: Quick text capture with cycling placeholders and keyboard shortcuts (Ctrl+I to focus, Enter to save).
- **✏️ Inline Edit & Share**: Edit existing intentions inline, share via native share API or clipboard fallback.
- **🗑️ Delete with Confirmation**: Safe deletion with animated confirmation modal.
- **🔒 Privacy-First**: All data encrypted locally (AES-256-GCM) and stored in IndexedDB, no external server communication.
- **📊 Smart Categorization & Analytics**: Automatic classification into categories, track patterns, streaks, source breakdown, and achievements.
- **📱 Responsive Design**: Optimized for desktop, tablets, and mobile devices.
- **🌙 Dark Mode**: Full theming support for light and dark modes.
- **🔔 Notifications**: Optional native notifications for new voice captures.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Modern browser with Web Speech API support (Chrome, Edge, Safari)

### Installation

```bash
# Clone or create the project directory
mkdir ambient-intent-tracker
cd ambient-intent-tracker

# Initialize the React app with minimal template
npx create-react-app . --template minimal

# Install additional dependencies
npm install compromise natural

# Copy the provided files to their respective locations
# (Refer to project structure below)

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

---

## 📁 Project Structure

```
ambient-intent-tracker/
├── public/
│   ├── index.html                 # Main HTML template
│   └── manifest.json              # PWA manifest
├── src/
│   ├── components/                # React components
│   │   ├── QuickCapture.jsx       # Manual text input with advanced UX
│   │   ├── IntentionsList.jsx     # Intentions list with edit/share/delete
│   │   ├── VoiceToggle.jsx        # Voice capture control with permission modal
│   │   └── IntentionStats.jsx     # Analytics dashboard with insights
│   ├── services/                  # Core services
│   │   ├── VoiceCapture.js        # Web Speech API integration with silence detection
│   │   ├── EncryptedStorage.js    # Local encrypted storage with full CRUD
│   │   └── IntentProcessor.js     # NLP processing (future enhancement)
│   ├── styles/                    # CSS files
│   │   ├── App.css               # Main app styles with dark mode
│   │   ├── components.css         # Complete component styles including edit/delete/share
│   │   └── index.css              # Global styles
│   ├── App.jsx                    # Main app component integrating all pieces
│   └── index.js                   # Entry point
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

---

## 🛠️ Core Technologies

- **React 18**: Functional components with hooks
- **Web Speech API**: Native browser voice recognition
- **IndexedDB**: Local database storage
- **Web Crypto API**: Client-side AES-256-GCM encryption
- **Compromise & Natural**: For future NLP enhancements
- **CSS Grid & Flexbox**: Responsive modern layouts
- **Dark Mode & Accessibility**: Theming and reduced motion support

---

## 🔐 Privacy & Security

### Local-First Architecture
- All data processed and encrypted inside your browser
- No external servers or APIs for critical functions
- Intentions never leave your device unless you explicitly share

### Encryption
- AES-256-GCM encryption for all data at rest
- Encryption keys generated and stored locally and securely

### Voice Processing
- Audio processed locally with no cloud upload
- Silence detection and noise filtering ensures quality capture

---

## 📋 Usage Guide

### Voice Capture
1. Click the microphone button to toggle voice capture.
2. Grant microphone permissions in the browser prompt.
3. Speak naturally; the app detects intention-like phrases such as:
   - "I want to learn guitar"
   - "Maybe I should exercise more"
   - "I need to call my mom"
   - "I'm thinking of starting a blog"
4. See captured intentions in the list instantly.

### Manual Input
- Click or press `Ctrl+I` to focus the input field.
- Type your intention and press `Enter` to save.
- Auto-categorization tags your intention.
- You can edit or share intentions in the list.
- Use the delete button to confirm and remove intentions.

### Viewing Your Data
- Browse all captured intentions in a sortable, filterable list.
- Check your progress and usage statistics in the analytics panel.
- Filter intentions by category or input source.

---

## 🎯 Intention Categories

Automatically classified into:

- 📚 **Learning**: Education, skills, courses  
- 💪 **Health**: Exercise, wellness, self-care  
- 💼 **Career**: Work, professional development  
- 🎨 **Creativity**: Art, writing, projects  
- 👥 **Relationships**: Family, friends, social  
- 💰 **Finance**: Money, saving, investing  
- ⚡ **Personal**: Organization, habits, goals  
- 💭 **General**: Others and uncategorized

---

## 🔧 Development

### Available Scripts
- `npm start`: Start local development server
- `npm run build`: Generate production build
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App (use with caution)

### Browser Support
- **Chrome/Chromium**: Full support (recommended)  
- **Microsoft Edge**: Full support  
- **Safari**: Partial Web Speech API support  
- **Firefox**: No Web Speech API support (manual input only)

---

## 🎨 Component Architecture

### Core Components

#### QuickCapture Component
- Cycling placeholders for user engagement
- Global keyboard shortcut (Ctrl+I) for quick access
- Real-time character count and validation
- Auto-resizing textarea with smooth animations
- Success feedback with temporary messaging

#### IntentionsList Component
- **Inline Editing**: Click to edit intentions directly in-place
- **Share Functionality**: Native share API with clipboard fallback
- **Delete Confirmation**: Modal dialog with animation for safe deletion
- Filtering by category and source (manual vs voice)
- Sorting options (newest, oldest, by category)
- Expandable detail views with metadata

#### VoiceToggle Component
- Visual microphone button with pulse animations
- Permission handling with helpful instruction modal
- Browser compatibility detection and messaging
- Status indicators with real-time feedback
- Privacy notice for user transparency

#### IntentionStats Component
- Real-time analytics dashboard
- Streak tracking and achievement badges
- Source breakdown (manual vs voice input)
- Category distribution with visual progress bars
- Activity metrics and trend indicators

### Core Services

#### EncryptedStorage Service
- **Full CRUD Operations**: Create, Read, Update, Delete
- AES-256-GCM encryption for all data
- IndexedDB integration with error handling
- Backup and export capabilities
- Automatic data migration and versioning

#### VoiceCapture Service
- Continuous listening with interim results
- Silence detection and automatic processing
- Noise filtering and confidence scoring
- Intention classification and cleanup
- Cross-browser Web Speech API support

---

## 🚗 Roadmap (Future Versions)

### v1.1: Polish & Performance
- [ ] PWA capabilities with offline support
- [ ] Bulk operations (select multiple, batch delete)
- [ ] Advanced search and filtering
- [ ] Data export/import functionality

### v2.0: Enhanced Intelligence
- [ ] Advanced NLP clustering with ML.js
- [ ] Visual intention mapping with D3.js
- [ ] Weekly intention digests and summaries
- [ ] Smart suggestion system

### v3.0: Smart Integration
- [ ] Calendar integration for deadline tracking
- [ ] Email parsing for intention extraction
- [ ] Context-aware intention surfacing
- [ ] Collaborative intention sharing

### v4.0: Advanced Privacy
- [ ] End-to-end encrypted sync across devices
- [ ] Zero-knowledge architecture
- [ ] Advanced privacy controls and audit logs
- [ ] Federated learning for better categorization

---

## 🤝 Contributing

This is a privacy-focused personal project ideal for:
- Practicing React with hooks and state management
- Exploring Web APIs like Web Speech and Web Crypto
- Building secure, local-first web apps
- Designing intuitive UX for sensitive data

### Development Guidelines
1. All new features must maintain privacy-first architecture
2. Components should be fully responsive and accessible
3. Use the existing design system and CSS custom properties
4. Write comprehensive tests for new functionality
5. Document any new APIs or significant changes

Contributions and suggestions welcome!

---

## 📄 License

MIT License - Open source and free to use.

---

## 🙏 Acknowledgments

- Inspired by research on behavioral psychology and intention tracking
- Built with privacy and security as core principles
- Designed for ease of use and continuous improvement
- Special thanks to the React and Web APIs communities

---

## 🐛 Troubleshooting

### Common Issues

**Voice Recognition Not Working**
- Ensure you're using Chrome, Edge, or Safari
- Check microphone permissions in browser settings
- Try refreshing the page and re-granting permissions
- Verify microphone hardware is working

**Data Not Persisting**
- Check if browser supports IndexedDB
- Ensure sufficient browser storage space
- Verify browser privacy settings allow local storage
- Try clearing browser cache and reloading

**Performance Issues**
- Clear old intentions if storage approaches limits
- Check browser console for JavaScript errors
- Disable browser extensions that might interfere
- Try incognito/private mode to isolate issues

**Edit/Delete/Share Not Working**
- Ensure JavaScript is enabled
- Check for browser console errors
- Verify all CSS files are loading correctly
- Try hard refresh (Ctrl+F5) to clear cached files

### Browser-Specific Notes
- **Chrome**: Best performance and full feature support
- **Safari**: Limited Web Speech API, may require user gesture
- **Firefox**: No Web Speech API support, manual input only
- **Edge**: Full support, similar performance to Chrome

---

**Built with ❤️ for privacy-conscious intention tracking**