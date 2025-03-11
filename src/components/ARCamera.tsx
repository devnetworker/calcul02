'use client';

import React, { useRef, useState, useEffect } from 'react';
import styles from './ARCamera.module.css';

type ARCameraProps = {
  onDetection?: (count: number) => void;
};

const ARCamera: React.FC<ARCameraProps> = ({ onDetection }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detectedCount, setDetectedCount] = useState<number>(0);
  const [hasNavigator, setHasNavigator] = useState(false);

  // Check if navigator is available (client-side only)
  useEffect(() => {
    setHasNavigator(typeof navigator !== 'undefined' && !!navigator.mediaDevices);
  }, []);

  // Start the camera
  const startCamera = async () => {
    try {
      if (!videoRef.current || !hasNavigator) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      videoRef.current.srcObject = stream;
      setIsActive(true);
      setErrorMessage(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setErrorMessage('Could not access camera. Please check permissions.');
      setIsActive(false);
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setIsActive(false);
  };

  // Toggle camera on/off
  const toggleCamera = () => {
    if (isActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Simulate object detection (in a real app, this would use a computer vision library)
  const simulateObjectDetection = () => {
    if (!canvasRef.current || !videoRef.current || !isActive) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    
    // Draw the current video frame to the canvas
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    
    // Simulate detection by generating a random count (1-10)
    // In a real app, this would use computer vision to count objects
    const count = Math.floor(Math.random() * 10) + 1;
    setDetectedCount(count);
    
    if (onDetection) {
      onDetection(count);
    }
    
    // Draw detection overlay
    context.strokeStyle = '#00ff00';
    context.lineWidth = 3;
    context.strokeRect(
      canvasRef.current.width * 0.2,
      canvasRef.current.height * 0.2,
      canvasRef.current.width * 0.6,
      canvasRef.current.height * 0.6
    );
    
    // Add text showing the count
    context.font = '24px Arial';
    context.fillStyle = '#ffffff';
    context.fillText(
      `Detected: ${count} objects`,
      20,
      40
    );
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className={styles.arCamera}>
      <div className={styles.cameraContainer}>
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={640}
          height={480}
        />
        
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
        
        {!isActive && (
          <div className={styles.startPrompt}>
            Click the camera button to start
          </div>
        )}
      </div>
      
      <div className={styles.controls}>
        <button
          className={`${styles.cameraButton} ${isActive ? styles.active : ''}`}
          onClick={toggleCamera}
          aria-label={isActive ? 'Stop camera' : 'Start camera'}
          disabled={!hasNavigator}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 15V17M6 12H3M6 12C6 16.4183 9.58172 20 14 20C18.4183 20 22 16.4183 22 12C22 7.58172 18.4183 4 14 4C9.58172 4 6 7.58172 6 12ZM14 8V10" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
          </svg>
        </button>
        
        {isActive && (
          <button
            className={styles.detectButton}
            onClick={simulateObjectDetection}
            aria-label="Detect objects"
          >
            Detect Objects
          </button>
        )}
      </div>
      
      {detectedCount > 0 && (
        <div className={styles.detectionResult}>
          <p>Detected {detectedCount} objects</p>
          <button 
            className={styles.useCountButton}
            onClick={() => onDetection && onDetection(detectedCount)}
          >
            Use this count in calculator
          </button>
        </div>
      )}
      
      {!hasNavigator && (
        <div className={styles.errorMessage}>
          Camera API is not available in your browser or device.
        </div>
      )}
    </div>
  );
};

export default ARCamera; 