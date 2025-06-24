import React from 'react';
import { cn } from '../../lib/utils/cn';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};



export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, className = '', ...props }, ref) => {
        return (
            <button ref={ref} className={cn('px-3 text-sm cursor-pointer py-1.5 rounded transition-colors focus:outline-none ', className)} {...props}>
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button; 