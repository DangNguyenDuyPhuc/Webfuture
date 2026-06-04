import React, { useEffect, useRef } from 'react';

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4";

export const VideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);
  const opacityRef = useRef<number>(0);

  const animateFade = (targetOpacity: number, duration: number, callback?: () => void) => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    
    const startTime = performance.now();
    const startOpacity = opacityRef.current;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
      opacityRef.current = currentOpacity;
      
      if (videoRef.current) {
        videoRef.current.style.opacity = currentOpacity.toString();
      }
      
      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        rafIdRef.current = null;
        if (callback) callback();
      }
    };
    
    rafIdRef.current = requestAnimationFrame(animate);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const remainingTime = video.duration - video.currentTime;

    // Trigger fade out 0.55s before the end
    if (remainingTime <= 0.55 && !fadingOutRef.current && !video.paused) {
      fadingOutRef.current = true;
      animateFade(0, 500);
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    // Reset state
    video.style.opacity = '0';
    opacityRef.current = 0;
    fadingOutRef.current = false;

    // Wait 100ms then reset and play
    setTimeout(() => {
      video.currentTime = 0;
      video.play().then(() => {
        animateFade(1, 500);
      });
    }, 100);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      video.play().then(() => {
        animateFade(1, 500);
      });
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover translate-y-[17%]"
        style={{ opacity: 0 }}
      />
    </div>
  );
};
