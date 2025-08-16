import React, { useEffect, useState } from 'react';
import QuickCapture from './components/QuickCapture';
import IntentionsList from './components/IntentionsList';
import VoiceToggle from './components/VoiceToggle';
import IntentionStats from './components/IntentionStats';
import VoiceCapture from './services/VoiceCapture';
import EncryptedStorage from './services/EncryptedStorage';
import './styles/App.css';

function App() {
  const [voiceCapture, setVoiceCapture] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [intentions, setIntentions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize encrypted storage
    const initializeApp = async () => {
      try {
        await EncryptedStorage.initialize();
        const savedIntentions = await EncryptedStorage.getAllIntentions();
        setIntentions(savedIntentions);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    // Initialize voice capture
    const initVoice = async () => {
      const voice = new VoiceCapture(handleVoiceIntention);
      await voice.initialize();
      setVoiceCapture(voice);
    };

    initVoice();

    // Cleanup on unmount
    return () => {
      if (voiceCapture) {
        voiceCapture.stop();
      }
    };
  }, []);

  const handleVoiceIntention = async (intention) => {
    try {
      await EncryptedStorage.saveIntention(intention);
      const updatedIntentions = await EncryptedStorage.getAllIntentions();
      setIntentions(updatedIntentions);
      
      // Show a brief notification
      showNotification(`Voice captured: "${intention.text}"`);
    } catch (error) {
      console.error('Failed to save voice intention:', error);
    }
  };

  const handleManualIntention = async () => {
    try {
      const updatedIntentions = await EncryptedStorage.getAllIntentions();
      setIntentions(updatedIntentions);
    } catch (error) {
      console.error('Failed to refresh intentions:', error);
    }
  };

  const toggleVoiceCapture = () => {
    if (!voiceCapture) return;

    if (isVoiceEnabled) {
      voiceCapture.stop();
      setIsVoiceEnabled(false);
    } else {
      voiceCapture.start();
      setIsVoiceEnabled(true);
    }
  };

  const showNotification = (message) => {
    // Simple notification system
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Ambient Intent Tracker', {
        body: message,
        icon: '/favicon.ico',
        silent: true
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
  };

  if (isLoading) {
    return (
      <div className="app loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Initializing secure storage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌱 Ambient Intent Tracker</h1>
        <p className="app-subtitle">
          Capture your thoughts and aspirations privately, locally, securely
        </p>
      </header>

      <main className="app-main">
        <div className="capture-section">
          <QuickCapture onIntentionSaved={handleManualIntention} />
          <VoiceToggle
            isEnabled={isVoiceEnabled}
            onToggle={toggleVoiceCapture}
            isSupported={!!voiceCapture}
          />
        </div>

        <div className="content-grid">
          <div className="stats-panel">
            <IntentionStats intentions={intentions} />
          </div>
          
          <div className="intentions-panel">
            <IntentionsList intentions={intentions} />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="privacy-notice">
          <span className="privacy-icon">🔒</span>
          All data stored locally and encrypted. Nothing is sent to external servers.
        </div>
        <div className="app-info">
          <button
            onClick={requestNotificationPermission}
            className="notification-btn"
          >
            Enable Notifications
          </button>
          <span className="version">v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}

export default App;