import * as React from "react"

import { cn } from "../../lib/utils"
import { generateAriaId } from "../../lib/aria-utils"

export interface CardProps extends React.ComponentProps<"div"> {
  /**
   * Whether the card is interactive (clickable)
   */
  interactive?: boolean
  /**
   * Accessible label for the card
   */
  ariaLabel?: string
  /**
   * Role for the card (default: 'region')
   */
  role?: string
}

function Card({ 
  className, 
  interactive = false,
  ariaLabel,
  role = "region",
  ...props 
}: CardProps) {
  return (
    <div
      data-slot="card"
      role={role}
      {...(ariaLabel && { 'aria-label': ariaLabel })}
      {...(interactive && { 
        tabIndex: 0,
        role: 'button',
        'aria-pressed': 'false'
      })}
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        interactive && "cursor-pointer hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

export interface CardHeaderProps extends React.ComponentProps<"div"> {
  /**
   * Accessible label for the card header
   */
  ariaLabel?: string
}

function CardHeader({ 
  className, 
  ariaLabel,
  ...props 
}: CardHeaderProps) {
  return (
    <header
      data-slot="card-header"
      {...(ariaLabel && { 'aria-label': ariaLabel })}
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

export interface CardTitleProps extends React.ComponentProps<"div"> {
  /**
   * Heading level for the title (default: 'h3')
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6
  /**
   * ID for the title element
   */
  id?: string
}

function CardTitle({ 
  className, 
  level = 3,
  id,
  ...props 
}: CardTitleProps) {
  const titleId = id || generateAriaId('card-title')
  
  const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements
  
  return React.createElement(
    HeadingTag,
    {
      'data-slot': 'card-title',
      id: titleId,
      className: cn("leading-none font-semibold", className),
      ...props,
    }
  )
}

export interface CardDescriptionProps extends React.ComponentProps<"div"> {
  /**
   * ID for the description element
   */
  id?: string
}

function CardDescription({ 
  className, 
  id,
  ...props 
}: CardDescriptionProps) {
  const descriptionId = id || generateAriaId('card-description')
  
  return (
    <div
      data-slot="card-description"
      id={descriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export interface CardActionProps extends React.ComponentProps<"div"> {
  /**
   * Accessible label for the action area
   */
  ariaLabel?: string
}

function CardAction({ 
  className, 
  ariaLabel,
  ...props 
}: CardActionProps) {
  return (
    <div
      data-slot="card-action"
      {...(ariaLabel && { 'aria-label': ariaLabel })}
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

export interface CardContentProps extends React.ComponentProps<"div"> {
  /**
   * Accessible label for the content area
   */
  ariaLabel?: string
  /**
   * ID of the element that labels this content
   */
  labelledBy?: string
}

function CardContent({ 
  className, 
  ariaLabel,
  labelledBy,
  ...props 
}: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      {...(ariaLabel && { 'aria-label': ariaLabel })}
      {...(labelledBy && { 'aria-labelledby': labelledBy })}
      className={cn("px-6", className)}
      {...props}
    />
  )
}

export interface CardFooterProps extends React.ComponentProps<"div"> {
  /**
   * Accessible label for the footer
   */
  ariaLabel?: string
}

function CardFooter({ 
  className, 
  ariaLabel,
  ...props 
}: CardFooterProps) {
  return (
    <footer
      data-slot="card-footer"
      {...(ariaLabel && { 'aria-label': ariaLabel })}
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
