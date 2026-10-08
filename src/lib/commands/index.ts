import type { useNavigate } from '@tanstack/react-router'
import { experiments } from '../../constant/experiment'
import { books } from '../../constant/books'
import { playlists } from '../../constant/playlists'
import { redirects } from '../../constant/redirects'
import { slugify } from '../utils/slug'

export type CommandGroup = 'Pages' | 'Experiments' | 'Books' | 'Playlists' | 'Links' | 'Actions'

export interface CommandContext {
    navigate: ReturnType<typeof useNavigate>
    showShortcuts: () => void
}

export interface CommandItem {
    id: string
    group: CommandGroup
    label: string
    detail?: string
    keywords?: string[]
    /** Display-only key sequence, e.g. ['G', 'E'] */
    shortcut?: string[]
    /** Keep the palette open after running (e.g. switching to shortcuts view) */
    keepOpen?: boolean
    run: (ctx: CommandContext) => void
}

const openExternal = (href: string) => window.open(href, '_blank', 'noopener,noreferrer')

const socials = [
    { label: 'Twitter', href: 'https://x.com/0xJoydeeeep' },
    { label: 'GitHub', href: 'https://github.com/Jds-23' },
    { label: 'Substack', href: 'https://substack.com/@0xjoydeeeep' },
]

const pages: CommandItem[] = [
    { id: 'page:home', group: 'Pages', label: 'Home', shortcut: ['G', 'H'], run: ({ navigate }) => navigate({ to: '/' }) },
    { id: 'page:experiments', group: 'Pages', label: 'Experiments', shortcut: ['G', 'E'], run: ({ navigate }) => navigate({ to: '/experiments' }) },
    { id: 'page:bookshelf', group: 'Pages', label: 'Bookshelf', shortcut: ['G', 'B'], run: ({ navigate }) => navigate({ to: '/bookshelf' }) },
    { id: 'page:playlists', group: 'Pages', label: 'Playlists', shortcut: ['G', 'P'], run: ({ navigate }) => navigate({ to: '/playlists' }) },
    { id: 'page:tictactoe', group: 'Pages', label: 'TicTacToe', shortcut: ['G', 'T'], run: ({ navigate }) => navigate({ to: '/tictactoe' }) },
]

const experimentItems: CommandItem[] = experiments.map(exp => ({
    id: `exp:${exp.id}`,
    group: 'Experiments',
    label: exp.title,
    detail: exp.id,
    keywords: [exp.id, exp.date],
    run: ({ navigate }) => navigate({ to: '/experiments/$id', params: { id: exp.id } }),
}))

const bookItems: CommandItem[] = books.map(book => ({
    id: `book:${slugify(book.title)}`,
    group: 'Books',
    label: book.title,
    detail: book.author,
    keywords: [book.author, book.status],
    run: ({ navigate }) => navigate({ to: '/bookshelf', hash: slugify(book.title) }),
}))

const trackItems: CommandItem[] = playlists.flatMap(playlist =>
    playlist.tracks.map(track => ({
        id: `track:${slugify(track.title)}`,
        group: 'Playlists' as const,
        label: track.title,
        detail: `${track.artist} · ${track.movie}`,
        keywords: [track.artist, track.movie, playlist.title],
        run: ({ navigate }: CommandContext) => navigate({ to: '/playlists', hash: slugify(track.title) }),
    })),
)

const linkItems: CommandItem[] = [
    ...socials.map(s => ({ id: `link:${s.label}`, label: s.label, href: s.href })),
    ...redirects
        .filter(r => !socials.some(s => s.href === r.link))
        .map(r => ({ id: `link:${r.id}`, label: r.id, href: r.link })),
].map(({ id, label, href }) => ({
    id,
    group: 'Links' as const,
    label,
    detail: new URL(href).hostname,
    keywords: [href],
    run: () => openExternal(href),
}))

const experimentLinkActions: CommandItem[] = experiments.flatMap(exp =>
    exp.links.map(link => ({
        id: `exp-link:${exp.id}:${link.text}`,
        group: 'Actions' as const,
        label: `${exp.id} → ${link.text}`,
        detail: exp.title,
        keywords: [exp.title, link.href],
        run: ({ navigate }: CommandContext) => (link.external ? openExternal(link.href) : navigate({ to: link.href })),
    })),
)

const actions: CommandItem[] = [
    { id: 'action:shortcuts', group: 'Actions', label: 'Show keyboard shortcuts', shortcut: ['?'], keepOpen: true, run: ({ showShortcuts }) => showShortcuts() },
    { id: 'action:copy-url', group: 'Actions', label: 'Copy current URL', run: () => void navigator.clipboard?.writeText(window.location.href) },
    { id: 'action:top', group: 'Actions', label: 'Scroll to top', run: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    ...experimentLinkActions,
]

export const commands: CommandItem[] = [...pages, ...experimentItems, ...bookItems, ...trackItems, ...linkItems, ...actions]

export const commandGroups: CommandGroup[] = ['Pages', 'Experiments', 'Books', 'Playlists', 'Links', 'Actions']
