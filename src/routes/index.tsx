import { WagmiProvider } from "wagmi"
import TicTacToe from "../components/tictactoe"
import { wagmiConfig } from "../wagmi"
import { createFileRoute } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
const queryClient = new QueryClient()

export const Route = createFileRoute('/')({
    component: App,
})

function App() {

    return (
        <div className="flex flex-col p-4 h-screen max-w-screen-sm mx-auto">
            <h2 className="text-xl font-bold ">Hello there, this page is made by Joydeep.</h2>
            <p className="text-sm">Who's that?</p>
            <p className="text-sm">A 2001-born from Purulia, WB, India.</p>
            <p className="text-sm">Currently I code for a living. And i like it too. Anyways, that's only thing I'm decent in.</p>
            <p className="text-sm">I also used to enjoyed MCU movies(all before Endgame and Loki series).</p>
            <p className="text-sm">A fan of <a href="https://www.kkr.in/" className="text-blue-500">KKR</a> and <a href="https://www.fcbarcelona.com/" className="text-blue-500">FC Barcelona</a>. I know Messi's the 🐐</p>
            <p className="text-sm">Recently I've been watching animes, Demon Slayer is my favorite. Currently watching One Piece.(could be my new favorite)</p>
            <p className="text-sm">Talk to me about ethereum UX(aa,interop,wallets,etc) <a href="https://twitter.com/0xJoydeeeep" className="text-blue-500">Twitter</a>. Check out my <a href="https://github.com/Jds-23" className="text-blue-500">Github</a>. I also write sometimes on <a href="https://substack.com/@0xjoydeeeep" className="text-blue-500">substack</a>.</p>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <TicTacToe />
                </QueryClientProvider>
            </WagmiProvider>
        </div>
    )
}


