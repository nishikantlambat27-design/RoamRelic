import React, { useState, useRef, useCallback } from 'react';

interface MediaCaptureProps {
  onPhotoCapture?: (photoBlob: Blob) => void;
  onAudioCapture?: (audioBlob: Blob) => void;
  onError?: (error: string) => void;
}

const MediaCapture: React.FC<MediaCaptureProps> = ({
  onPhotoCapture,
  onAudioCapture,
  onError,
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera for monument scanning
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      onError?.(`Camera access denied: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [onError]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob && onPhotoCapture) {
        onPhotoCapture(blob);
      }
    }, 'image/jpeg', 0.9);

    stopCamera();
  }, [onPhotoCapture, stopCamera]);

  // Start audio recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        onAudioCapture?.(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      onError?.(`Microphone access denied: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [onAudioCapture, onError]);

  // Stop audio recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  }, [isRecording]);

  // Format recording time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {/* Camera View */}
      {isCameraActive && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'black',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              flex: 1,
              width: '100%',
              objectFit: 'cover',
            }}
          />
          
          {/* Camera Controls */}
          <div style={{
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <button
              onClick={stopCamera}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            
            <button
              onClick={capturePhoto}
              style={{
                background: 'white',
                border: '4px solid #ccc',
                borderRadius: '50%',
                width: '70px',
                height: '70px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              📷
            </button>
            
            <div style={{ width: '50px' }}></div> {/* Spacer */}
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Media Controls */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        {/* Camera Button */}
        <button
          onClick={startCamera}
          disabled={isCameraActive}
          style={{
            flex: 1,
            background: '#3498db',
            border: 'none',
            color: 'white',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: '500',
            opacity: isCameraActive ? 0.6 : 1,
          }}
        >
          📷 Scan Monument
        </button>

        {/* Audio Recording Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            flex: 1,
            background: isRecording ? '#e74c3c' : '#2ecc71',
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
          {isRecording ? (
            <>🔴 Stop ({formatTime(recordingTime)})</>
          ) : (
            <>🎤 Record Audio</>
          )}
        </button>
      </div>
    </div>
  );
};

export default MediaCapture;