import { createFileRoute, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { books, type Book, type BookStatus } from '../constant/books'
import { useListNav } from '../lib/hooks/useListNav'
import { slugify } from '../lib/utils/slug'
import { cn } from '../lib/utils/cn'
import { ListNavHint } from '../components/command/KeyHint'

export const Route = createFileRoute('/bookshelf')({
    component: BookshelfPage,
})

const sections: { status: BookStatus; label: string }[] = [
    { status: 'reading', label: 'Reading' },
    { status: 'read', label: 'Read' },
    { status: 'want', label: 'Want to read' },
    { status: 'paused', label: 'Left halfway, want to pick up later' },
];

const grouped = sections
    .map(section => ({ ...section, items: books.filter((book) => book.status === section.status) }))
    .filter(section => section.items.length > 0);

// keyboard order follows on-screen section order
const ordered = grouped.flatMap(section => section.items);

const FLASH_MS = 1500;

function BookItem({ book, active, flash, ref }: { book: Book; active: boolean; flash: boolean; ref: (el: HTMLElement | null) => void }) {
    return (
        <article
            id={slugify(book.title)}
            ref={ref}
            className={cn(
                'mb-2 last:mb-0 px-3 py-2 border border-gray-200 rounded-md scroll-mt-16 transition-colors duration-500',
                active && 'border-neutral-900 ring-2 ring-neutral-900',
                flash && 'bg-yellow-100',
            )}
        >
            <div className="flex flex-col gap-0.5">
                {book.link ? (
                    <a href={book.link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-500">
                        {book.title}
                    </a>
                ) : (
                    <span className="text-sm font-bold text-gray-900">{book.title}</span>
                )}
                <span className="text-xs text-gray-500">{book.author}</span>
                {book.note && <p className="text-xs text-gray-700">{book.note}</p>}
            </div>
        </article>
    );
}

export default function BookshelfPage() {
    const hash = useLocation({ select: (location) => location.hash });
    const { activeIndex, setActiveIndex, register } = useListNav({ count: ordered.length });
    const [flashSlug, setFlashSlug] = useState<string | null>(null);

    useEffect(() => {
        if (!hash) return;
        const index = ordered.findIndex((book) => slugify(book.title) === hash);
        if (index < 0) return;
        setActiveIndex(index);
        setFlashSlug(hash);
        const timer = setTimeout(() => setFlashSlug(null), FLASH_MS);
        return () => clearTimeout(timer);
    }, [hash, setActiveIndex]);

    return (
        <div className="flex flex-col p-4 min-h-screen max-w-2xl mx-auto">
            <header className="mb-4 flex items-end justify-between gap-4">
                <h1 className="text-xl font-bold text-gray-900">Bookshelf</h1>
                <ListNavHint />
            </header>

            <main className="flex flex-col gap-5">
                {grouped.map(({ status, label, items }) => (
                    <section key={status} aria-label={label}>
                        <h2 className="text-sm font-bold text-gray-800 mb-1.5">{label}</h2>
                        {items.map((book) => {
                            const index = ordered.indexOf(book);
                            return (
                                <BookItem
                                    key={book.title}
                                    book={book}
                                    ref={register(index)}
                                    active={index === activeIndex}
                                    flash={flashSlug === slugify(book.title)}
                                />
                            );
                        })}
                    </section>
                ))}
            </main>
        </div>
    );
}
