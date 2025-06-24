import { createFileRoute } from '@tanstack/react-router'
import TicTacToe from '../components/tictactoe'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '../wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

export const Route = createFileRoute('/tictactoe')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div className="flex flex-col p-6 min-h-screen max-w-2xl mx-auto">
        <div className="mt-4 border-2 border-black rounded-md p-4">
            <h3 className="text-lg font-bold">EXP:0004 TicTacToe</h3>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <TicTacToe />
                </QueryClientProvider>
            </WagmiProvider>
        </div>
    </div>
}
