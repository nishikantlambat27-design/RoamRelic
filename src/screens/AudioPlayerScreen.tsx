import React, { useState, useEffect, useRef } from 'react';
import { AudioTrack, CivicAction } from '../types';
import Header from '../components/Header';

interface AudioPlayerScreenProps {
  track: AudioTrack;
  onBack: () => void;
  onCivicAction: (action: CivicAction) => void;
}

const AudioPlayerScreen: React.FC<AudioPlayerScreenProps> = ({
  track,
  onBack,
  onCivicAction,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mock civic actions data
  const civicActions: CivicAction[] = [
    {
      id: '1',
      title: 'Report damaged signage',
      description: 'Notify city heritage department about damaged plaque.',
      type: 'report',
      icon: '📋',
    },
    {
      id: '2',
      title: 'Join weekend clean-up',
      description: 'Volunteer this Saturday, 8 AM, to reduce litter.',
      type: 'volunteer',
      icon: '🧹',
    },
    {
      id: '3',
      title: 'Sign heritage petition',
      description: 'Support the preservation of this historical site.',
      type: 'petition',
      icon: '📝',
    },
  ];

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Update progress
  useEffect(() => {
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  }, [currentTime, duration]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 15);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 15);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercentage = clickX / rect.width;
    const newTime = clickPercentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="app-container">
      <Header 
        title="Audio Player" 
        showBackButton 
        onBackClick={onBack}
      />
      
      <div className="screen">
        {/* Audio element */}
        <audio
          ref={audioRef}
          src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" // Demo audio
          preload="metadata"
        />

        {/* Hero Image */}
        <div style={{ 
          height: '250px', 
          borderRadius: '12px', 
          overflow: 'hidden',
          position: 'relative',
          marginBottom: '24px'
        }}>
          <img
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
            alt="Old Fort Gate"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            color: 'white',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: '0', fontSize: '1.5rem', fontWeight: '600' }}>
              Welcome to the Old Fort Gate...
            </h2>
          </div>
        </div>

        {/* Audio Player */}
        <div className="audio-player">
          {/* Progress Bar */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.875rem', color: '#666' }}>
                {formatTime(currentTime)}
              </span>
              <span style={{ fontSize: '0.875rem', color: '#666' }}>
                {duration ? formatTime(duration) : track.duration || '0:42'}
              </span>
            </div>
            <div 
              className="audio-progress"
              onClick={handleProgressClick}
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="audio-progress-filled"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="audio-controls">
            <button
              className="audio-control-button"
              onClick={skipBackward}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M11,18V6L14.5,12M6,6V18L9.5,12L6,6Z" />
              </svg>
            </button>

            <button
              className="audio-control-button play"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M6,19H10V5H6V19ZM14,5V19H18V5H14Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
              )}
            </button>

            <button
              className="audio-control-button"
              onClick={skipForward}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M13,6V18L9.5,12M18,18V6L14.5,12L18,18Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Civic Actions Section */}
        <div className="card" style={{ marginTop: '24px' }}>
          <h3 style={{ 
            marginBottom: '16px', 
            fontSize: '1.125rem', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🏛️</span>
            Civic Actions
          </h3>
          
          {civicActions.map((action, index) => (
            <div
              key={action.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 8px',
                borderBottom: index < civicActions.length - 1 ? '1px solid #f0f0f0' : 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                borderRadius: '8px',
                margin: '-8px',
              }}
              onClick={() => onCivicAction(action)}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div
                style={{
                  background: action.type === 'report' ? '#3498db' : 
                            action.type === 'volunteer' ? '#2ecc71' : '#e74c3c',
                  borderRadius: '8px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '18px',
                }}
              >
                {action.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '500' }}>
                  {action.title}
                </h4>
                <div style={{ color: '#666', fontSize: '0.875rem', lineHeight: '1.4' }}>
                  {action.description}
                </div>
              </div>
              <svg viewBox="0 0 24 24" fill="#666" width="20" height="20">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '32px', 
          padding: '16px',
          background: '#f8f9fa',
          borderRadius: '12px',
          color: '#666'
        }}>
          <p style={{ margin: '0', fontSize: '0.875rem', lineHeight: '1.5' }}>
            🎧 Use headphones for the best audio experience
            <br />
            📱 Swipe up for more heritage stories
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerScreen;