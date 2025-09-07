import React, { useEffect, useRef } from 'react';
import { createLiveRegionAriaProps, generateAriaId, ARIA_ROLE_ALERT, ARIA_ROLE_ALERTDIALOG } from '../lib/aria-utils';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  /**
   * Whether the notification is dismissible
   */
  dismissible?: boolean;
  /**
   * Priority level for screen reader announcements
   */
  priority?: 'polite' | 'assertive';
  /**
   * Custom ID for the notification
   */
  id?: string;
  /**
   * Whether the notification should be treated as an alert dialog
   */
  isAlertDialog?: boolean;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
  dismissible = true,
  priority = 'polite',
  id,
  isAlertDialog = false,
}) => {
  const notificationRef = useRef<HTMLDivElement>(null);
  const notificationId = id || generateAriaId('notification');

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  useEffect(() => {
    if (isVisible && notificationRef.current) {
      // Focus the notification when it appears
      notificationRef.current.focus();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const getNotificationStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-l-4 border-green-400`;
      case 'error':
        return `${baseStyles} border-l-4 border-red-400`;
      case 'info':
        return `${baseStyles} border-l-4 border-blue-400`;
      default:
        return baseStyles;
    }
  };

  const getIconStyles = () => {
    const baseStyles = "flex-shrink-0 w-5 h-5";
    
    switch (type) {
      case 'success':
        return `${baseStyles} text-green-400`;
      case 'error':
        return `${baseStyles} text-red-400`;
      case 'info':
        return `${baseStyles} text-blue-400`;
      default:
        return baseStyles;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className={getIconStyles()} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className={getIconStyles()} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className={getIconStyles()} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'success':
        return 'Success notification';
      case 'error':
        return 'Error notification';
      case 'info':
        return 'Information notification';
      default:
        return 'Notification';
    }
  };

  const liveRegionProps = createLiveRegionAriaProps(false, priority);
  const role = isAlertDialog ? ARIA_ROLE_ALERTDIALOG : ARIA_ROLE_ALERT;

  return (
    <div
      ref={notificationRef}
      id={notificationId}
      role={role}
      aria-label={getTypeLabel()}
      tabIndex={-1}
      className={getNotificationStyles()}
      aria-live={liveRegionProps['aria-live']}
      aria-atomic={liveRegionProps['aria-atomic']}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">
              {message}
            </p>
          </div>
          {dismissible && (
            <div className="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={onClose}
                aria-label={`Close ${getTypeLabel()}`}
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
