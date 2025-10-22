'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all',
  { // Note: some variants like 'glass' and 'premium' rely on global CSS.
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        glass: 'modern-glass-button',
        premium: 'glass-card-premium',
        underline: 'modern-glass-button relative group !p-0 !bg-transparent !border-none !shadow-none hover:text-white transition-all text-sm',
      },
      size: {
        default: 'px-6 py-3 text-base',
        sm: 'px-4 py-2 text-sm',
        lg: 'px-8 py-4 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, asChild = false, isLoading = false, ...props }, ref) => {
    const isLink = !!href;
    const Comp = asChild ? Slot : (isLink ? Link : 'button');
    const MotionComponent = motion.create(Comp as React.ElementType);

    const motionProps: any = {
      whileHover: { scale: isLoading ? 1 : 1.05 },
      whileTap: { scale: isLoading ? 1 : 0.95 },
      transition: { type: 'spring', stiffness: 400, damping: 17 },
      ...(isLink ? { href } : {}),
    }

    return (
      <MotionComponent
        className={cn(buttonVariants({ variant, size, className }), {
          'opacity-75 cursor-not-allowed': isLoading,
        })}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...motionProps}
        {...props}
      >
        {asChild ? (
          props.children
        ) : (
          <>
            {isLoading && <motion.div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
            {props.children}
          </>
        )}
        {variant === 'underline' && <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-blue-600 transition-all group-hover:w-full"></span>}
      </MotionComponent>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }