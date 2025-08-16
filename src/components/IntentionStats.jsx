import React, { useMemo } from 'react';
import '../styles/components.css';

const IntentionStats = ({ intentions }) => {
  const stats = useMemo(() => {
    if (!intentions || intentions.length === 0) {
      return {
        total: 0,
        today: 0,
        thisWeek: 0,
        byCategory: {},
        bySource: { voice: 0, manual: 0 },
        streak: 0,
        averagePerDay: 0
      };
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - 7);

    let today = 0;
    let thisWeek = 0;
    const byCategory = {};
    const bySource = { voice: 0, manual: 0 };
    const dailyCounts = {};

    intentions.forEach(intention => {
      const intentionDate = new Date(intention.timestamp);
      
      // Count today's intentions
      if (intentionDate >= todayStart) {
        today++;
      }
      
      // Count this week's intentions
      if (intentionDate >= weekStart) {
        thisWeek++;
      }

      // Count by category
      const category = intention.category || 'general';
      byCategory[category] = (byCategory[category] || 0) + 1;

      // Count by source
      if (intention.source === 'voice') {
        bySource.voice++;
      } else {
        bySource.manual++;
      }

      // Count daily for streak calculation
      const dateKey = intentionDate.toDateString();
      dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
    });

    // Calculate streak
    let streak = 0;
    const currentDate = new Date(todayStart);
    
    while (true) {
      const dateKey = currentDate.toDateString();
      if (dailyCounts[dateKey] && dailyCounts[dateKey] > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate average per day
    const oldestIntention = intentions.reduce((oldest, intention) => {
      return intention.timestamp < oldest ? intention.timestamp : oldest;
    }, Date.now());
    
    const daysSinceFirst = Math.max(1, Math.ceil((Date.now() - oldestIntention) / (1000 * 60 * 60 * 24)));
    const averagePerDay = intentions.length / daysSinceFirst;

    return {
      total: intentions.length,
      today,
      thisWeek,
      byCategory,
      bySource,
      streak,
      averagePerDay
    };
  }, [intentions]);

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

  const getTopCategories = () => {
    return Object.entries(stats.byCategory)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

  if (stats.total === 0) {
    return (
      <div className="intention-stats empty">
        <div className="stats-header">
          <h3>📊 Your Stats</h3>
        </div>
        <div className="empty-stats">
          <p>Start capturing intentions to see your patterns!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="intention-stats">
      <div className="stats-header">
        <h3>📊 Your Stats</h3>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Intentions</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.today}</div>
          <div className="stat-label">Today</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.thisWeek}</div>
          <div className="stat-label">This Week</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      <div className="stats-details">
        <div className="stat-section">
          <h4>📱 Input Sources</h4>
          <div className="source-breakdown">
            <div className="source-item">
              <span className="source-icon">🎤</span>
              <span className="source-label">Voice</span>
              <span className="source-count">{stats.bySource.voice}</span>
              <div className="source-bar">
                <div 
                  className="source-fill voice"
                  style={{ 
                    width: `${stats.total ? (stats.bySource.voice / stats.total) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
            <div className="source-item">
              <span className="source-icon">⌨️</span>
              <span className="source-label">Manual</span>
              <span className="source-count">{stats.bySource.manual}</span>
              <div className="source-bar">
                <div 
                  className="source-fill manual"
                  style={{ 
                    width: `${stats.total ? (stats.bySource.manual / stats.total) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-section">
          <h4>🎯 Top Categories</h4>
          <div className="category-breakdown">
            {getTopCategories().map(([category, count]) => (
              <div key={category} className="category-item">
                <span className="category-icon">{getCategoryIcon(category)}</span>
                <span className="category-label">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                <span className="category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-section">
          <h4>⚡ Activity</h4>
          <div className="activity-metrics">
            <div className="metric">
              <span className="metric-label">Average per day</span>
              <span className="metric-value">
                {stats.averagePerDay.toFixed(1)}
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Most active day</span>
              <span className="metric-value">
                {stats.today > 0 ? 'Today' : 'Yesterday'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {stats.streak > 0 && (
        <div className="achievement-badge">
          <span className="achievement-icon">🔥</span>
          <span className="achievement-text">
            {stats.streak} day{stats.streak !== 1 ? 's' : ''} of capturing intentions!
          </span>
        </div>
      )}
    </div>
  );
};

export default IntentionStats;