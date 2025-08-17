import React, { useState } from 'react';
import '../styles/components.css';

const VoiceToggle = ({ isEnabled, onToggle, isSupported }) => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const handleToggle = async () => {
    if (!isSupported) {
      alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (!isEnabled) {
      // Request microphone permission
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        onToggle();
      } catch (error) {
        console.error('Microphone permission denied:', error);
        setShowPermissionModal(true);
      }
    } else {
      onToggle();
    }
  };

  if (!isSupported) {
    return (
      <div className="voice-toggle unsupported">
        <div className="voice-status">
          <span>⚠️ Voice recognition not supported</span>
        </div>
        <div className="browser-hint">
          Try using Chrome, Edge, or Safari for voice features
        </div>
      </div>
    );
  }

  return (
    <div className="voice-toggle">
      <div className="toggle-container">
        <button
          className={`voice-btn ${isEnabled ? 'active' : ''} ${isEnabled ? 'listening' : ''}`}
          onClick={handleToggle}
          title={isEnabled ? 'Stop voice capture' : 'Start voice capture'}
        >
          <div className="microphone-icon">
            {isEnabled ? '🎤' : '🎙️'}
            {isEnabled && (
              <div className="sound-waves">
                <div className="wave wave-1"></div>
                <div className="wave wave-2"></div>
                <div className="wave wave-3"></div>
              </div>
            )}
          </div>
        </button>

        <div className="voice-info">
          <div className={`status-indicator ${isEnabled ? 'active' : ''}`}>
            <div className="status-dot"></div>
            <span className="status-text">
              {isEnabled ? 'Voice Capture Active' : 'Voice Capture Off'}
            </span>
          </div>
          
          {isEnabled && (
            <div className="listening-hint">
              Listening for your thoughts and intentions...
            </div>
          )}
        </div>
      </div>

      {isEnabled && (
        <div className="voice-visualization">
          <div className="frequency-bars">
            <div className="bar bar-1"></div>
            <div className="bar bar-2"></div>
            <div className="bar bar-3"></div>
            <div className="bar bar-4"></div>
            <div className="bar bar-5"></div>
          </div>
        </div>
      )}

      <div className="voice-privacy-note">
        <span className="privacy-icon">🔒</span>
        Voice processing happens locally in your browser. No audio is sent to external servers.
      </div>

      {showPermissionModal && (
        <div className="permission-modal">
          <div className="modal-backdrop" onClick={() => setShowPermissionModal(false)}></div>
          <div className="modal-content">
            <h3>🎤 Microphone Permission Required</h3>
            <p>
              To use voice capture, please allow microphone access when prompted by your browser.
            </p>
            
            <div className="permission-steps">
              <div className="step">
                1. Click the microphone icon in your browser's address bar
              </div>
              <div className="step">
                2. Select "Allow" to grant permission
              </div>
              <div className="step">
                3. Try the voice toggle again
              </div>
            </div>

            <div className="modal-actions">
              <button 
                onClick={() => setShowPermissionModal(false)}
                className="btn-secondary"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceToggle;