'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * Options for the typewriter hook
 */
interface UseTypewriterOptions {
  /** Typing speed in milliseconds */
  typingSpeed?: number;
  /** Deleting speed in milliseconds */
  deletingSpeed?: number;
  /** Pause duration after completing a word in milliseconds */
  pauseDuration?: number;
}

/**
 * Return type for the typewriter hook
 */
interface UseTypewriterReturn {
  /** The current displayed text */
  text: string;
  /** Whether the typewriter is currently typing */
  isTyping: boolean;
  /** Whether the typewriter is currently deleting */
  isDeleting: boolean;
}

/**
 * A custom hook that creates a typewriter effect for cycling through text strings.
 *
 * @param texts - Array of strings to cycle through
 * @param options - Configuration options for typing and deleting speeds
 * @returns The current displayed text and typing state
 *
 * @example
 * ```tsx
 * const { text } = useTypewriter(['Developer', 'Designer', 'Creator']);
 * return <span>{text}|</span>;
 * ```
 */
export function useTypewriter(
  texts: string[],
  options: UseTypewriterOptions = {}
): UseTypewriterReturn {
  const {
    typingSpeed = 80,
    deletingSpeed = typingSpeed / 2,
    pauseDuration = 2000,
  } = options;

  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Use refs to avoid stale closures
  const textsRef = useRef(texts);
  textsRef.current = texts;

  const currentText = textsRef.current[textIndex] || '';

  useEffect(() => {
    if (texts.length === 0) return;

    // Handle pause state
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimeout);
    }

    const speed = isDeleting ? deletingSpeed : typingSpeed;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        if (charIndex < currentText.length) {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          // Finished typing, start pause
          setIsPaused(true);
        }
      } else {
        // Deleting backward
        if (charIndex > 0) {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [texts, textIndex, charIndex, isDeleting, isPaused, typingSpeed, deletingSpeed, pauseDuration, currentText]);

  return {
    text: displayText,
    isTyping: !isDeleting && !isPaused,
    isDeleting,
  };
}

export default useTypewriter;
