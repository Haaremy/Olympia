// cooperateDesign/button.tsx   

import React from 'react';
import clsx from 'clsx';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'warn' | 'danger';
};

const baseStyles =
  'rounded-lg px-4 py-2 font-semibold transition-colors duration-200 focus:outline-none disabled:opacity-50';

const variants = {
  primary: 'py-2 px-6 bg-pink-500 hover:bg-pink-600 rounded-lg text-white',
  warn: 'py-2 px-6 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white',
  danger: 'py-2 px-6 bg-red-500 hover:bg-red-600 rounded-lg text-white',
} as const;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
export default Button;
