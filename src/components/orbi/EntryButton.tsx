import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useOrbiStore } from '@/store/useOrbiStore';

export const EntryButton = () => {
    const { toggleOpen, isOpen } = useOrbiStore();

    if (isOpen) return null;

    return (
        <motion.button
            onClick={toggleOpen}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center z-50 group"
        >
            {/* Gradient Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF5BB2] via-[#A653FF] to-[#4B9DFF] p-[2px]">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#A653FF]" />
                </div>
            </div>

            {/* Pulse Effect */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#FF5BB2] to-[#4B9DFF] opacity-30 animate-ping" />
        </motion.button>
    );
};
