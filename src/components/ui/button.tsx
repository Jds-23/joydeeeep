import React from 'react';
import { cn } from '../../lib/utils/cn';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};



export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, className = '', ...props }, ref) => {
        return (
            <button ref={ref} className={cn('mt-6 px-3 text-sm cursor-pointer font-medium py-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2', className)} {...props}>
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button; 