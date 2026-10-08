import { Link } from '@tanstack/react-router'
import type { Experiment } from '../constant/experiment'

export const CARD_TRAVEL_VH = 130
export const PEEK_OFFSET_PX = 22
export const BASE_TOP_PX = 16

export function ExperimentPoster({
    experiment,
    index,
    total,
}: { experiment: Experiment; index: number; total: number }) {
    return (
        <>
            {/* in-flow spacer: defines this card's own scroll slice */}
            <div style={{ height: `${CARD_TRAVEL_VH}vh` }} />

            {/* out-of-flow runway: keeps the card's sticky containing block alive through the rest of the stack, so it stays pinned (peeking) instead of scrolling away once its own slice ends */}
            <div
                className="absolute inset-x-0"
                style={{ top: `${index * CARD_TRAVEL_VH}vh`, height: `${(total - index) * CARD_TRAVEL_VH}vh` }}
            >
                <div
                    className="sticky flex items-center justify-center px-4"
                    style={{ top: `${BASE_TOP_PX + index * PEEK_OFFSET_PX}px`, zIndex: index + 1 }}
                >
                    <div className="w-full max-w-3xl h-[52vh] md:h-[58vh] rounded-lg border-2 border-neutral-900 text-neutral-900 bg-white flex flex-col justify-between p-3 overflow-hidden">
                        <Link
                            to="/experiments/$id"
                            params={{ id: experiment.id }}
                            className="flex flex-col h-full justify-between"
                        >
                            <span className="font-mono text-xs md:text-sm tracking-widest">
                                {experiment.id}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold leading-[1.05] tracking-tight">
                                {experiment.title}
                            </h2>
                            <time className="text-xs md:text-sm" dateTime={experiment.date}>
                                {experiment.date}
                            </time>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
