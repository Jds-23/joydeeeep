import { useHotkey, useHotkeySequence } from '@tanstack/react-hotkeys'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { usePalette } from './usePalette'

const GROUP = 'Global'

function parentPath(pathname: string): string | null {
    if (pathname === '/') return null
    if (pathname.startsWith('/experiments/')) return '/experiments'
    return '/'
}

export function useGlobalHotkeys() {
    const navigate = useNavigate()
    const pathname = useRouterState({ select: s => s.location.pathname })
    const { isOpen, open, close } = usePalette()
    const parent = parentPath(pathname)
    const idle = !isOpen

    useHotkey('Mod+K', () => (isOpen ? close() : open()), { meta: { name: 'Command center', group: GROUP } })
    useHotkey('/', () => open(), { enabled: idle, meta: { name: 'Command center', group: GROUP } })
    useHotkey('?', () => open('shortcuts'), { enabled: idle, meta: { name: 'Show shortcuts', group: GROUP } })

    const goBack = () => parent && navigate({ to: parent })
    const backOpts = { enabled: idle && parent !== null, meta: { name: 'Go to parent page', group: GROUP } }
    useHotkey('U', goBack, backOpts)
    useHotkey('Backspace', goBack, backOpts)

    const seq = (name: string) => ({ enabled: idle, meta: { name, group: 'Go to' } })
    useHotkeySequence(['G', 'H'], () => navigate({ to: '/' }), seq('Home'))
    useHotkeySequence(['G', 'E'], () => navigate({ to: '/experiments' }), seq('Experiments'))
    useHotkeySequence(['G', 'B'], () => navigate({ to: '/bookshelf' }), seq('Bookshelf'))
    useHotkeySequence(['G', 'T'], () => navigate({ to: '/tictactoe' }), seq('TicTacToe'))
}
