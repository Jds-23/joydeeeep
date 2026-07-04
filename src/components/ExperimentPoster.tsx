import { Link } from '@tanstack/react-router'
import type { Experiment } from '../constant/experiment'

const CARD_TRAVEL_VH = 160
const PEEK_OFFSET_PX = 28
const BASE_TOP_PX = 24

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
                    <div className="w-full max-w-4xl h-[68vh] md:h-[72vh] rounded-lg border-2 border-neutral-900 text-neutral-900 bg-white flex flex-col justify-between p-4 overflow-hidden">
                        <Link
                            to="/experiments/$id"
                            params={{ id: experiment.id }}
                            className="flex flex-col h-full justify-between"
                        >
                            <span className="font-mono text-sm md:text-base tracking-widest">
                                {experiment.id}
                            </span>
                            <h2 className="text-4xl md:text-7xl font-bold leading-[1.05] tracking-tight">
                                {experiment.title}
                            </h2>
                            <time className="text-sm md:text-lg" dateTime={experiment.date}>
                                {experiment.date}
                            </time>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
