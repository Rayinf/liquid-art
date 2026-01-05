
import React, { useState, useEffect } from 'react';

interface TypewriterProps {
    text: string;
    speed?: number;
    delay?: number;
    onComplete?: () => void;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 40, delay = 0, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setIsStarted(true);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!isStarted) return;

        let currentIdx = 0;
        const interval = setInterval(() => {
            setDisplayedText(text.substring(0, currentIdx + 1));
            currentIdx++;

            if (currentIdx >= text.length) {
                clearInterval(interval);
                onComplete?.();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, isStarted, onComplete]);

    return (
        <div className="font-pixel text-[14px] leading-relaxed text-slate-300">
            {displayedText}
            {isStarted && displayedText.length < text.length && (
                <span className="inline-block w-2 h-4 bg-brand-gold ml-1 animate-pulse"></span>
            )}
        </div>
    );
};

export default Typewriter;
