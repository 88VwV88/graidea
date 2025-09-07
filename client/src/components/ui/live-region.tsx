import React, { useEffect, useRef } from 'react';
import { createLiveRegionAriaProps, generateAriaId } from '../../lib/aria-utils';

export interface LiveRegionProps {
  /**
   * The message to announce
   */
  message: string;
  /**
   * Priority level for the announcement
   */
  priority?: 'polite' | 'assertive' | 'off';
  /**
   * Whether the region should be atomic (announce all content at once)
   */
  atomic?: boolean;
  /**
   * Custom ID for the live region
   */
  id?: string;
  /**
   * Whether the region should be visible to screen readers only
   */
  srOnly?: boolean;
  /**
   * Custom className for styling
   */
  className?: string;
  /**
   * Whether to clear the message after a delay
   */
  clearAfter?: number;
}

/**
 * LiveRegion component for announcing dynamic content to screen readers
 */
export const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  priority = 'polite',
  atomic = false,
  id,
  srOnly = true,
  className = '',
  clearAfter,
}) => {
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const liveRegionId = id || generateAriaId('live-region');

  useEffect(() => {
    if (message && liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
    }
  }, [message]);

  useEffect(() => {
    if (clearAfter && message) {
      const timer = setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, clearAfter);

      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  const liveRegionProps = createLiveRegionAriaProps(atomic, priority);

  return (
    <div
      ref={liveRegionRef}
      id={liveRegionId}
      className={`${srOnly ? 'sr-only' : ''} ${className}`}
      {...liveRegionProps}
      aria-atomic={atomic.toString()}
    />
  );
};

export default LiveRegion;
