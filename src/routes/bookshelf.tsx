import { createFileRoute } from '@tanstack/react-router'
import { books, type Book, type BookStatus } from '../constant/books'

export const Route = createFileRoute('/bookshelf')({
    component: BookshelfPage,
})

const sections: { status: BookStatus; label: string }[] = [
    { status: 'reading', label: 'Reading' },
    { status: 'read', label: 'Read' },
    { status: 'want', label: 'Want to read' },
    { status: 'paused', label: 'Left halfway, want to pick up later' },
];

function BookItem({ book }: { book: Book }) {
    return (
        <article className="mb-4 last:mb-0 p-4 border border-gray-200 rounded-lg">
            <div className="flex flex-col gap-1">
                {book.link ? (
                    <a href={book.link} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-500">
                        {book.title}
                    </a>
                ) : (
                    <span className="font-bold text-gray-900">{book.title}</span>
                )}
                <span className="text-sm text-gray-500">{book.author}</span>
                {book.note && <p className="text-sm text-gray-700">{book.note}</p>}
            </div>
        </article>
    );
}

export default function BookshelfPage() {
    return (
        <div className="flex flex-col p-6 min-h-screen max-w-2xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Bookshelf</h1>
            </header>

            <main className="flex flex-col gap-8">
                {sections.map(({ status, label }) => {
                    const items = books.filter((book) => book.status === status);
                    if (items.length === 0) return null;
                    return (
                        <section key={status} aria-label={label}>
                            <h2 className="text-lg font-bold text-gray-800 mb-3">{label}</h2>
                            {items.map((book) => (
                                <BookItem key={book.title} book={book} />
                            ))}
                        </section>
                    );
                })}
            </main>
        </div>
    );
}
