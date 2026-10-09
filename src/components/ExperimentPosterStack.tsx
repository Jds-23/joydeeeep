import { useCallback, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useHotkey } from '@tanstack/react-hotkeys'
import { BASE_TOP_PX, CARD_TRAVEL_VH, ExperimentPoster, PEEK_OFFSET_PX } from './ExperimentPoster'
import { ListNavHint } from './command/KeyHint'
import { usePalette } from '../lib/hooks/usePalette'
import type { Experiment } from '../constant/experiment'

const GROUP = 'This page'
// a keypress within this window continues from the last target instead of the mid-scroll position
const SCROLL_SETTLE_MS = 700

export function ExperimentPosterStack({ experiments }: { experiments: Experiment[] }) {
    const navigate = useNavigate()
    const { isOpen } = usePalette()
    const containerRef = useRef<HTMLDivElement>(null)
    const pending = useRef<{ index: number; at: number } | null>(null)

    // scrollY at which card `index` reaches its sticky position (top of its own scroll slice)
    const pinY = useCallback((index: number) => {
        const container = containerRef.current
        if (!container) return 0
        const containerTop = container.getBoundingClientRect().top + window.scrollY
        const sliceTop = (index * CARD_TRAVEL_VH * window.innerHeight) / 100
        return Math.max(0, containerTop + sliceTop - (BASE_TOP_PX + index * PEEK_OFFSET_PX))
    }, [])

    // topmost pinned card, derived from scroll so mouse scrolling and keys stay in sync; -1 if none pinned yet
    const activeIndex = useCallback(() => {
        if (pending.current && performance.now() - pending.current.at < SCROLL_SETTLE_MS) return pending.current.index
        let index = -1
        for (let i = 0; i < experiments.length; i++) {
            if (window.scrollY >= pinY(i) - 2) index = i
        }
        return index
    }, [experiments.length, pinY])

    const scrollToCard = useCallback((delta: number) => {
        const current = activeIndex()
        const target = Math.min(experiments.length - 1, Math.max(0, current + delta))
        if (delta < 0 && current <= 0) {
            pending.current = null
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }
        pending.current = { index: target, at: performance.now() }
        window.scrollTo({ top: pinY(target), behavior: 'smooth' })
    }, [activeIndex, experiments.length, pinY])

    const enabled = !isOpen && experiments.length > 0
    const next = { enabled, meta: { name: 'Next experiment', group: GROUP } }
    const prev = { enabled, meta: { name: 'Previous experiment', group: GROUP } }
    useHotkey('J', () => scrollToCard(1), next)
    useHotkey('ArrowDown', () => scrollToCard(1), next)
    useHotkey('K', () => scrollToCard(-1), prev)
    useHotkey('ArrowUp', () => scrollToCard(-1), prev)

    const open = useCallback((e: KeyboardEvent) => {
        if (e.target instanceof HTMLElement && e.target.closest('a,button')) return
        e.preventDefault()
        const experiment = experiments[Math.max(0, activeIndex())]
        navigate({ to: '/experiments/$id', params: { id: experiment.id } })
    }, [activeIndex, experiments, navigate])
    const openOpts = { enabled, preventDefault: false, meta: { name: 'Open experiment', group: GROUP } }
    useHotkey('Enter', open, openOpts)
    useHotkey('O', open, openOpts)

    return (
        <div>
            <ListNavHint className="mb-2" />
            <div ref={containerRef} className="relative">
                {experiments.map((experiment, index) => (
                    <ExperimentPoster
                        key={experiment.id}
                        experiment={experiment}
                        index={index}
                        total={experiments.length}
                    />
                ))}
            </div>
        </div>
    )
}
