import React, { useState } from 'react';
import { CivicAction } from '../types';
import Header from '../components/Header';

interface CivicActionsScreenProps {
  onBack?: () => void;
  onActionSelect: (action: CivicAction) => void;
}

const CivicActionsScreen: React.FC<CivicActionsScreenProps> = ({
  onBack,
  onActionSelect,
}) => {
  const [activeTab, setActiveTab] = useState('all');

  // Mock civic actions data
  const civicActions: CivicAction[] = [
    {
      id: '1',
      title: 'Report Damaged Signage',
      description: 'Notify city heritage department about damaged plaque.',
      type: 'report',
      icon: '📋',
      participantCount: 5,
    },
    {
      id: '2',
      title: 'Weekend Clean-up',
      description: 'Volunteer this Saturday, 8 AM, to reduce litter.',
      type: 'volunteer',
      icon: '🧹',
      deadline: 'Saturday, 8 AM',
      participantCount: 12,
    },
    {
      id: '3',
      title: 'Petition for New Lighting',
      description: 'Sign petition for improved night time safety.',
      type: 'petition',
      icon: '💡',
      participantCount: 47,
    },
    {
      id: '4',
      title: 'Heritage Survey',
      description: 'Share your thoughts on heritage preservation.',
      type: 'survey',
      icon: '📊',
      deadline: 'End of month',
      participantCount: 23,
    },
    {
      id: '5',
      title: 'Report Graffiti',
      description: 'Report vandalism on historic structures.',
      type: 'report',
      icon: '🚫',
      participantCount: 2,
    },
    {
      id: '6',
      title: 'Tree Planting Drive',
      description: 'Join us in beautifying the heritage district.',
      type: 'volunteer',
      icon: '🌳',
      deadline: 'Next Sunday',
      participantCount: 28,
    },
  ];

  const filterActions = (type: string) => {
    if (type === 'all') return civicActions;
    return civicActions.filter(action => action.type === type);
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'report': return '#3498db';
      case 'volunteer': return '#2ecc71';
      case 'petition': return '#e74c3c';
      case 'survey': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const getActionButton = (action: CivicAction) => {
    switch (action.type) {
      case 'report':
        return { text: 'Report Now', color: '#3498db' };
      case 'volunteer':
        return { text: 'RSVP', color: '#2ecc71' };
      case 'petition':
        return { text: 'Sign Petition', color: '#e74c3c' };
      case 'survey':
        return { text: 'Take Survey', color: '#f39c12' };
      default:
        return { text: 'Join', color: '#95a5a6' };
    }
  };

  const tabs = [
    { id: 'all', label: 'All', count: civicActions.length },
    { id: 'report', label: 'Reports', count: civicActions.filter(a => a.type === 'report').length },
    { id: 'volunteer', label: 'Volunteer', count: civicActions.filter(a => a.type === 'volunteer').length },
    { id: 'petition', label: 'Petitions', count: civicActions.filter(a => a.type === 'petition').length },
  ];

  return (
    <div className="app-container">
      <Header 
        title="Civic Actions" 
        showBackButton={!!onBack}
        onBackClick={onBack}
      />
      
      <div className="screen">
        {/* Header Info */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>
            Engagement at Od Gate
          </h2>
          <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.5' }}>
            Make a difference in your community by participating in these civic activities.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e1e5e9',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '8px 16px',
                cursor: 'pointer',
                color: activeTab === tab.id ? '#5dade2' : '#666',
                fontWeight: activeTab === tab.id ? '600' : '400',
                borderBottom: activeTab === tab.id ? '2px solid #5dade2' : '2px solid transparent',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                minHeight: 'auto',
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Actions List */}
        <div style={{ marginBottom: '80px' }}>
          {filterActions(activeTab).map((action, index) => {
            const buttonStyle = getActionButton(action);
            
            return (
              <div
                key={action.id}
                className="card"
                style={{ 
                  marginBottom: '16px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div
                    style={{
                      background: getActionColor(action.type),
                      borderRadius: '12px',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '20px',
                    }}
                  >
                    {action.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: '1.125rem', 
                      fontWeight: '600',
                      color: '#333'
                    }}>
                      {action.title}
                    </h3>
                    <p style={{ 
                      margin: '0 0 12px 0', 
                      color: '#666', 
                      fontSize: '0.95rem',
                      lineHeight: '1.5' 
                    }}>
                      {action.description}
                    </p>
                    
                    {/* Meta info */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px',
                      marginBottom: '16px',
                      fontSize: '0.875rem',
                      color: '#666'
                    }}>
                      {action.participantCount && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>👥</span>
                          {action.participantCount} participants
                        </div>
                      )}
                      {action.deadline && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>⏰</span>
                          {action.deadline}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionSelect(action);
                  }}
                  style={{
                    width: '100%',
                    background: buttonStyle.color,
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${buttonStyle.color}40`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {buttonStyle.text}
                </button>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filterActions(activeTab).length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏛️</div>
            <h3 style={{ marginBottom: '8px' }}>No actions available</h3>
            <p>Check back later for new civic engagement opportunities.</p>
          </div>
        )}

        {/* Footer info */}
        <div style={{ 
          position: 'fixed',
          bottom: '90px',
          left: '16px',
          right: '16px',
          background: 'rgba(93, 173, 226, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(93, 173, 226, 0.2)'
        }}>
          <p style={{ 
            margin: '0', 
            fontSize: '0.875rem', 
            color: '#5dade2',
            fontWeight: '500'
          }}>
            💫 Your participation helps preserve our heritage for future generations
          </p>
        </div>
      </div>
    </div>
  );
};

export default CivicActionsScreen;