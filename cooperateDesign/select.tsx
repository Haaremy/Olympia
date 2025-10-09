// cooperateDesign/SelectField.tsx
import React from 'react';
import clsx from 'clsx';

// Props für das SelectField (nun für ein <select> statt <input>)
export type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement>;

// Optional: Basis-Styles für alle SelectField
const baseStyles = `
  flex-1 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600
`;

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={clsx(baseStyles, className)} // Kombiniert die Basis-Styles mit benutzerdefinierten Klassen
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);

SelectField.displayName = 'SelectField';

export default SelectField;
