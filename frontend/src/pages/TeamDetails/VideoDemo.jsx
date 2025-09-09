import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiPlay, FiPause } from "react-icons/fi";

const VideoDemo = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePlayPause = () => {
    try {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play()
            .then(() => {
              setIsPlaying(true);
              setShowFeatures(true);
            })
            .catch(err => {
              setError("Failed to play video. Please try again.");
              console.error("Video play error:", err);
            });
        }
        setIsPlaying(!isPlaying);
      }
    } catch (err) {
      setError("Video playback error occurred");
      console.error("Playback error:", err);
    }
  };

  const handleVideoReady = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleVideoError = () => {
    setError("Failed to load video");
    setIsLoading(false);
  };

  const features = [
    { icon: "⏱️", title: "Automatic Highlights", desc: "AI detects key moments" },
    { icon: "📊", title: "Live Stats", desc: "Real-time player analytics" },
    { icon: "✂️", title: "Easy Editing", desc: "Trim and share instantly" },
    { icon: "📱", title: "Mobile Ready", desc: "Works on all devices" }
  ];

  return (
    <div className="relative pb-20">
      <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black">
        {/* Video Element */}
        <video
          ref={videoRef}
          loop
          controls={isPlaying}
          src="/motivation.mp4" // Replace with your actual video path
          poster="/video-poster.jpg"
          className="w-full aspect-video object-cover"
          onClick={handlePlayPause}
          onCanPlay={handleVideoReady}
          onError={handleVideoError}
          preload="metadata"
        />
        
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-6 text-center">
            <div className="text-red-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Video Error</h3>
            <p className="text-white/80 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Play Button Overlay */}
        {!isPlaying && !isLoading && !error && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={handlePlayPause}
          >
            <div className="text-center p-6">
              <motion.button
                className="h-24 w-24 bg-violet-600 hover:bg-violet-700 rounded-full flex items-center justify-center shadow-xl mb-6"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
              >
                <FiPlay size={40} className="text-white ml-1" />
              </motion.button>
              <motion.h1 
                className="text-4xl font-bold text-white mb-4"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                See How It Works
              </motion.h1>
              <p className="text-xl text-white/80 mb-6">
                Watch our platform in action
              </p>
            </div>
          </motion.div>
        )}

        {/* Features Overlay */}
        {isPlaying && showFeatures && !error && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-white text-xl font-bold mb-4">Key Features:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h4 className="font-bold">{feature.title}</h4>
                  <p className="text-sm text-white/70">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Pause Button */}
      {isPlaying && !error && (
        <div className="flex justify-center mt-6">
          <motion.button
            onClick={handlePlayPause}
            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <FiPause /> Pause Demo
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default VideoDemo;