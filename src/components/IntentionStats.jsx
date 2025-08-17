import React, { useMemo } from 'react';
import '../styles/components.css';

const IntentionStats = ({ intentions }) => {
  const stats = useMemo(() => {
    if (!intentions || intentions.length === 0) {
      return {
        total: 0,
        today: 0,
        thisWeek: 0,
        bySource: { manual: 0, voice: 0 },
        byCategory: {},
        streak: 0,
        avgPerDay: 0
      };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));

    // Calculate basic metrics
    const todayCount = intentions.filter(i => 
      new Date(i.timestamp) >= today
    ).length;

    const thisWeekCount = intentions.filter(i => 
      new Date(i.timestamp) >= weekAgo
    ).length;

    // Count by source
    const bySource = intentions.reduce((acc, intention) => {
      acc[intention.source] = (acc[intention.source] || 0) + 1;
      return acc;
    }, { manual: 0, voice: 0 });

    // Count by category
    const byCategory = intentions.reduce((acc, intention) => {
      const category = intention.category || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Calculate streak (consecutive days with intentions)
    let streak = 0;
    const intentionDates = [...new Set(
      intentions.map(i => 
        new Date(i.timestamp).toDateString()
      )
    )].sort((a, b) => new Date(b) - new Date(a));

    for (let i = 0; i < intentionDates.length; i++) {
      const currentDate = new Date(intentionDates[i]);
      const expectedDate = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
      
      if (currentDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    // Calculate average per day
    const oldestIntention = intentions.reduce((oldest, current) => 
      current.timestamp < oldest.timestamp ? current : oldest
    , intentions[0]);
    
    const daysSinceFirst = Math.max(1, Math.ceil(
      (now.getTime() - oldestIntention.timestamp) / (24 * 60 * 60 * 1000)
    ));
    
    const avgPerDay = Math.round((intentions.length / daysSinceFirst) * 10) / 10;

    return {
      total: intentions.length,
      today: todayCount,
      thisWeek: thisWeekCount,
      bySource,
      byCategory,
      streak,
      avgPerDay
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

  if (stats.total === 0) {
    return (
      <div className="intention-stats empty">
        <h3>📊 Your Stats</h3>
        <div className="empty-stats">
          <span>🌱</span>
          <p>Start capturing intentions to see your insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="intention-stats">
      <h3>📊 Your Insights</h3>
      
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
          <div className="stat-value">{stats.streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.avgPerDay}</div>
          <div className="stat-label">Avg / Day</div>
        </div>
      </div>

      <div className="stats-details">
        <div className="stat-section">
          <h4>📈 Recent Activity</h4>
          <div className="activity-metrics">
            <div className="metric">
              <span className="metric-label">This Week</span>
              <span className="metric-value">{stats.thisWeek}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Growth Trend</span>
              <span className="metric-value">
                {stats.thisWeek > 7 ? '📈 Up' : stats.thisWeek === 7 ? '➡️ Steady' : '📉 Down'}
              </span>
            </div>
          </div>
        </div>

        <div className="stat-section">
          <h4>🎙️ Input Sources</h4>
          <div className="source-breakdown">
            <div className="source-item">
              <span className="source-icon">⌨️</span>
              <span className="source-label">Manual</span>
              <span className="source-count">{stats.bySource.manual}</span>
              <div className="source-bar">
                <div 
                  className="source-fill manual"
                  style={{ 
                    width: `${(stats.bySource.manual / stats.total) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="source-item">
              <span className="source-icon">🎤</span>
              <span className="source-label">Voice</span>
              <span className="source-count">{stats.bySource.voice}</span>
              <div className="source-bar">
                <div 
                  className="source-fill voice"
                  style={{ 
                    width: `${(stats.bySource.voice / stats.total) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-section">
          <h4>🏷️ Top Categories</h4>
          <div className="category-breakdown">
            {Object.entries(stats.byCategory)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([category, count]) => (
                <div key={category} className="category-item">
                  <span className="category-icon">
                    {getCategoryIcon(category)}
                  </span>
                  <span className="category-label">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                  <span className="category-count">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {stats.streak >= 5 && (
        <div className="achievement-badge">
          <span className="achievement-icon">🔥</span>
          <span>On fire! {stats.streak} day streak!</span>
        </div>
      )}
    </div>
  );
};

export default IntentionStats;