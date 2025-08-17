import React, { useState, useMemo } from 'react';
import EncryptedStorage from '../services/EncryptedStorage';
import '../styles/components.css';

const IntentionsList = ({ intentions, onIntentionsChange }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showDetails, setShowDetails] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filter and sort intentions
  const filteredIntentions = useMemo(() => {
    let filtered = [...intentions];

    // Apply category filter
    if (filter !== 'all') {
      filtered = filtered.filter(intention => intention.category === filter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        break;
    }

    return filtered;
  }, [intentions, filter, sortBy]);

  // Get unique categories for filter options
  const categories = useMemo(() => {
    const cats = [...new Set(intentions.map(i => i.category))];
    return cats.sort();
  }, [intentions]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays}d ago`;
      return date.toLocaleDateString();
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      learning: '📚',
      health: '💪',
      career: '💼',
      creativity: '🎨',
      relationships: '👥',
      finance: '💰',
      personal: '⚡',
      general: '💭'
    };
    return icons[category] || icons.general;
  };

  const getCategoryColor = (category) => {
    const colors = {
      learning: '#3b82f6',
      health: '#10b981',
      career: '#8b5cf6',
      creativity: '#f59e0b',
      relationships: '#ef4444',
      finance: '#06b6d4',
      personal: '#6366f1',
      general: '#6b7280'
    };
    return colors[category] || colors.general;
  };

  const classifyIntention = (text) => {
    const lowerText = text.toLowerCase();
    
    const categories = {
      learning: /learn|study|course|skill|book|tutorial|education|knowledge/i,
      health: /exercise|diet|health|fitness|sleep|meditation|workout|wellness/i,
      career: /job|work|career|promotion|interview|resume|business/i,
      creativity: /create|write|draw|music|art|design|creative|project/i,
      relationships: /friend|family|relationship|social|meet|connect|love/i,
      finance: /money|save|invest|budget|buy|purchase|financial|earn/i,
      personal: /organize|clean|plan|goal|habit|routine|personal/i
    };

    for (const [category, pattern] of Object.entries(categories)) {
      if (pattern.test(lowerText)) {
        return category;
      }
    }

    return 'general';
  };

  const toggleDetails = (intentionId) => {
    setShowDetails(showDetails === intentionId ? null : intentionId);
  };

  const handleEdit = (intention) => {
    setEditingId(intention.storageId);
    setEditText(intention.text);
  };

  const handleSaveEdit = async (intention) => {
    if (!editText.trim()) return;

    try {
      const updatedIntention = {
        ...intention,
        text: editText.trim(),
        category: classifyIntention(editText.trim())
      };

      await EncryptedStorage.updateIntention(intention.storageId, updatedIntention);
      
      // Refresh intentions list
      if (onIntentionsChange) {
        const updatedIntentions = await EncryptedStorage.getAllIntentions();
        onIntentionsChange(updatedIntentions);
      }

      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Failed to update intention:', error);
      alert('Failed to update intention. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleShare = async (intention) => {
    try {
      const shareText = `💭 Intention: ${intention.text}\n📅 Captured: ${new Date(intention.timestamp).toLocaleDateString()}\n🏷️ Category: ${intention.category}\n\n✨ Shared from Ambient Intent Tracker`;
      
      if (navigator.share) {
        // Use native sharing if available
        await navigator.share({
          title: 'My Intention',
          text: shareText
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        
        // Show temporary success message
        const originalText = document.querySelector(`[data-share-id="${intention.storageId}"]`).textContent;
        const shareButton = document.querySelector(`[data-share-id="${intention.storageId}"]`);
        shareButton.textContent = '✅ Copied!';
        shareButton.style.background = '#10b981';
        
        setTimeout(() => {
          shareButton.textContent = originalText;
          shareButton.style.background = '';
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to share intention:', error);
      alert('Failed to share. Please try again.');
    }
  };

  const handleDelete = (intention) => {
    setDeleteConfirm(intention.storageId);
  };

  const confirmDelete = async (storageId) => {
    try {
      await EncryptedStorage.deleteIntention(storageId);
      
      // Refresh intentions list
      if (onIntentionsChange) {
        const updatedIntentions = await EncryptedStorage.getAllIntentions();
        onIntentionsChange(updatedIntentions);
      }

      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete intention:', error);
      alert('Failed to delete intention. Please try again.');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (intentions.length === 0) {
    return (
      <div className="intentions-list empty">
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <h3>No intentions captured yet</h3>
          <p>Start by typing your thoughts above or enable voice capture to begin collecting your ambient intentions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="intentions-list">
      <div className="list-header">
        <h3>Your Intentions ({intentions.length})</h3>
        
        <div className="list-controls">
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="category">By Category</option>
          </select>
        </div>
      </div>

      <div className="intentions-container">
        {filteredIntentions.map((intention, index) => (
          <div
            key={intention.storageId || index}
            className={`intention-item ${showDetails === intention.storageId ? 'expanded' : ''}`}
          >
            <div className="intention-main" onClick={() => toggleDetails(intention.storageId)}>
              <div className="intention-content">
                <div className="intention-header">
                  <span
                    className="category-badge"
                    style={{ backgroundColor: getCategoryColor(intention.category) }}
                  >
                    {getCategoryIcon(intention.category)} {intention.category}
                  </span>
                  <span className="source-badge">
                    {intention.source === 'voice' ? '🎤' : '⌨️'}
                  </span>
                </div>
                
                <div className="intention-text">
                  {editingId === intention.storageId ? (
                    <div className="edit-container" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="edit-textarea"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSaveEdit(intention);
                          }
                          if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                      />
                      <div className="edit-actions">
                        <button 
                          onClick={() => handleSaveEdit(intention)}
                          className="save-btn"
                        >
                          ✅ Save
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="cancel-btn"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    intention.text
                  )}
                </div>
                
                <div className="intention-meta">
                  <span className="timestamp">{formatTime(intention.timestamp)}</span>
                  <button className="details-toggle">
                    {showDetails === intention.storageId ? 'Less' : 'More'}
                  </button>
                </div>
              </div>
            </div>

            {showDetails === intention.storageId && (
              <div className="intention-details">
                <div className="details-grid">
                  <div className="detail-item">
                    <strong>Captured:</strong>
                    <span>{new Date(intention.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Source:</strong>
                    <span>{intention.source === 'voice' ? 'Voice Recognition' : 'Manual Input'}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Category:</strong>
                    <span>{intention.category.charAt(0).toUpperCase() + intention.category.slice(1)}</span>
                  </div>
                  {intention.confidence && (
                    <div className="detail-item">
                      <strong>Confidence:</strong>
                      <span>{intention.confidence}</span>
                    </div>
                  )}
                </div>
                
                <div className="intention-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEdit(intention)}
                    disabled={editingId === intention.storageId}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="action-btn share"
                    onClick={() => handleShare(intention)}
                    data-share-id={intention.storageId}
                  >
                    📤 Share
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(intention)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredIntentions.length === 0 && filter !== 'all' && (
        <div className="no-results">
          <p>No intentions found for "{filter}" category.</p>
          <button onClick={() => setFilter('all')} className="reset-filter">
            Show All
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="delete-modal">
          <div className="modal-backdrop" onClick={cancelDelete}></div>
          <div className="modal-content">
            <h3>🗑️ Delete Intention</h3>
            <p>Are you sure you want to delete this intention? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="btn-secondary">
                Cancel
              </button>
              <button 
                onClick={() => confirmDelete(deleteConfirm)} 
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntentionsList;