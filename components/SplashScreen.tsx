import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
    onVideoEnd: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onVideoEnd }) => {
    useEffect(() => {
        // Fallback safety timeout (4 seconds)
        const timer = setTimeout(() => {
            onVideoEnd();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onVideoEnd]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
            <video
                src={`${import.meta.env.BASE_URL}loading.mp4`}
                autoPlay
                muted
                playsInline
                onEnded={onVideoEnd}
                className="max-w-full max-h-full object-contain"
            />
        </motion.div>
    );
};

export default SplashScreen;
