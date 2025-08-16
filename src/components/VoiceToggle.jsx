import React, { useState, useEffect } from 'react';
import '../styles/components.css';

const VoiceToggle = ({ isEnabled, onToggle, isSupported }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  useEffect(() => {
    if (isEnabled) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isEnabled]);

  const handleToggle = async () => {
    if (!isSupported) {
      alert('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Check microphone permission
    try {
      const permission = await navigator.permissions.query({ name: 'microphone' });
      
      if (permission.state === 'denied') {
        setShowPermissionPrompt(true);
        return;
      }

      if (permission.state === 'prompt') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop()); // Clean up
        } catch (error) {
          console.error('Microphone permission denied:', error);
          setShowPermissionPrompt(true);
          return;
        }
      }

      onToggle();
    } catch (error) {
      console.error('Error checking permissions:', error);
      // Fallback - try to toggle anyway
      onToggle();
    }
  };

  const dismissPermissionPrompt = () => {
    setShowPermissionPrompt(false);
  };

  if (!isSupported) {
    return (
      <div className="voice-toggle unsupported">
        <div className="voice-status">
          <span className="status-icon">🚫</span>
          <span className="status-text">Voice capture not supported in this browser</span>
        </div>
        <div className="browser-hint">
          Try Chrome, Edge, or Safari for voice features
        </div>
      </div>
    );
  }

  return (
    <div className="voice-toggle">
      <div className="toggle-container">
        <button
          className={`voice-btn ${isEnabled ? 'active' : ''} ${isAnimating ? 'listening' : ''}`}
          onClick={handleToggle}
          title={isEnabled ? 'Stop voice capture' : 'Start voice capture'}
        >
          <div className="microphone-icon">
            🎤
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
              {isEnabled ? 'Listening for intentions...' : 'Voice capture off'}
            </span>
          </div>
          
          {isEnabled && (
            <div className="listening-hint">
              Say phrases like "I want to..." or "Maybe I should..."
            </div>
          )}
        </div>
      </div>

      {isEnabled && (
        <div className="voice-visualization">
          <div className="frequency-bars">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`bar bar-${i + 1}`}></div>
            ))}
          </div>
        </div>
      )}

      {showPermissionPrompt && (
        <div className="permission-modal">
          <div className="modal-backdrop" onClick={dismissPermissionPrompt}></div>
          <div className="modal-content">
            <h3>🎤 Microphone Permission Required</h3>
            <p>
              To capture your voice intentions, please allow microphone access when prompted by your browser.
            </p>
            <div className="permission-steps">
              <div className="step">
                <strong>1.</strong> Click the microphone icon in your browser's address bar
              </div>
              <div className="step">
                <strong>2.</strong> Select "Allow" to grant microphone permission
              </div>
              <div className="step">
                <strong>3.</strong> Try enabling voice capture again
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={dismissPermissionPrompt} className="btn-secondary">
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="voice-privacy-note">
        <span className="privacy-icon">🔒</span>
        <span>Voice processing happens locally - nothing is sent to external servers</span>
      </div>
    </div>
  );
};

export default VoiceToggle;