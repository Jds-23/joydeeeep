import { type ReactNode } from 'react'

interface BoxProps {
    children: ReactNode
    className?: string
}

export function Box({ children, className = '' }: BoxProps) {
    return (
        <div className={`border-2 border-black rounded-md p-3 ${className}`}>
            {children}
        </div>
    )
}
