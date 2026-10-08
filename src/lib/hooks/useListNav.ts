import { useCallback, useEffect, useRef, useState } from 'react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { usePalette } from './usePalette'

const GROUP = 'This page'

function openElement(el: HTMLElement) {
    const target = el.matches('a,button') ? el : el.querySelector<HTMLElement>('a,button')
    target?.click()
}

/**
 * Keyboard traversal over a list of elements: j/k (or arrows) move, Enter/o opens.
 * Hotkeys only exist while the calling component is mounted, so they're page-scoped.
 */
export function useListNav<T extends HTMLElement = HTMLElement>({ count, enabled = true }: { count: number; enabled?: boolean }) {
    const { isOpen } = usePalette()
    const [activeIndex, setActiveIndex] = useState(-1)
    const refs = useRef<(T | null)[]>([])
    const active = enabled && !isOpen && count > 0

    const register = useCallback((index: number) => (el: T | null) => {
        refs.current[index] = el
    }, [])

    const move = useCallback((delta: number) => {
        setActiveIndex(prev => {
            if (prev < 0) return delta > 0 ? 0 : count - 1
            return Math.min(count - 1, Math.max(0, prev + delta))
        })
    }, [count])

    const open = useCallback((e: KeyboardEvent) => {
        // let a focused link/button handle Enter natively
        if (e.target instanceof HTMLElement && e.target.closest('a,button')) return
        const el = refs.current[activeIndex]
        if (!el) return
        e.preventDefault()
        openElement(el)
    }, [activeIndex])

    useEffect(() => {
        refs.current[activeIndex]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, [activeIndex])

    const next = { enabled: active, meta: { name: 'Next item', group: GROUP } }
    const prev = { enabled: active, meta: { name: 'Previous item', group: GROUP } }
    const openOpts = { enabled: active && activeIndex >= 0, preventDefault: false, meta: { name: 'Open item', group: GROUP } }

    useHotkey('J', () => move(1), next)
    useHotkey('ArrowDown', () => move(1), next)
    useHotkey('K', () => move(-1), prev)
    useHotkey('ArrowUp', () => move(-1), prev)
    useHotkey('Enter', open, openOpts)
    useHotkey('O', open, openOpts)

    return { activeIndex, setActiveIndex, register }
}
