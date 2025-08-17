// src/services/EncryptedStorage.js - Complete with CRUD operations

class EncryptedStorage {
  constructor() {
    this.dbName = 'AmbientIntents';
    this.dbVersion = 1;
    this.storeName = 'intentions';
    this.db = null;
    this.encryptionKey = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Generate or retrieve encryption key
      this.encryptionKey = await this.getOrCreateEncryptionKey();
      
      // Initialize IndexedDB
      this.db = await this.openDatabase();
      
      this.isInitialized = true;
      console.log('Encrypted storage initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize encrypted storage:', error);
      return false;
    }
  }

  async getOrCreateEncryptionKey() {
    const keyName = 'ait-encryption-key';
    
    // Try to load existing key from localStorage
    const existingKeyData = localStorage.getItem(keyName);
    
    if (existingKeyData) {
      try {
        const keyBuffer = this.base64ToArrayBuffer(existingKeyData);
        return await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt', 'decrypt']
        );
      } catch (error) {
        console.warn('Failed to load existing key, generating new one');
      }
    }

    // Generate new key
    const newKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // Export and save key
    const exportedKey = await crypto.subtle.exportKey('raw', newKey);
    localStorage.setItem(keyName, this.arrayBufferToBase64(exportedKey));

    return newKey;
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    const binary = window.atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async encrypt(data) {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      this.encryptionKey,
      dataBuffer
    );

    return {
      encrypted: new Uint8Array(encryptedData),
      iv: iv
    };
  }

  async decrypt(encryptedData, iv) {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }

    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      this.encryptionKey,
      encryptedData
    );

    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decryptedData);
    return JSON.parse(jsonString);
  }

  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error(`Failed to open database: ${request.error}`));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create intentions object store
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          // Create indexes
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('source', 'source', { unique: false });
          store.createIndex('category', 'category', { unique: false });
        }
      };
    });
  }

  async saveIntention(intention) {
    if (!this.isInitialized) {
      throw new Error('Storage not initialized');
    }

    // Add metadata
    const intentionWithMeta = {
      ...intention,
      id: intention.id || Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
      version: '1.0'
    };

    // Encrypt the intention data
    const { encrypted, iv } = await this.encrypt(intentionWithMeta);

    // Prepare data for storage (with unencrypted metadata for indexing)
    const storageData = {
      encrypted: Array.from(encrypted),
      iv: Array.from(iv),
      timestamp: intentionWithMeta.timestamp,
      source: intentionWithMeta.source,
      category: intentionWithMeta.category || 'general'
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(storageData);

      request.onsuccess = () => {
        console.log('Intention saved successfully');
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to save intention: ${request.error}`));
      };
    });
  }

  async updateIntention(storageId, updatedIntention) {
    if (!this.isInitialized) {
      throw new Error('Storage not initialized');
    }

    // Add metadata
    const intentionWithMeta = {
      ...updatedIntention,
      updatedAt: new Date().toISOString(),
      version: '1.0'
    };

    // Encrypt the updated intention data
    const { encrypted, iv } = await this.encrypt(intentionWithMeta);

    // Prepare data for storage
    const storageData = {
      id: storageId,
      encrypted: Array.from(encrypted),
      iv: Array.from(iv),
      timestamp: intentionWithMeta.timestamp,
      source: intentionWithMeta.source,
      category: intentionWithMeta.category || 'general'
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(storageData);

      request.onsuccess = () => {
        console.log('Intention updated successfully');
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to update intention: ${request.error}`));
      };
    });
  }

  async getAllIntentions() {
    if (!this.isInitialized) {
      throw new Error('Storage not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = async () => {
        try {
          const encryptedIntentions = request.result;
          const decryptedIntentions = [];

          for (const item of encryptedIntentions) {
            try {
              const decrypted = await this.decrypt(
                new Uint8Array(item.encrypted),
                new Uint8Array(item.iv)
              );
              decryptedIntentions.push({
                ...decrypted,
                storageId: item.id
              });
            } catch (decryptError) {
              console.error('Failed to decrypt intention:', decryptError);
              // Continue with other intentions
            }
          }

          // Sort by timestamp (newest first)
          decryptedIntentions.sort((a, b) => b.timestamp - a.timestamp);
          resolve(decryptedIntentions);
        } catch (error) {
          reject(error);
        }
      };

      request.onerror = () => {
        reject(new Error(`Failed to retrieve intentions: ${request.error}`));
      };
    });
  }

  async deleteIntention(storageId) {
    if (!this.isInitialized) {
      throw new Error('Storage not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(storageId);

      request.onsuccess = () => {
        console.log('Intention deleted successfully');
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to delete intention: ${request.error}`));
      };
    });
  }

  async clearAllIntentions() {
    if (!this.isInitialized) {
      throw new Error('Storage not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('All intentions cleared');
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to clear intentions: ${request.error}`));
      };
    });
  }

  async getIntentionsByDateRange(startDate, endDate) {
    const allIntentions = await this.getAllIntentions();
    return allIntentions.filter(intention => 
      intention.timestamp >= startDate && intention.timestamp <= endDate
    );
  }

  async getIntentionsBySource(source) {
    const allIntentions = await this.getAllIntentions();
    return allIntentions.filter(intention => intention.source === source);
  }

  // Export data for backup
  async exportData() {
    const intentions = await this.getAllIntentions();
    return {
      exportDate: new Date().toISOString(),
      version: '1.0',
      intentionsCount: intentions.length,
      intentions: intentions
    };
  }
}

// Create and export singleton instance
export default new EncryptedStorage();