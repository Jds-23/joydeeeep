import { createFileRoute } from '@tanstack/react-router'
import TicTacToe from '../components/tictactoe'

export const Route = createFileRoute('/tictactoe')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div className="flex flex-col p-4 min-h-screen max-w-2xl mx-auto">
        <div className="mt-2 border-2 border-black rounded-md p-3">
            <h3 className="text-base font-bold">EXP:0004 TicTacToe</h3>
            <TicTacToe />
        </div>
    </div>
}
