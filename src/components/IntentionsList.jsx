import React, { useState, useMemo } from 'react';
import '../styles/components.css';

const IntentionsList = ({ intentions }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showDetails, setShowDetails] = useState(null);

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

  const toggleDetails = (intentionId) => {
    setShowDetails(showDetails === intentionId ? null : intentionId);
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
                  {intention.text}
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
                  <button className="action-btn edit">
                    ✏️ Edit
                  </button>
                  <button className="action-btn share">
                    📤 Share
                  </button>
                  <button className="action-btn delete">
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
    </div>
  );
};

export default IntentionsList;