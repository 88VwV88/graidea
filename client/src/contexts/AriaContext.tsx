import React, { createContext, useContext, useRef, useCallback, type ReactNode } from 'react';
import { announceToScreenReader, generateAriaId } from '../lib/aria-utils';

interface AriaContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  generateId: (prefix?: string) => string;
  setLiveRegion: (id: string, message: string, priority?: 'polite' | 'assertive') => void;
  clearLiveRegion: (id: string) => void;
  registerLiveRegion: (id: string) => void;
  unregisterLiveRegion: (id: string) => void;
}

const AriaContext = createContext<AriaContextType | undefined>(undefined);

interface AriaProviderProps {
  children: ReactNode;
}

export const AriaProvider: React.FC<AriaProviderProps> = ({ children }) => {
  const liveRegionsRef = useRef<Map<string, HTMLElement>>(new Map());

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority);
  }, []);

  const generateId = useCallback((prefix: string = 'aria') => {
    return generateAriaId(prefix);
  }, []);

  const registerLiveRegion = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      liveRegionsRef.current.set(id, element);
    }
  }, []);

  const unregisterLiveRegion = useCallback((id: string) => {
    liveRegionsRef.current.delete(id);
  }, []);

  const setLiveRegion = useCallback((id: string, message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const element = liveRegionsRef.current.get(id);
    if (element) {
      element.setAttribute('aria-live', priority);
      element.setAttribute('aria-atomic', 'true');
      element.textContent = message;
    } else {
      // Fallback to global announcement
      announce(message, priority);
    }
  }, [announce]);

  const clearLiveRegion = useCallback((id: string) => {
    const element = liveRegionsRef.current.get(id);
    if (element) {
      element.textContent = '';
    }
  }, []);

  const value: AriaContextType = {
    announce,
    generateId,
    setLiveRegion,
    clearLiveRegion,
    registerLiveRegion,
    unregisterLiveRegion,
  };

  return (
    <AriaContext.Provider value={value}>
      {children}
    </AriaContext.Provider>
  );
};

export const useAria = (): AriaContextType => {
  const context = useContext(AriaContext);
  if (context === undefined) {
    throw new Error('useAria must be used within an AriaProvider');
  }
  return context;
};

export default AriaContext;
