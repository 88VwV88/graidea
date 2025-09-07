# ARIA Implementation Guide

This document outlines the comprehensive ARIA (Accessible Rich Internet Applications) system implemented in the Graidea frontend application.

## Overview

The ARIA system provides enhanced accessibility for users with disabilities, particularly those using screen readers and other assistive technologies. It includes:

- ARIA utilities and helper functions
- Enhanced UI components with built-in accessibility
- Navigation patterns with keyboard support
- Form validation with proper error handling
- Live regions for dynamic content announcements
- Comprehensive accessibility testing tools

## Core Components

### 1. ARIA Utilities (`lib/aria-utils.ts`)

Provides helper functions and constants for ARIA attributes:

```typescript
import { 
  createButtonAriaProps, 
  createFormFieldAriaProps,
  generateAriaId,
  announceToScreenReader 
} from '../lib/aria-utils';
```

**Key Features:**
- Pre-built ARIA attribute generators
- Focus management utilities
- Screen reader announcement functions
- Keyboard navigation helpers
- ARIA validation functions

### 2. ARIA Context (`contexts/AriaContext.tsx`)

Global context for managing accessibility state:

```typescript
import { useAria } from '../contexts/AriaContext';

const { announce, generateId, setLiveRegion } = useAria();
```

**Features:**
- Centralized accessibility state management
- Live region management
- Screen reader announcements
- ID generation for ARIA relationships

### 3. Enhanced UI Components

#### Button Component
- Built-in ARIA attributes
- Loading states with screen reader support
- Toggle button support
- Focus management

```typescript
<Button
  ariaLabel="Save changes"
  pressed={isPressed}
  expanded={isExpanded}
  loading={isLoading}
  loadingText="Saving..."
>
  Save
</Button>
```

#### Input Component
- Automatic label association
- Error message handling
- Required field indicators
- Description text support

```typescript
<Input
  label="Email address"
  error={errors.email?.message}
  description="We'll never share your email"
  required
  invalid={!!errors.email}
/>
```

#### Card Component
- Semantic HTML structure
- Interactive card support
- Proper heading hierarchy
- ARIA labeling

```typescript
<Card interactive ariaLabel="Course information">
  <CardTitle level={2}>React Fundamentals</CardTitle>
  <CardDescription>Learn the basics of React</CardDescription>
  <CardContent>Course content here...</CardContent>
</Card>
```

### 4. Navigation Components

#### Enhanced Navbar
- Proper ARIA navigation landmarks
- Keyboard navigation support
- Mobile menu accessibility
- Search form labeling

**Features:**
- `role="navigation"` with proper labeling
- Keyboard navigation with arrow keys
- Focus management for dropdowns
- Screen reader announcements for state changes

#### Sidebar Navigation
- Collapsible sections with proper ARIA states
- Keyboard navigation
- Current page indication
- Proper heading structure

### 5. Form Components

#### Enhanced Login Form
- Proper form labeling
- Error message association
- Required field indicators
- Screen reader announcements

**Features:**
- `role="form"` with accessible name
- Error messages with `role="alert"`
- Proper field validation feedback
- Loading states with screen reader support

### 6. Live Regions

#### LiveRegion Component
For announcing dynamic content changes:

```typescript
<LiveRegion
  message="Course saved successfully"
  priority="polite"
  atomic={true}
  clearAfter={3000}
/>
```

#### Enhanced Notification Component
- Proper ARIA roles (`alert`, `alertdialog`)
- Priority levels for announcements
- Dismissible notifications
- Focus management

### 7. Loading States

#### Enhanced LoadingSpinner
- Progress bar support
- Screen reader announcements
- Completion states
- Customizable labels

```typescript
<LoadingSpinner
  text="Loading courses..."
  progress={75}
  showProgress={true}
  ariaLabel="Loading course data"
/>
```

## ARIA Patterns Implemented

### 1. Navigation Pattern
- Main navigation with `role="navigation"`
- Menu items with proper roles
- Keyboard navigation support
- Current page indication

### 2. Form Pattern
- Proper form labeling
- Error message association
- Required field indicators
- Validation feedback

### 3. Dialog Pattern
- Modal dialogs with proper ARIA attributes
- Focus trapping
- Escape key handling
- Proper labeling

### 4. Tab Pattern
- Tablist with proper structure
- Tab panel relationships
- Keyboard navigation
- State management

### 5. Menu Pattern
- Dropdown menus with proper roles
- Keyboard navigation
- Focus management
- State announcements

## Accessibility Testing

### Testing Utilities (`lib/accessibility-testing.ts`)

Comprehensive testing functions:

```typescript
import { checkAccessibility, testDocumentAccessibility } from '../lib/accessibility-testing';

// Run accessibility tests
checkAccessibility();

// Get detailed report
const report = testDocumentAccessibility();
console.log(report);
```

**Test Categories:**
- ARIA labeling validation
- Relationship validation
- State and property validation
- Keyboard accessibility
- Color contrast (basic)
- Pattern-specific tests

### Browser Console Testing

Access testing functions in browser console:

```javascript
// Run full accessibility check
checkAccessibility();

// Test specific element
testElementAccessibility(document.querySelector('.my-component'));

// Get detailed report
const report = testDocumentAccessibility();
console.log(report);
```

## Best Practices

### 1. Semantic HTML
- Use proper HTML elements when possible
- Add ARIA attributes only when necessary
- Maintain proper heading hierarchy

### 2. Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Provide visible focus indicators
- Implement proper tab order

### 3. Screen Reader Support
- Provide meaningful labels for all interactive elements
- Use live regions for dynamic content
- Announce state changes appropriately

### 4. Form Accessibility
- Associate labels with form controls
- Provide clear error messages
- Indicate required fields
- Use proper input types

### 5. Color and Contrast
- Ensure sufficient color contrast
- Don't rely solely on color to convey information
- Provide alternative indicators

## Implementation Checklist

- [x] ARIA utilities and helper functions
- [x] Enhanced UI components with accessibility
- [x] Navigation patterns with keyboard support
- [x] Form validation with proper error handling
- [x] Live regions for dynamic content
- [x] Loading states with screen reader support
- [x] Accessibility testing utilities
- [x] Documentation and examples

## Usage Examples

### Basic Button with ARIA
```typescript
<Button
  ariaLabel="Add to cart"
  pressed={isInCart}
  onClick={handleAddToCart}
>
  {isInCart ? 'Remove from Cart' : 'Add to Cart'}
</Button>
```

### Form with Validation
```typescript
<Input
  label="Email address"
  type="email"
  required
  error={errors.email?.message}
  invalid={!!errors.email}
  description="We'll use this to send you updates"
/>
```

### Live Region for Updates
```typescript
<LiveRegion
  message={notificationMessage}
  priority="assertive"
  atomic={true}
/>
```

### Navigation with Keyboard Support
```typescript
<nav role="navigation" aria-label="Main navigation">
  <ul role="menubar">
    <li role="menuitem">
      <Link to="/courses">Courses</Link>
    </li>
  </ul>
</nav>
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [MDN ARIA Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)

## Support

For questions or issues with the ARIA implementation, please refer to the testing utilities or consult the accessibility testing documentation.
