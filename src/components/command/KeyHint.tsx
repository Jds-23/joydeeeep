import { cn } from '../../lib/utils/cn'

/** Keyboard hint, only rendered on devices with a precise pointer (i.e. likely a keyboard). */
export function KeyHint({ keys, className }: { keys: string[]; className?: string }) {
    return (
        <span className={cn('hidden pointer-fine:inline-flex items-center gap-1', className)}>
            {keys.map((key, i) => (
                <Kbd key={i}>{key}</Kbd>
            ))}
        </span>
    )
}

export function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="min-w-4 px-1 py-0.5 text-[10px] leading-none font-mono text-center border border-neutral-900 rounded bg-white text-neutral-900 shadow-[0_1px_0_0_#171717]">
            {children}
        </kbd>
    )
}

/** "j k browse · ↵ open" hint for pages using list traversal. */
export function ListNavHint({ className }: { className?: string }) {
    return (
        <p className={cn('hidden pointer-fine:flex items-center gap-1 text-[11px] text-neutral-500', className)}>
            <Kbd>j</Kbd>
            <Kbd>k</Kbd>
            <span className="mr-2">browse</span>
            <Kbd>↵</Kbd>
            <span>open</span>
        </p>
    )
}
