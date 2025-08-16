class VoiceCapture {
  constructor(onIntentionCaptured) {
    this.recognition = null;
    this.isListening = false;
    this.isSupported = false;
    this.onIntentionCaptured = onIntentionCaptured;
    this.lastTranscript = '';
    this.intentionPatterns = [
      /^(i want to|i should|i need to|maybe i|i wish)/i,
      /^(let me|i'll try to|i could|i might)/i,
      /^(it would be good to|i'm thinking of)/i,
      /^(i have to|i must|i ought to)/i,
      /^(i'd like to|i would like to)/i
    ];
  }

  async initialize() {
    // Check for speech recognition support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      this.isSupported = false;
      return false;
    }

    this.isSupported = true;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Configure speech recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    // Set up event handlers
    this.recognition.onstart = () => {
      console.log('Voice recognition started');
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      this.handleSpeechResult(event);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Restart if no speech detected
        this.restart();
      }
    };

    this.recognition.onend = () => {
      console.log('Voice recognition ended');
      this.isListening = false;
      // Auto-restart if it was supposed to be listening
      if (this.shouldBeListening) {
        setTimeout(() => this.start(), 1000);
      }
    };

    return true;
  }

  handleSpeechResult(event) {
    let interimTranscript = '';
    let finalTranscript = '';

    // Process all results
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    // Process final transcript for intentions
    if (finalTranscript) {
      const cleanTranscript = finalTranscript.trim().toLowerCase();
      
      // Avoid duplicate processing
      if (cleanTranscript !== this.lastTranscript && this.isIntentionPhrase(cleanTranscript)) {
        this.lastTranscript = cleanTranscript;
        this.captureIntention(finalTranscript.trim());
      }
    }
  }

  isIntentionPhrase(text) {
    // Check if the text matches intention patterns
    return this.intentionPatterns.some(pattern => pattern.test(text));
  }

  async captureIntention(text) {
    if (!text || text.length < 5) return; // Avoid capturing very short phrases

    const intention = {
      text: text,
      timestamp: Date.now(),
      source: 'voice',
      confidence: 'high',
      processed: false
    };

    try {
      await this.onIntentionCaptured(intention);
      console.log('Voice intention captured:', text);
    } catch (error) {
      console.error('Failed to save voice intention:', error);
    }
  }

  start() {
    if (!this.isSupported || !this.recognition) {
      console.warn('Cannot start voice capture - not supported or not initialized');
      return false;
    }

    try {
      this.shouldBeListening = true;
      if (!this.isListening) {
        this.recognition.start();
      }
      return true;
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      return false;
    }
  }

  stop() {
    this.shouldBeListening = false;
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  restart() {
    if (this.shouldBeListening) {
      this.stop();
      setTimeout(() => this.start(), 500);
    }
  }

  getStatus() {
    return {
      isSupported: this.isSupported,
      isListening: this.isListening,
      shouldBeListening: this.shouldBeListening
    };
  }
}

export default VoiceCapture;