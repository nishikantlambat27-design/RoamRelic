import React, { useState } from 'react';
import { Location } from '../types';
import Header from '../components/Header';
import MediaCapture from '../components/MediaCapture';

interface POIDetailScreenProps {
  location: Location;
  onBack: () => void;
  onPlayAudio: (location: Location) => void;
  onReportDamage: () => void;
  onJoinPetition: () => void;
}

const POIDetailScreen: React.FC<POIDetailScreenProps> = ({
  location,
  onBack,
  onPlayAudio,
  onReportDamage,
  onJoinPetition,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<{
    photos: Blob[];
    recordings: Blob[];
  }>({ photos: [], recordings: [] });

  // Handle photo capture
  const handlePhotoCapture = (photoBlob: Blob) => {
    setCapturedMedia(prev => ({
      ...prev,
      photos: [...prev.photos, photoBlob]
    }));
    
    // Create a URL for preview
    const photoUrl = URL.createObjectURL(photoBlob);
    console.log('Photo captured:', photoUrl);
    alert('Photo captured successfully! This would typically be uploaded to the server.');
  };

  // Handle audio capture
  const handleAudioCapture = (audioBlob: Blob) => {
    setCapturedMedia(prev => ({
      ...prev,
      recordings: [...prev.recordings, audioBlob]
    }));
    
    // Create a URL for preview
    const audioUrl = URL.createObjectURL(audioBlob);
    console.log('Audio captured:', audioUrl);
    alert('Audio recording saved! This would typically be processed and uploaded.');
  };

  // Handle media capture errors
  const handleMediaError = (error: string) => {
    alert(`Media Error: ${error}`);
  };

  return (
    <div className="app-container">
      <Header 
        title="POI Detail" 
        showBackButton 
        onBackClick={onBack}
      />
      
      <div className="screen" style={{ padding: 0 }}>
        {/* Hero Image */}
        <div style={{ position: 'relative', height: '250px', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
            alt={location.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: imageLoaded ? 'none' : 'blur(5px)',
              transition: 'filter 0.3s ease',
            }}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Play button overlay */}
          {location.audioUrl && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => onPlayAudio(location)}
            >
              <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
              </svg>
            </div>
          )}

          {/* Watch story text overlay */}
          {location.audioTitle && (
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
              </svg>
              {location.audioTitle}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          {/* Title and basic info */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
              {location.name}
            </h1>
            {location.distance && (
              <div style={{ color: '#666', fontSize: '0.875rem', marginBottom: '16px' }}>
                📍 {location.distance}
              </div>
            )}
            <p style={{ lineHeight: '1.6', color: '#444', fontSize: '1rem' }}>
              {location.description}
            </p>
          </div>

          {/* Audio section */}
          {location.audioUrl && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                }}
                onClick={() => onPlayAudio(location)}
              >
                <div
                  style={{
                    background: '#5dade2',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                    <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '600' }}>
                    Play narration
                  </h3>
                  <div style={{ color: '#666', fontSize: '0.875rem' }}>
                    {location.audioDuration || '0:42'}
                  </div>
                </div>
                <svg viewBox="0 0 24 24" fill="#5dade2" width="20" height="20">
                  <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              </div>
            </div>
          )}

          {/* Civic Actions */}
          <div className="card">
            <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', fontWeight: '600' }}>
              Civic Actions
            </h3>
            
            {/* Report Damage */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
              }}
              onClick={onReportDamage}
            >
              <div
                style={{
                  background: '#3498db',
                  borderRadius: '8px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: '20px' }}>📋</span>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '500' }}>
                  Report damaged signage
                </h4>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>
                  Notify city heritage department about damaged plaque.
                </div>
              </div>
              <svg viewBox="0 0 24 24" fill="#666" width="20" height="20">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </div>

            {/* Join Petition */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 0',
                cursor: 'pointer',
              }}
              onClick={onJoinPetition}
            >
              <div
                style={{
                  background: '#2ecc71',
                  borderRadius: '8px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: '20px' }}>📝</span>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '500' }}>
                  Join heritage petition
                </h4>
                <div style={{ color: '#666', fontSize: '0.875rem' }}>
                  Support the preservation of this historical site.
                </div>
              </div>
              <svg viewBox="0 0 24 24" fill="#666" width="20" height="20">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </div>
          </div>

          {/* Monument Scanning */}
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem', fontWeight: '600' }}>
              📸 Scan This Monument
            </h3>
            <div style={{ color: '#666', fontSize: '0.875rem', marginBottom: '16px' }}>
              Use your camera to capture details or record audio notes about this heritage site.
            </div>
            <MediaCapture
              onPhotoCapture={handlePhotoCapture}
              onAudioCapture={handleAudioCapture}
              onError={handleMediaError}
            />
          </div>

          {/* Share and Upload buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              style={{
                flex: 1,
                background: 'white',
                border: '2px solid #5dade2',
                color: '#5dade2',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: '500',
              }}
            >
              📤 Upload photo
            </button>
            <button
              style={{
                flex: 1,
                background: '#5dade2',
                border: 'none',
                color: 'white',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: '500',
              }}
            >
              📱 Share a story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POIDetailScreen;