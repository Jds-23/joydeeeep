import { createContext, useContext } from 'react'

export type PaletteMode = 'all' | 'shortcuts'

export interface PaletteContextValue {
    isOpen: boolean
    mode: PaletteMode
    open: (mode?: PaletteMode) => void
    close: () => void
    setOpen: (open: boolean) => void
}

export const PaletteContext = createContext<PaletteContextValue | null>(null)

export function usePalette(): PaletteContextValue {
    const ctx = useContext(PaletteContext)
    if (!ctx) throw new Error('usePalette must be used inside <PaletteProvider>')
    return ctx
}
