// cooperateDesign/link.tsx
import React from 'react';
import clsx from 'clsx';
import Link, { LinkProps as NextLinkProps } from "next/link";

export type CLinkProps = NextLinkProps & 
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: 'primary' | 'warn' | 'danger';
  };

const baseStyles =
  'rounded-lg px-4 py-2 font-semibold transition-colors duration-200 focus:outline-none disabled:opacity-50';

const variants = {
  primary: 'py-2 px-6 bg-pink-500 hover:bg-pink-600 rounded-lg text-white',
  warn: 'py-2 px-6 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white',
  danger: 'py-2 px-6 bg-red-500 hover:bg-red-600 rounded-lg text-white',
} as const;

const CLink = React.forwardRef<HTMLAnchorElement, CLinkProps>(
  ({ variant = 'primary', className, href, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        className={clsx(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);

CLink.displayName = 'CLink';
export default CLink;
