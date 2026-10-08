import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { formatForDisplay } from '@tanstack/react-hotkeys'
import { Search } from 'lucide-react'
import { ZeroDevProvider } from '../lib/zerodev/provider'
import { PaletteProvider } from '../components/command/PaletteProvider'
import { CommandPalette } from '../components/command/CommandPalette'
import { KeyHint } from '../components/command/KeyHint'
import { useGlobalHotkeys } from '../lib/hooks/useGlobalHotkeys'
import { usePalette } from '../lib/hooks/usePalette'

const queryClient = new QueryClient()

function CommandCenter() {
  useGlobalHotkeys()
  return <CommandPalette />
}

function CommandCenterButton() {
  const { open } = usePalette()
  return (
    <button
      type="button"
      onClick={() => open()}
      className="ml-auto shrink-0 inline-flex items-center gap-2 px-2 py-0.5 text-sm border-2 border-neutral-900 rounded-md hover:bg-neutral-100"
      aria-label="Open command center"
    >
      <Search className="size-4" aria-hidden />
      <span className="hidden sm:inline">Command</span>
      <KeyHint keys={[formatForDisplay('Mod+K')]} />
    </button>
  )
}

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <ZeroDevProvider>
        <PaletteProvider>
          <div className="p-2 flex items-center gap-2">
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>{' '}
            <Link to="/experiments" className="[&.active]:font-bold">
              Experiments
            </Link>{' '}
            <Link to="/bookshelf" className="[&.active]:font-bold">
              Bookshelf
            </Link>{' '}
            <Link to="/playlists" className="[&.active]:font-bold">
              Playlists
            </Link>
            <CommandCenterButton />
          </div>
          <hr />
          <Outlet />
          <CommandCenter />
          <ReactQueryDevtools initialIsOpen={false} />
          <TanStackRouterDevtools />
        </PaletteProvider>
      </ZeroDevProvider>
    </QueryClientProvider>
  ),
})
