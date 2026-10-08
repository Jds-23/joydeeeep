import { createFileRoute, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { playlists, type Track } from '../constant/playlists'
import { useListNav } from '../lib/hooks/useListNav'
import { slugify } from '../lib/utils/slug'
import { cn } from '../lib/utils/cn'
import { ListNavHint } from '../components/command/KeyHint'

export const Route = createFileRoute('/playlists')({
    component: PlaylistsPage,
})

// keyboard order follows on-screen playlist order
const ordered = playlists.flatMap(playlist => playlist.tracks);

const FLASH_MS = 1500;

function TrackItem({ track, active, flash, ref }: { track: Track; active: boolean; flash: boolean; ref: (el: HTMLElement | null) => void }) {
    return (
        <article
            id={slugify(track.title)}
            ref={ref}
            className={cn(
                'mb-4 last:mb-0 p-4 border border-gray-200 rounded-lg scroll-mt-24 transition-colors duration-500',
                active && 'border-neutral-900 ring-2 ring-neutral-900',
                flash && 'bg-yellow-100',
            )}
        >
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    {track.link ? (
                        <a href={track.link} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-500">
                            {track.title}
                        </a>
                    ) : (
                        <span className="font-bold text-gray-900">{track.title}</span>
                    )}
                    {track.kind === 'album' && (
                        <span className="text-xs uppercase tracking-wide px-1.5 py-0.5 border border-gray-300 rounded text-gray-600">Album</span>
                    )}
                </div>
                <span className="text-sm text-gray-500">
                    {track.artist} · <span className="italic">{track.movie}</span>
                </span>
                {track.note && <p className="text-sm text-gray-700">{track.note}</p>}
            </div>
        </article>
    );
}

export default function PlaylistsPage() {
    const hash = useLocation({ select: (location) => location.hash });
    const { activeIndex, setActiveIndex, register } = useListNav({ count: ordered.length });
    const [flashSlug, setFlashSlug] = useState<string | null>(null);

    useEffect(() => {
        if (!hash) return;
        const index = ordered.findIndex((track) => slugify(track.title) === hash);
        if (index < 0) return;
        setActiveIndex(index);
        setFlashSlug(hash);
        const timer = setTimeout(() => setFlashSlug(null), FLASH_MS);
        return () => clearTimeout(timer);
    }, [hash, setActiveIndex]);

    return (
        <div className="flex flex-col p-6 min-h-screen max-w-2xl mx-auto">
            <header className="mb-8 flex items-end justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Playlists</h1>
                <ListNavHint />
            </header>

            <main className="flex flex-col gap-8">
                {playlists.map(({ id, title, tracks }) => (
                    <section key={id} aria-label={title}>
                        <h2 className="text-lg font-bold text-gray-800 mb-3">{title}</h2>
                        {tracks.map((track) => {
                            const index = ordered.indexOf(track);
                            return (
                                <TrackItem
                                    key={track.title}
                                    track={track}
                                    ref={register(index)}
                                    active={index === activeIndex}
                                    flash={flashSlug === slugify(track.title)}
                                />
                            );
                        })}
                    </section>
                ))}
            </main>
        </div>
    );
}
