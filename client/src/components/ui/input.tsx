import * as React from "react"

import { cn } from "../../lib/utils"
import { createFormFieldAriaProps, generateAriaId } from "../../lib/aria-utils"

export interface InputProps extends React.ComponentProps<"input"> {
  /**
   * Label for the input field
   */
  label?: string
  /**
   * Error message to display
   */
  error?: string
  /**
   * Description or help text for the input
   */
  description?: string
  /**
   * Whether the input is required
   */
  required?: boolean
  /**
   * Whether the input is invalid
   */
  invalid?: boolean
  /**
   * ID for the input (auto-generated if not provided)
   */
  id?: string
  /**
   * ID for the label element
   */
  labelId?: string
  /**
   * ID for the error element
   */
  errorId?: string
  /**
   * ID for the description element
   */
  descriptionId?: string
}

function Input({ 
  className, 
  type, 
  label,
  error,
  description,
  required = false,
  invalid = false,
  id: providedId,
  labelId: providedLabelId,
  errorId: providedErrorId,
  descriptionId: providedDescriptionId,
  ...props 
}: InputProps) {
  // Generate IDs if not provided
  const id = providedId || generateAriaId('input')
  const labelId = providedLabelId || `${id}-label`
  const errorId = providedErrorId || `${id}-error`
  const descriptionId = providedDescriptionId || `${id}-description`

  // Create ARIA props
  const ariaProps = createFormFieldAriaProps(
    id,
    label || '',
    error,
    description
  )

  // Enhanced props with ARIA support
  const enhancedProps = {
    ...props,
    ...ariaProps,
    id,
    required,
    'aria-required': required,
    'aria-invalid': (invalid || !!error) ? 'true' : 'false',
    ...(label && { 'aria-labelledby': labelId }),
    ...(error && { 'aria-describedby': errorId }),
    ...(description && !error && { 'aria-describedby': descriptionId }),
    ...(error && description && { 'aria-describedby': `${descriptionId} ${errorId}` }),
  }

  return (
    <div className="space-y-1">
      {label && (
        <label 
          id={labelId}
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...enhancedProps}
      />
      
      {description && !error && (
        <p 
          id={descriptionId}
          className="text-sm text-gray-500"
        >
          {description}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId}
          className="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export { Input }
