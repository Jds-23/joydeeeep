import { useCallback, useMemo, useState } from 'react'
import { PaletteContext, type PaletteMode } from '../../lib/hooks/usePalette'

export function PaletteProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<PaletteMode>('all')

    const open = useCallback((next: PaletteMode = 'all') => {
        setMode(next)
        setIsOpen(true)
    }, [])
    const close = useCallback(() => setIsOpen(false), [])
    const setOpen = useCallback((value: boolean) => (value ? open() : close()), [open, close])

    const value = useMemo(() => ({ isOpen, mode, open, close, setOpen }), [isOpen, mode, open, close, setOpen])
    return <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>
}
