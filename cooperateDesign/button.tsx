// cooperateDesign/button.tsx   

import React from 'react';
import clsx from 'clsx';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'warn' | 'danger' | 'navigation' | 'switch';
  switchOn?: boolean;
};

const baseStyles =
  'rounded-lg px-4 py-2 font-semibold transition-colors duration-200 focus:outline-none disabled:opacity-50 text-white px-6';

const variants = {
  primary: '  bg-pink-500 hover:bg-pink-600  ',
  warn: '  bg-yellow-500 hover:bg-yellow-600  ',
  danger: '  bg-red-500 hover:bg-red-600  ',
  navigation: 'flex flex-col sm:flex-row no-wrap items-center sm:px-2  py-1 sm:px-3 sm: md:flex-row md:gap-2 bg-blue-300 dark:bg-pink-500 hover:bg-blue-400 hover:dark:bg-pink-500'
} as const;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', switchOn = false, className, ...props }, ref) => {
    const switchStyles = switchOn
      ? "bg-pink-500 "
      : "hover:bg-pink-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800";
    return (
      <button
        ref={ref}
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
