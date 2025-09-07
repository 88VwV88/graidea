/**
 * ARIA Utilities for enhanced accessibility
 * Provides helper functions and constants for ARIA attributes
 */

// ARIA Live Region Politeness Levels
export const ARIA_LIVE_POLITE = 'polite' as const;
export const ARIA_LIVE_ASSERTIVE = 'assertive' as const;
export const ARIA_LIVE_OFF = 'off' as const;

// ARIA States
export const ARIA_EXPANDED = 'aria-expanded' as const;
export const ARIA_SELECTED = 'aria-selected' as const;
export const ARIA_CHECKED = 'aria-checked' as const;
export const ARIA_DISABLED = 'aria-disabled' as const;
export const ARIA_HIDDEN = 'aria-hidden' as const;
export const ARIA_PRESSED = 'aria-pressed' as const;

// ARIA Properties
export const ARIA_LABEL = 'aria-label' as const;
export const ARIA_LABELLEDBY = 'aria-labelledby' as const;
export const ARIA_DESCRIBEDBY = 'aria-describedby' as const;
export const ARIA_CONTROLS = 'aria-controls' as const;
export const ARIA_OWNS = 'aria-owns' as const;
export const ARIA_ACTIVEDESCENDANT = 'aria-activedescendant' as const;

// ARIA Roles
export const ARIA_ROLE_BUTTON = 'button' as const;
export const ARIA_ROLE_LINK = 'link' as const;
export const ARIA_ROLE_MENU = 'menu' as const;
export const ARIA_ROLE_MENUITEM = 'menuitem' as const;
export const ARIA_ROLE_DIALOG = 'dialog' as const;
export const ARIA_ROLE_ALERT = 'alert' as const;
export const ARIA_ROLE_ALERTDIALOG = 'alertdialog' as const;
export const ARIA_ROLE_BANNER = 'banner' as const;
export const ARIA_ROLE_COMPLEMENTARY = 'complementary' as const;
export const ARIA_ROLE_CONTENTINFO = 'contentinfo' as const;
export const ARIA_ROLE_FORM = 'form' as const;
export const ARIA_ROLE_MAIN = 'main' as const;
export const ARIA_ROLE_NAVIGATION = 'navigation' as const;
export const ARIA_ROLE_REGION = 'region' as const;
export const ARIA_ROLE_SEARCH = 'search' as const;
export const ARIA_ROLE_TAB = 'tab' as const;
export const ARIA_ROLE_TABLIST = 'tablist' as const;
export const ARIA_ROLE_TABPANEL = 'tabpanel' as const;
export const ARIA_ROLE_TOOLTIP = 'tooltip' as const;
export const ARIA_ROLE_GRID = 'grid' as const;
export const ARIA_ROLE_GRIDCELL = 'gridcell' as const;
export const ARIA_ROLE_ROW = 'row' as const;
export const ARIA_ROLE_COLUMNHEADER = 'columnheader' as const;
export const ARIA_ROLE_ROWHEADER = 'rowheader' as const;
export const ARIA_ROLE_LIST = 'list' as const;
export const ARIA_ROLE_LISTITEM = 'listitem' as const;
export const ARIA_ROLE_GROUP = 'group' as const;
export const ARIA_ROLE_RADIOGROUP = 'radiogroup' as const;
export const ARIA_ROLE_RADIO = 'radio' as const;
export const ARIA_ROLE_CHECKBOX = 'checkbox' as const;
export const ARIA_ROLE_SWITCH = 'switch' as const;
export const ARIA_ROLE_SLIDER = 'slider' as const;
export const ARIA_ROLE_PROGRESSBAR = 'progressbar' as const;
export const ARIA_ROLE_STATUS = 'status' as const;
export const ARIA_ROLE_LOG = 'log' as const;
export const ARIA_ROLE_MARQUEE = 'marquee' as const;
export const ARIA_ROLE_TIMER = 'timer' as const;
export const ARIA_ROLE_LIVE_REGION = 'region' as const;

// ARIA Landmark Roles
export const ARIA_LANDMARKS = {
  BANNER: ARIA_ROLE_BANNER,
  COMPLEMENTARY: ARIA_ROLE_COMPLEMENTARY,
  CONTENTINFO: ARIA_ROLE_CONTENTINFO,
  FORM: ARIA_ROLE_FORM,
  MAIN: ARIA_ROLE_MAIN,
  NAVIGATION: ARIA_ROLE_NAVIGATION,
  REGION: ARIA_ROLE_REGION,
  SEARCH: ARIA_ROLE_SEARCH,
} as const;

// Common ARIA attributes for form elements
export const createFormFieldAriaProps = (
  id: string,
  label: string,
  error?: string,
  description?: string
) => ({
  id,
  [ARIA_LABEL]: label,
  ...(error && { [ARIA_DESCRIBEDBY]: `${id}-error` }),
  ...(description && { [ARIA_DESCRIBEDBY]: `${id}-description` }),
  ...(error && { 'aria-invalid': 'true' }),
});

// ARIA attributes for buttons
export const createButtonAriaProps = (
  label: string,
  pressed?: boolean,
  expanded?: boolean,
  controls?: string
) => ({
  [ARIA_LABEL]: label,
  ...(pressed !== undefined && { [ARIA_PRESSED]: pressed.toString() }),
  ...(expanded !== undefined && { [ARIA_EXPANDED]: expanded.toString() }),
  ...(controls && { [ARIA_CONTROLS]: controls }),
});

// ARIA attributes for navigation
export const createNavigationAriaProps = (label: string) => ({
  role: ARIA_ROLE_NAVIGATION,
  [ARIA_LABEL]: label,
});

// ARIA attributes for live regions
export const createLiveRegionAriaProps = (
  atomic: boolean = false,
  live: 'polite' | 'assertive' | 'off' = ARIA_LIVE_POLITE
) => ({
  'aria-live': live,
  'aria-atomic': atomic.toString(),
});

// ARIA attributes for modals/dialogs
export const createModalAriaProps = (
  id: string,
  describedBy?: string
) => ({
  role: ARIA_ROLE_DIALOG,
  'aria-modal': 'true',
  'aria-labelledby': `${id}-title`,
  ...(describedBy && { 'aria-describedby': describedBy }),
});

// ARIA attributes for tabs
export const createTabAriaProps = (
  id: string,
  controls: string,
  selected: boolean = false
) => ({
  role: ARIA_ROLE_TAB,
  id,
  [ARIA_CONTROLS]: controls,
  [ARIA_SELECTED]: selected.toString(),
  tabIndex: selected ? 0 : -1,
});

// ARIA attributes for tab panels
export const createTabPanelAriaProps = (
  id: string,
  labelledBy: string,
  hidden: boolean = false
) => ({
  role: ARIA_ROLE_TABPANEL,
  id,
  [ARIA_LABELLEDBY]: labelledBy,
  [ARIA_HIDDEN]: hidden.toString(),
  tabIndex: hidden ? -1 : 0,
});

// ARIA attributes for lists
export const createListAriaProps = (label?: string) => ({
  role: ARIA_ROLE_LIST,
  ...(label && { [ARIA_LABEL]: label }),
});

// ARIA attributes for list items
export const createListItemAriaProps = () => ({
  role: ARIA_ROLE_LISTITEM,
});

// ARIA attributes for grids
export const createGridAriaProps = (
  label: string,
  rowCount?: number,
  columnCount?: number
) => ({
  role: ARIA_ROLE_GRID,
  [ARIA_LABEL]: label,
  ...(rowCount && { 'aria-rowcount': rowCount.toString() }),
  ...(columnCount && { 'aria-colcount': columnCount.toString() }),
});

// ARIA attributes for progress bars
export const createProgressBarAriaProps = (
  value: number,
  min: number = 0,
  max: number = 100,
  label?: string
) => ({
  role: ARIA_ROLE_PROGRESSBAR,
  'aria-valuenow': value.toString(),
  'aria-valuemin': min.toString(),
  'aria-valuemax': max.toString(),
  ...(label && { [ARIA_LABEL]: label }),
});

// Screen reader only text utility
export const srOnly = 'sr-only';

// Focus management utilities
export const focusElement = (element: HTMLElement | null) => {
  if (element) {
    element.focus();
  }
};

export const trapFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);
  firstElement?.focus();

  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
};

// Announce to screen readers
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = srOnly;
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Generate unique IDs for ARIA relationships
export const generateAriaId = (prefix: string = 'aria') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// ARIA validation helpers
export const validateAriaAttributes = (element: HTMLElement): string[] => {
  const errors: string[] = [];
  
  // Check for required ARIA attributes based on role
  const role = element.getAttribute('role');
  
  if (role === ARIA_ROLE_BUTTON && !element.hasAttribute(ARIA_LABEL) && !element.textContent?.trim()) {
    errors.push('Button elements must have accessible text via aria-label or visible text content');
  }
  
  if (role === ARIA_ROLE_DIALOG && !element.hasAttribute('aria-labelledby') && !element.hasAttribute(ARIA_LABEL)) {
    errors.push('Dialog elements must have an accessible name via aria-labelledby or aria-label');
  }
  
  if (element.hasAttribute('aria-controls')) {
    const controlsId = element.getAttribute('aria-controls');
    const controlledElement = document.getElementById(controlsId || '');
    if (!controlledElement) {
      errors.push(`Element with aria-controls="${controlsId}" references non-existent element`);
    }
  }
  
  return errors;
};

// Keyboard navigation helpers
export const handleArrowKeyNavigation = (
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  orientation: 'horizontal' | 'vertical' = 'vertical'
) => {
  const { key } = event;
  let newIndex = currentIndex;
  
  if (orientation === 'vertical') {
    if (key === 'ArrowDown') {
      newIndex = (currentIndex + 1) % items.length;
    } else if (key === 'ArrowUp') {
      newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    }
  } else {
    if (key === 'ArrowRight') {
      newIndex = (currentIndex + 1) % items.length;
    } else if (key === 'ArrowLeft') {
      newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    }
  }
  
  if (newIndex !== currentIndex) {
    event.preventDefault();
    items[newIndex]?.focus();
    return newIndex;
  }
  
  return currentIndex;
};

export default {
  ARIA_LIVE_POLITE,
  ARIA_LIVE_ASSERTIVE,
  ARIA_LIVE_OFF,
  ARIA_EXPANDED,
  ARIA_SELECTED,
  ARIA_CHECKED,
  ARIA_DISABLED,
  ARIA_HIDDEN,
  ARIA_PRESSED,
  ARIA_LABEL,
  ARIA_LABELLEDBY,
  ARIA_DESCRIBEDBY,
  ARIA_CONTROLS,
  ARIA_OWNS,
  ARIA_ACTIVEDESCENDANT,
  ARIA_LANDMARKS,
  createFormFieldAriaProps,
  createButtonAriaProps,
  createNavigationAriaProps,
  createLiveRegionAriaProps,
  createModalAriaProps,
  createTabAriaProps,
  createTabPanelAriaProps,
  createListAriaProps,
  createListItemAriaProps,
  createGridAriaProps,
  createProgressBarAriaProps,
  srOnly,
  focusElement,
  trapFocus,
  announceToScreenReader,
  generateAriaId,
  validateAriaAttributes,
  handleArrowKeyNavigation,
};
