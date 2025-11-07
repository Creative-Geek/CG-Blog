import React from 'react';

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    ease?: string;
    splitType?: 'chars' | 'words' | 'lines' | string;
    from?: Record<string, any>;
    to?: Record<string, any>;
    threshold?: number;
    rootMargin?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    onLetterAnimationComplete?: () => void;
}

declare const SplitText: React.FC<SplitTextProps>;
export default SplitText;
