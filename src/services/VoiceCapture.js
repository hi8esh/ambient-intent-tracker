// src/services/VoiceCapture.js - Voice recognition service

class VoiceCapture {
  constructor(onIntentionCallback) {
    this.onIntentionCallback = onIntentionCallback;
    this.recognition = null;
    this.isListening = false;
    this.isSupported = false;
    this.currentTranscript = '';
    this.silenceTimer = null;
    this.finalTranscripts = [];
    
    // Configuration
    this.silenceThreshold = 2000; // 2 seconds of silence before processing
    this.minWordCount = 3; // Minimum words to consider as intention
    this.maxSilenceBeforeStop = 30000; // 30 seconds before auto-stop
  }

  async initialize() {
    // Check for browser support
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
      this.isSupported = true;
    } else if ('SpeechRecognition' in window) {
      this.recognition = new window.SpeechRecognition();
      this.isSupported = true;
    } else {
      console.warn('Speech recognition not supported in this browser');
      return false;
    }

    // Configure recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    // Set up event listeners
    this.setupEventListeners();

    console.log('Voice capture initialized successfully');
    return true;
  }

  setupEventListeners() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      console.log('Voice recognition started');
      this.isListening = true;
    };

    this.recognition.onend = () => {
      console.log('Voice recognition ended');
      this.isListening = false;
      this.clearSilenceTimer();
    };

    this.recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      
      // Handle specific errors
      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          alert('Microphone permission denied. Please enable microphone access and try again.');
          break;
        case 'no-speech':
          console.log('No speech detected, continuing to listen...');
          break;
        case 'audio-capture':
          alert('No microphone found. Please check your audio settings.');
          break;
        case 'network':
          console.log('Network error in speech recognition');
          break;
        default:
          console.log('Speech recognition error:', event.error);
      }
    };

    this.recognition.onresult = (event) => {
      this.handleResult(event);
    };
  }

  handleResult(event) {
    let interimTranscript = '';
    let finalTranscript = '';

    // Process all results
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript;

      if (result.isFinal) {
        finalTranscript += transcript;
        this.finalTranscripts.push({
          text: transcript.trim(),
          confidence: result[0].confidence,
          timestamp: Date.now()
        });
      } else {
        interimTranscript += transcript;
      }
    }

    // Update current transcript
    this.currentTranscript = this.finalTranscripts
      .map(t => t.text)
      .join(' ') + ' ' + interimTranscript;

    // Handle silence detection
    if (finalTranscript) {
      this.resetSilenceTimer();
    }

    // Process if we have enough content and silence
    if (this.finalTranscripts.length > 0 && !interimTranscript) {
      this.processPotentialIntention();
    }
  }

  resetSilenceTimer() {
    this.clearSilenceTimer();
    
    this.silenceTimer = setTimeout(() => {
      if (this.finalTranscripts.length > 0) {
        this.processPotentialIntention();
      }
    }, this.silenceThreshold);
  }

  clearSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  processPotentialIntention() {
    if (this.finalTranscripts.length === 0) return;

    // Combine all final transcripts
    const fullText = this.finalTranscripts
      .map(t => t.text)
      .join(' ')
      .trim();

    // Filter out noise and short phrases
    const words = fullText.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length < this.minWordCount) {
      this.clearTranscripts();
      return;
    }

    // Check if this looks like an intention
    if (this.isLikelyIntention(fullText)) {
      const avgConfidence = this.finalTranscripts
        .reduce((sum, t) => sum + (t.confidence || 0), 0) / this.finalTranscripts.length;

      const intention = {
        text: this.cleanupText(fullText),
        timestamp: Date.now(),
        source: 'voice',
        confidence: avgConfidence ? Math.round(avgConfidence * 100) + '%' : 'Unknown',
        category: this.classifyIntention(fullText)
      };

      // Send to callback
      if (this.onIntentionCallback) {
        this.onIntentionCallback(intention);
      }

      console.log('Intention captured:', intention.text);
    }

    // Clear processed transcripts
    this.clearTranscripts();
  }

  isLikelyIntention(text) {
    const lowerText = text.toLowerCase();
    
    // Filter out common non-intentions
    const excludePatterns = [
      /^(um|uh|ah|er|hmm|okay|ok|well|so|and|but|the|a|an|is|am|are|was|were)\s*$/,
      /^(yes|no|yeah|yep|nope|maybe|sure|alright)\s*$/,
      /^.{1,10}$/, // Very short phrases
      /^[^a-zA-Z]*$/, // No letters
    ];

    for (const pattern of excludePatterns) {
      if (pattern.test(lowerText)) {
        return false;
      }
    }

    // Look for intention indicators
    const intentionIndicators = [
      /\b(want|need|should|would|could|might|plan|hope|wish|intend|goal|dream|aspire)\b/i,
      /\b(learn|study|practice|improve|develop|create|build|make|start|begin|try)\b/i,
      /\b(remember|note|remind|think|consider|explore|research|investigate)\b/i,
      /\b(exercise|workout|diet|health|meditation|read|write|call|email|visit)\b/i,
      /\b(buy|purchase|save|invest|organize|clean|fix|repair|update)\b/i,
    ];

    return intentionIndicators.some(pattern => pattern.test(lowerText)) || 
           text.length > 20; // Longer phrases are more likely to be intentions
  }

  cleanupText(text) {
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\b(um|uh|ah|er|hmm)\b/gi, '') // Remove filler words
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();
  }

  classifyIntention(text) {
    const lowerText = text.toLowerCase();
    
    const categories = {
      learning: /learn|study|course|skill|book|tutorial|education|knowledge|research|read/i,
      health: /exercise|diet|health|fitness|sleep|meditation|workout|wellness|doctor|gym/i,
      career: /job|work|career|promotion|interview|resume|business|meeting|project/i,
      creativity: /create|write|draw|music|art|design|creative|paint|craft|photography/i,
      relationships: /friend|family|relationship|social|meet|connect|love|date|call|visit/i,
      finance: /money|save|invest|budget|buy|purchase|financial|earn|pay|bill/i,
      personal: /organize|clean|plan|goal|habit|routine|personal|remember|remind/i
    };

    for (const [category, pattern] of Object.entries(categories)) {
      if (pattern.test(lowerText)) {
        return category;
      }
    }

    return 'general';
  }

  clearTranscripts() {
    this.finalTranscripts = [];
    this.currentTranscript = '';
  }

  start() {
    if (!this.recognition || this.isListening) return;

    try {
      this.clearTranscripts();
      this.recognition.start();
      console.log('Starting voice capture...');
    } catch (error) {
      console.error('Error starting voice capture:', error);
    }
  }

  stop() {
    if (!this.recognition || !this.isListening) return;

    try {
      this.recognition.stop();
      this.clearSilenceTimer();
      console.log('Stopping voice capture...');
    } catch (error) {
      console.error('Error stopping voice capture:', error);
    }
  }

  isSupported() {
    return this.isSupported;
  }

  isActive() {
    return this.isListening;
  }
}

export default VoiceCapture;