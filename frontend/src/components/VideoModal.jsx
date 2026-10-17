import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiPlay, FiPause, FiVolume2, FiVolumeX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Full-screen "story style" player.
 *
 * videos: the full array shown in the slider
 * startIndex: which one was clicked
 * onClose: called when the modal should close
 */
const VideoModal = ({ videos, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0-1 for the current video

  const videoRef = useRef(null);

  const current = videos[index];

  const goTo = useCallback(
    (nextIndex) => {
      if (nextIndex < 0 || nextIndex >= videos.length) return;
      setProgress(0);
      setIndex(nextIndex);
      setIsPlaying(true);
    },
    [videos.length]
  );

  const goNext = useCallback(() => {
    if (index === videos.length - 1) {
      onClose();
      return;
    }
    goTo(index + 1);
  }, [index, videos.length, goTo, onClose]);

  const goPrev = useCallback(() => goTo(index - 1), [index, goTo]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goNext, goPrev]);

  // Lock background scroll while open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Play/pause the actual <video> element in sync with state
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isPlaying) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isPlaying, index]);

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    setProgress(el.currentTime / el.duration);
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="video-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <FiX size={20} />
        </button>

        {/* Progress segments (one per video, story-style) */}
        <div className="absolute left-4 right-4 top-4 z-20 flex gap-1.5 sm:left-1/2 sm:right-auto sm:w-[380px] sm:-translate-x-1/2">
          {videos.map((v, i) => (
            <div key={v._id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full bg-white"
                style={{
                  width: i < index ? '100%' : i === index ? `${progress * 100}%` : '0%',
                  transition: i === index ? 'width 0.1s linear' : 'none',
                }}
              />
            </div>
          ))}
        </div>

        {/* Prev / Next click zones + arrows (desktop) */}
        <button
          onClick={goPrev}
          disabled={index === 0}
          aria-label="Previous video"
          className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-0 sm:block"
        >
          <FiChevronLeft size={22} />
        </button>
        <button
          onClick={goNext}
          aria-label="Next video"
          className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:block"
        >
          <FiChevronRight size={22} />
        </button>

        {/* Video */}
        <motion.div
          key={current._id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="relative flex h-full max-h-[100dvh] w-full max-w-sm items-center justify-center sm:h-[90vh] sm:rounded-2xl"
        >
          <video
            ref={videoRef}
            src={current.videoUrl}
            poster={current.thumbnailUrl}
            className="h-full w-full object-contain sm:rounded-2xl"
            playsInline
            autoPlay
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onEnded={goNext}
            onClick={() => setIsPlaying((p) => !p)}
          />

          {/* Tap zones for mobile prev/next */}
          <button onClick={goPrev} aria-label="Previous video" className="absolute inset-y-0 left-0 z-10 w-1/3 sm:hidden" />
          <button onClick={goNext} aria-label="Next video" className="absolute inset-y-0 right-0 z-10 w-1/3 sm:hidden" />

          {/* Controls */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-3">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="rounded-full bg-white/15 p-2.5 text-white backdrop-blur hover:bg-white/25"
            >
              {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
            </button>
            <button
              onClick={() => setIsMuted((m) => !m)}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="rounded-full bg-white/15 p-2.5 text-white backdrop-blur hover:bg-white/25"
            >
              {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
            </button>
          </div>

          {current.title && (
            <div className="absolute bottom-4 left-4 z-20 max-w-[70%] text-sm font-medium text-white drop-shadow">
              {current.title}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default VideoModal;