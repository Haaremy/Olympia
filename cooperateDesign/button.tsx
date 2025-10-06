// cooperateDesign/button.tsx   

import React from 'react';
import clsx from 'clsx';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'warn' | 'danger' | 'navigation' | 'switch';
  switchOn?: boolean;
};

const baseStyles =
  'rounded-lg px-4 py-2 font-semibold transition-colors duration-200 focus:outline-none disabled:opacity-50 dark:text-white text-gray-900 px-4';

const variants = {
  primary: '  dark:bg-pink-500 hover:dark:bg-pink-600 bg-blue-300 hover:bg-blue-400 ',
  warn: '  bg-yellow-500 hover:bg-yellow-600  ',
  danger: '  bg-red-500 hover:bg-red-600  ',
  navigation: 'flex flex-col sm:flex-row no-wrap items-center py-1 sm: md:flex-row md:gap-2 bg-blue-300 dark:bg-pink-500 hover:bg-blue-400 hover:dark:bg-pink-500'
} as const;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', switchOn = false, className, ...props }, ref) => {
    const switchStyles = switchOn
      ? "bg-blue-300 dark:bg-pink-500 hover:bg-blue-400 hover:dark:bg-pink-600"
      : "bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 hover:dark:bg-gray-700  ";
    return (
      <button
        ref={ref}
        type='button'
        className={clsx(
          baseStyles, 
          variant === "switch" ? switchStyles : variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
export default Button;
