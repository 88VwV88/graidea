/**
 * Accessibility Testing Utilities
 * Provides functions to test and validate ARIA implementation
 */

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element: HTMLElement;
  rule: string;
}

export interface AccessibilityReport {
  issues: AccessibilityIssue[];
  score: number;
  totalElements: number;
  passedChecks: number;
}

/**
 * Test if an element has proper ARIA labeling
 */
export const testAriaLabeling = (element: HTMLElement): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const role = element.getAttribute('role');
  const hasAriaLabel = element.hasAttribute('aria-label');
  const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
  const hasVisibleText = element.textContent?.trim() || '';
  const hasTitle = element.hasAttribute('title');

  // Check for interactive elements without accessible names
  if (['button', 'link', 'menuitem', 'tab', 'option'].includes(role || '')) {
    if (!hasAriaLabel && !hasAriaLabelledBy && !hasVisibleText && !hasTitle) {
      issues.push({
        type: 'error',
        message: `${role} element lacks accessible name`,
        element,
        rule: 'aria-labeling',
      });
    }
  }

  // Check for form controls without labels
  if (['textbox', 'combobox', 'searchbox', 'spinbutton'].includes(role || '')) {
    if (!hasAriaLabel && !hasAriaLabelledBy && !element.closest('label')) {
      issues.push({
        type: 'error',
        message: `Form control lacks accessible name`,
        element,
        rule: 'form-labeling',
      });
    }
  }

  return issues;
};

/**
 * Test for proper ARIA relationships
 */
export const testAriaRelationships = (element: HTMLElement): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];

  // Check aria-controls references
  const controlsId = element.getAttribute('aria-controls');
  if (controlsId) {
    const controlledElement = document.getElementById(controlsId);
    if (!controlledElement) {
      issues.push({
        type: 'error',
        message: `aria-controls references non-existent element: ${controlsId}`,
        element,
        rule: 'aria-relationships',
      });
    }
  }

  // Check aria-labelledby references
  const labelledById = element.getAttribute('aria-labelledby');
  if (labelledById) {
    const labelledByElement = document.getElementById(labelledById);
    if (!labelledByElement) {
      issues.push({
        type: 'error',
        message: `aria-labelledby references non-existent element: ${labelledById}`,
        element,
        rule: 'aria-relationships',
      });
    }
  }

  // Check aria-describedby references
  const describedById = element.getAttribute('aria-describedby');
  if (describedById) {
    const describedByElement = document.getElementById(describedById);
    if (!describedByElement) {
      issues.push({
        type: 'error',
        message: `aria-describedby references non-existent element: ${describedById}`,
        element,
        rule: 'aria-relationships',
      });
    }
  }

  return issues;
};

/**
 * Test for proper ARIA states and properties
 */
export const testAriaStates = (element: HTMLElement): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const role = element.getAttribute('role');

  // Check for required ARIA attributes based on role
  if (role === 'dialog' || role === 'alertdialog') {
    if (!element.hasAttribute('aria-labelledby') && !element.hasAttribute('aria-label')) {
      issues.push({
        type: 'error',
        message: 'Dialog must have an accessible name',
        element,
        rule: 'dialog-naming',
      });
    }
  }

  if (role === 'menu' || role === 'menubar') {
    const menuItems = element.querySelectorAll('[role="menuitem"]');
    if (menuItems.length === 0) {
      issues.push({
        type: 'warning',
        message: 'Menu should contain menu items',
        element,
        rule: 'menu-structure',
      });
    }
  }

  if (role === 'tablist') {
    const tabs = element.querySelectorAll('[role="tab"]');
    if (tabs.length === 0) {
      issues.push({
        type: 'warning',
        message: 'Tablist should contain tabs',
        element,
        rule: 'tablist-structure',
      });
    }
  }

  // Check for invalid ARIA values
  const expanded = element.getAttribute('aria-expanded');
  if (expanded && !['true', 'false'].includes(expanded)) {
    issues.push({
      type: 'error',
      message: 'aria-expanded must be "true" or "false"',
      element,
      rule: 'aria-values',
    });
  }

  const selected = element.getAttribute('aria-selected');
  if (selected && !['true', 'false'].includes(selected)) {
    issues.push({
      type: 'error',
      message: 'aria-selected must be "true" or "false"',
      element,
      rule: 'aria-values',
    });
  }

  return issues;
};

/**
 * Test for keyboard accessibility
 */
export const testKeyboardAccessibility = (element: HTMLElement): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const role = element.getAttribute('role');

  // Check for focusable elements without tabindex
  if (['button', 'link', 'menuitem', 'tab'].includes(role || '')) {
    const tabIndex = element.getAttribute('tabindex');
    if (tabIndex === '-1' && !element.hasAttribute('aria-hidden')) {
      issues.push({
        type: 'warning',
        message: 'Interactive element is not focusable',
        element,
        rule: 'keyboard-accessibility',
      });
    }
  }

  // Check for proper focus management in modals
  if (role === 'dialog' || role === 'alertdialog') {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) {
      issues.push({
        type: 'warning',
        message: 'Dialog should contain focusable elements',
        element,
        rule: 'dialog-focus',
      });
    }
  }

  return issues;
};

/**
 * Test for color contrast (basic check)
 */
export const testColorContrast = (element: HTMLElement): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const computedStyle = window.getComputedStyle(element);
  const color = computedStyle.color;
  const backgroundColor = computedStyle.backgroundColor;

  // This is a basic check - in a real implementation, you'd use a proper contrast ratio calculator
  if (color === backgroundColor) {
    issues.push({
      type: 'warning',
      message: 'Text and background colors may be too similar',
      element,
      rule: 'color-contrast',
    });
  }

  return issues;
};

/**
 * Run comprehensive accessibility tests on an element
 */
export const testElementAccessibility = (element: HTMLElement): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];

  issues.push(...testAriaLabeling(element));
  issues.push(...testAriaRelationships(element));
  issues.push(...testAriaStates(element));
  issues.push(...testKeyboardAccessibility(element));
  issues.push(...testColorContrast(element));

  return issues;
};

/**
 * Run accessibility tests on the entire document
 */
export const testDocumentAccessibility = (): AccessibilityReport => {
  const allElements = document.querySelectorAll('*');
  const issues: AccessibilityIssue[] = [];
  let totalElements = 0;
  let passedChecks = 0;

  allElements.forEach((element) => {
    if (element instanceof HTMLElement) {
      totalElements++;
      const elementIssues = testElementAccessibility(element);
      issues.push(...elementIssues);
      
      if (elementIssues.length === 0) {
        passedChecks++;
      }
    }
  });

  const score = totalElements > 0 ? Math.round((passedChecks / totalElements) * 100) : 100;

  return {
    issues,
    score,
    totalElements,
    passedChecks,
  };
};

/**
 * Test specific ARIA patterns
 */
export const testAriaPatterns = {
  /**
   * Test tab pattern
   */
  tablist: (tablist: HTMLElement): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]')) as HTMLElement[];
    const tabpanels = Array.from(tablist.querySelectorAll('[role="tabpanel"]')) as HTMLElement[];

    if (tabs.length === 0) {
      issues.push({
        type: 'error',
        message: 'Tablist must contain tabs',
        element: tablist,
        rule: 'tablist-pattern',
      });
    }

    tabs.forEach((tab, index) => {
      const controls = tab.getAttribute('aria-controls');
      if (!controls) {
        issues.push({
          type: 'error',
          message: 'Tab must control a tabpanel',
          element: tab,
          rule: 'tab-pattern',
        });
      }

      const selected = tab.getAttribute('aria-selected');
      if (selected === 'true') {
        const controlledPanel = document.getElementById(controls || '');
        if (controlledPanel && controlledPanel.getAttribute('aria-hidden') === 'true') {
          issues.push({
            type: 'error',
            message: 'Selected tab controls hidden panel',
            element: tab,
            rule: 'tab-pattern',
          });
        }
      }
    });

    return issues;
  },

  /**
   * Test menu pattern
   */
  menu: (menu: HTMLElement): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    const menuItems = Array.from(menu.querySelectorAll('[role="menuitem"]')) as HTMLElement[];

    if (menuItems.length === 0) {
      issues.push({
        type: 'error',
        message: 'Menu must contain menu items',
        element: menu,
        rule: 'menu-pattern',
      });
    }

    return issues;
  },

  /**
   * Test dialog pattern
   */
  dialog: (dialog: HTMLElement): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];

    if (!dialog.hasAttribute('aria-labelledby') && !dialog.hasAttribute('aria-label')) {
      issues.push({
        type: 'error',
        message: 'Dialog must have an accessible name',
        element: dialog,
        rule: 'dialog-pattern',
      });
    }

    const focusableElements = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) {
      issues.push({
        type: 'warning',
        message: 'Dialog should contain focusable elements',
        element: dialog,
        rule: 'dialog-pattern',
      });
    }

    return issues;
  },
};

/**
 * Generate accessibility report
 */
export const generateAccessibilityReport = (): string => {
  const report = testDocumentAccessibility();
  const { issues, score, totalElements, passedChecks } = report;

  let reportText = `Accessibility Report\n`;
  reportText += `==================\n\n`;
  reportText += `Score: ${score}%\n`;
  reportText += `Elements tested: ${totalElements}\n`;
  reportText += `Passed checks: ${passedChecks}\n`;
  reportText += `Issues found: ${issues.length}\n\n`;

  if (issues.length > 0) {
    reportText += `Issues:\n`;
    reportText += `-------\n\n`;

    issues.forEach((issue, index) => {
      reportText += `${index + 1}. [${issue.type.toUpperCase()}] ${issue.message}\n`;
      reportText += `   Element: ${issue.element.tagName.toLowerCase()}`;
      if (issue.element.id) {
        reportText += `#${issue.element.id}`;
      }
      if (issue.element.className) {
        reportText += `.${issue.element.className.split(' ').join('.')}`;
      }
      reportText += `\n`;
      reportText += `   Rule: ${issue.rule}\n\n`;
    });
  }

  return reportText;
};

/**
 * Console accessibility checker
 */
export const checkAccessibility = () => {
  const report = generateAccessibilityReport();
  console.log(report);
  
  const issues = testDocumentAccessibility().issues;
  if (issues.length > 0) {
    console.warn(`Found ${issues.length} accessibility issues. See details above.`);
  } else {
    console.log('✅ No accessibility issues found!');
  }
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).checkAccessibility = checkAccessibility;
  (window as any).testDocumentAccessibility = testDocumentAccessibility;
  (window as any).testElementAccessibility = testElementAccessibility;
}

export default {
  testElementAccessibility,
  testDocumentAccessibility,
  testAriaPatterns,
  generateAccessibilityReport,
  checkAccessibility,
};
