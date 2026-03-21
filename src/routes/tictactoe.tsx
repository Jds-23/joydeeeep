import { createFileRoute } from '@tanstack/react-router'
import TicTacToe from '../components/tictactoe'

export const Route = createFileRoute('/tictactoe')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div className="flex flex-col p-6 min-h-screen max-w-2xl mx-auto">
        <div className="mt-4 border-2 border-black rounded-md p-4">
            <h3 className="text-lg font-bold">EXP:0004 TicTacToe</h3>
            <TicTacToe />
        </div>
    </div>
}
