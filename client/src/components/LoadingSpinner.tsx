import React from 'react';
import { createProgressBarAriaProps, generateAriaId, ARIA_ROLE_PROGRESSBAR } from '../lib/aria-utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  /**
   * Progress value (0-100) for progress bar mode
   */
  progress?: number;
  /**
   * Whether to show as progress bar instead of spinner
   */
  showProgress?: boolean;
  /**
   * Custom ID for the loading element
   */
  id?: string;
  /**
   * Whether the loading state is complete
   */
  complete?: boolean;
  /**
   * Custom label for screen readers
   */
  ariaLabel?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...',
  progress,
  showProgress = false,
  id,
  complete = false,
  ariaLabel
}) => {
  const accessibleLabel = ariaLabel || text;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'md':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-8 w-8';
    }
  };

  const getProgressBarAriaProps = () => {
    if (showProgress && progress !== undefined) {
      return {
        role: ARIA_ROLE_PROGRESSBAR,
        'aria-valuenow': progress,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        ...(accessibleLabel && { 'aria-label': accessibleLabel }),
      };
    }
    return {
      role: ARIA_ROLE_PROGRESSBAR,
      'aria-label': accessibleLabel,
      'aria-busy': !complete,
    };
  };

  if (showProgress && progress !== undefined) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 w-full">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            {...getProgressBarAriaProps()}
          />
        </div>
        {text && (
          <p className="text-sm text-gray-600" aria-live="polite">
            {text} {progress !== undefined && `${Math.round(progress)}%`}
          </p>
        )}
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col items-center justify-center space-y-2"
      {...getProgressBarAriaProps()}
    >
      <div 
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${getSizeClasses()}`}
        aria-hidden="true"
      />
      {text && (
        <p className="text-sm text-gray-600" aria-live="polite">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
