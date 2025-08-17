import React, { useState, useEffect, useRef } from 'react';
import EncryptedStorage from '../services/EncryptedStorage';
import '../styles/components.css';

const QuickCapture = ({ onIntentionSaved }) => {
  const [text, setText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const inputRef = useRef(null);

  const placeholders = [
    "What's on your mind? (Ctrl + I)",
    "I want to...",
    "Maybe I should...",
    "I'm thinking of...",
    "I'd like to...",
    "It would be good to..."
  ];

  useEffect(() => {
    // Cycle through placeholders every 3s
    let currentIndex = 0;
    setPlaceholder(placeholders[0]);

    const placeholderInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % placeholders.length;
      setPlaceholder(placeholders[currentIndex]);
    }, 3000);

    // Global shortcut Ctrl+I to focus textarea
    const handleKeyDown = (event) => {
      if (event.ctrlKey && (event.key === 'i' || event.key === 'I')) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(placeholderInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Intention categorization helper
  const classifyIntention = (text) => {
    const lowerText = text.toLowerCase();

    const categories = {
      learning: /learn|study|course|skill|book|tutorial|education|knowledge/i,
      health: /exercise|diet|health|fitness|sleep|meditation|workout|wellness/i,
      career: /job|work|career|promotion|interview|resume|business/i,
      creativity: /create|write|draw|music|art|design|creative|project/i,
      relationships: /friend|family|relationship|social|meet|connect|love/i,
      finance: /money|save|invest|budget|buy|purchase|financial|earn/i,
      personal: /organize|clean|plan|goal|habit|routine|personal/i,
    };

    for (const [category, pattern] of Object.entries(categories)) {
      if (pattern.test(lowerText)) return category;
    }
    return 'general';
  };

  // Save intention to encrypted storage
  const saveIntention = async () => {
    const trimmedText = text.trim();
    if (!trimmedText || isSaving) return;

    setIsSaving(true);
    try {
      const intention = {
        text: trimmedText,
        timestamp: Date.now(),
        source: 'manual',
        category: classifyIntention(trimmedText),
        processed: false,
      };

      await EncryptedStorage.saveIntention(intention);

      setText('');
      setShowSavedMessage(true);
      if (onIntentionSaved) onIntentionSaved();

      // Hide success message after 2 seconds
      setTimeout(() => setShowSavedMessage(false), 2000);
    } catch (error) {
      console.error('Failed to save intention:', error);
      alert('Failed to save intention. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    saveIntention();
  };

  // Submit form on Enter (without Shift)
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      saveIntention();
    }
  };

  return (
    <div className="quick-capture">
      <form onSubmit={handleSubmit} className="capture-form">
        <div className="input-container">
          <textarea
            ref={inputRef}
            className="capture-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            rows="1"
            maxLength="280"
            disabled={isSaving}
          />
          <div className="input-actions">
            <span className="char-count">
              {text.length}/280
            </span>
            <button
              type="submit"
              className={`capture-btn ${text.trim() ? 'active' : ''}`}
              disabled={!text.trim() || isSaving}
            >
              {isSaving ? (
                <span className="loading-dots">
                  <span></span><span></span><span></span>
                </span>
              ) : (
                '✨ Capture'
              )}
            </button>
          </div>
        </div>
      </form>

      {showSavedMessage && (
        <div className="saved-message">
          <span className="check-icon">✅</span>
          Intention captured and encrypted locally!
        </div>
      )}

      <div className="capture-hints">
        <div className="hint-item">
          <kbd>Ctrl</kbd> + <kbd>I</kbd> to focus
        </div>
        <div className="hint-item">
          <kbd>Enter</kbd> to save
        </div>
      </div>
    </div>
  );
};

export default QuickCapture;
