import React, { useState, useCallback } from 'react';
import { emptyBoard, useGameQuery, useGameMutation, type Board } from '../../lib/ttt/hook';
import { Connect } from '../Connect';
import Square from './Square';
import { useQueryState } from 'nuqs'
import { useZeroDev } from '../../lib/zerodev/provider';
import { zeroAddress } from 'viem';
import { ellipsis } from '../../lib/utils/ellipsis';
import { Button } from '../ui/button';
import { useHotkey, useHotkeys, type Hotkey } from '@tanstack/react-hotkeys';
import { usePalette } from '../../lib/hooks/usePalette';
import { Kbd } from '../command/KeyHint';

const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function calculateWinner(squares: (string | null)[]) {
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] };
        }
    }
    return null;
}

interface TicTacToeBoardProps {
    board: Board;
    winLine?: number[];
    onSquareClick: (index: number) => void;
    boardAnimKey: number;
}

const BOARD_KEYS_GROUP = 'TicTacToe';
const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const satisfies Hotkey[];

/** Keyboard cursor over the board. Keys only move the cursor; Enter/Space submits the move tx. */
function useBoardCursor(onSubmit: (index: number) => void) {
    const { isOpen } = usePalette();
    const [cursor, setCursor] = useState(4);
    const enabled = !isOpen;

    const move = (dx: number, dy: number) => setCursor(prev => {
        const x = Math.min(2, Math.max(0, (prev % 3) + dx));
        const y = Math.min(2, Math.max(0, Math.floor(prev / 3) + dy));
        return y * 3 + x;
    });
    const moveMeta = { name: 'Move cursor', group: BOARD_KEYS_GROUP };
    useHotkeys([
        { hotkey: 'ArrowUp', callback: () => move(0, -1) },
        { hotkey: 'ArrowDown', callback: () => move(0, 1) },
        { hotkey: 'ArrowLeft', callback: () => move(-1, 0) },
        { hotkey: 'ArrowRight', callback: () => move(1, 0) },
    ], { enabled, meta: moveMeta });
    // reading order: 1 = top-left, 9 = bottom-right
    useHotkeys(DIGITS.map((digit, i) => ({ hotkey: digit, callback: () => setCursor(i) })), {
        enabled,
        meta: { name: 'Jump cursor to square', group: BOARD_KEYS_GROUP },
    });

    const submit = (e: KeyboardEvent) => {
        // a focused square handles Enter/Space natively (it's a button)
        if (e.target instanceof HTMLElement && e.target.closest('a,button')) return;
        e.preventDefault();
        onSubmit(cursor);
    };
    const submitOpts = { enabled, preventDefault: false, meta: { name: 'Play square', group: BOARD_KEYS_GROUP } };
    useHotkey('Enter', submit, submitOpts);
    useHotkey('Space', submit, submitOpts);

    return [cursor, setCursor] as const;
}

const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({ board, winLine, onSquareClick, boardAnimKey }) => {
    const [cursor, setCursor] = useBoardCursor(onSquareClick);
    // Win line SVG
    const winLineSVG = winLine ? (() => {
        const pos = [
            [0, 0], [1, 0], [2, 0],
            [0, 1], [1, 1], [2, 1],
            [0, 2], [1, 2], [2, 2],
        ];
        const [a, , c] = winLine;
        const [x1, y1] = pos[a];
        const [x2, y2] = pos[c];
        return (
            <line
                x1={`${x1 * 50 + 25}`}
                y1={`${y1 * 50 + 25}`}
                x2={`${x2 * 50 + 25}`}
                y2={`${y2 * 50 + 25}`}
                className="stroke-green-500 animate-draw-win"
                strokeWidth="6"
                strokeLinecap="round"
            />
        );
    })() : null;

    return (
        <>
        <div className="relative w-[216px] h-[216px]">
            <svg
                key={boardAnimKey}
                className={`absolute top-0 left-0 w-full h-full pointer-events-none z-20`}
                viewBox="0 0 150 150"
            >
                {/* Vertical line 1 */}
                <line x1="50" y1="150" x2="50" y2="150" className="stroke-gray-500" strokeWidth="2" strokeLinecap="round">
                    <animate attributeName="y1" from="150" to="0" dur="0.5s" fill="freeze" />
                </line>
                {/* Vertical line 2 (reverse growth) */}
                <line x1="100" y1="0" x2="100" y2="0" className="stroke-gray-500" strokeWidth="2" strokeLinecap="round">
                    <animate attributeName="y2" from="0" to="150" dur="0.5s" fill="freeze" />
                </line>
                {/* Horizontal line 1 */}
                <line x1="0" y1="50" x2="0" y2="50" className="stroke-gray-500" strokeWidth="2" strokeLinecap="round">
                    <animate attributeName="x2" from="0" to="150" dur="0.5s" fill="freeze" />
                </line>
                {/* Horizontal line 2 (reverse growth) */}
                <line x1="150" y1="100" x2="150" y2="100" className="stroke-gray-500" strokeWidth="2" strokeLinecap="round">
                    <animate attributeName="x1" from="150" to="0" dur="0.5s" fill="freeze" />
                </line>
                {/* Win line */}
                {winLineSVG}
            </svg>
            <div className="absolute top-0 left-0 w-full h-full grid grid-cols-3 grid-rows-3 z-10">
                {board.map((val, i) => (
                    <Square
                        key={i}
                        value={val}
                        onClick={() => {
                            setCursor(i);
                            onSquareClick(i);
                        }}
                        highlight={winLine?.includes(i)}
                        cursor={i === cursor}
                    />
                ))}
            </div>
        </div>
        <p className="hidden pointer-fine:flex items-center gap-1 mt-3 text-xs text-neutral-500">
            <Kbd>←↑↓→</Kbd>
            <span>or</span>
            <Kbd>1–9</Kbd>
            <span className="mr-2">move</span>
            <Kbd>↵</Kbd>
            <span>play</span>
        </p>
        </>
    );
};

interface TicTacToeStatusProps {
    status: string;
}
const TicTacToeStatus: React.FC<TicTacToeStatusProps> = ({ status }) => (
    <div className="mb-2 text-base text-center font-semibold text-gray-700">{status}</div>
);

interface NewGameFormProps {
    onNewGame: (opponent: string) => void;
}
const NewGameForm: React.FC<NewGameFormProps> = ({ onNewGame }) => {
    const [opponent, setOpponent] = useState('');
    return (
        <form
            className="flex gap-2 items-center"
            onSubmit={e => {
                e.preventDefault();
                onNewGame(opponent);
            }}
        >
            <input
                className='border-2 border-black rounded-md px-2 py-1'
                type="text"
                name="opponent"
                placeholder="Opponent address"
                value={opponent}
                onChange={e => setOpponent(e.target.value)}
            />
            <Button
                className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                type="submit"
            >
                New Game
            </Button>
        </form>
    );
};

const TicTacToe: React.FC = () => {
    const { address } = useZeroDev();
    const [gameId] = useQueryState("id");
    const id = gameId ? BigInt(gameId) : undefined;
    const { data: gameData } = useGameQuery(id);
    const [boardAnimKey,] = useState(0);
    const result = calculateWinner(gameData?.board ?? emptyBoard);
    const winLine = result?.line;
    const { mutate: gameMutation } = useGameMutation();

    const handleClick = useCallback((index: number) => {
        if (!id) return;
        gameMutation({ type: "play", id, position: index });
    }, [id, gameMutation]);

    const handleNewGame = useCallback((opponent: string) => {
        gameMutation({ type: "newGame", opponent: opponent as `0x${string}` });
    }, [gameMutation]);

    let status;
    if (!address) {
        status = "Sign to play TicTacToe";
    } else if (address && !id) {
        status = "Create new game";
    } else if (address && id && gameData?.players && !gameData.players.includes(address)) {
        status = "Not your game";
    } else if (gameData?.whoWon && gameData.players && gameData.whoWon !== zeroAddress) {
        const { whoWon, players } = gameData;
        status = `Winner: ${whoWon === players[0] ? 'X' : 'O'} ${ellipsis(whoWon, 4)}`;
    } else if ((gameData?.board ?? emptyBoard).every(Boolean)) {
        status = "It's a draw!";
    } else if (gameData?.turn && gameData.players) {
        const { turn, players } = gameData;
        status = `Next player: ${turn === players[0] ? 'X' : 'O'}(${address === turn ? 'You' : 'Opponent'})`;
    } else {
        status = "Loading...";
    }

    return (
        <div className="flex flex-col items-center h-72">
            <div className="mb-2">
                <Connect />
            </div>
            {!address && <TicTacToeStatus status={status} />}
            {address && !id && (
                <>
                    <TicTacToeStatus status={status} />
                    <NewGameForm onNewGame={handleNewGame} />
                </>
            )}

            {address && id && gameData?.players && !gameData.players.includes(address) && (
                <>
                    <TicTacToeStatus status={status} />
                    <NewGameForm onNewGame={handleNewGame} />
                </>
            )}

            {address && id && !((gameData?.whoWon && gameData.whoWon !== zeroAddress) || (gameData?.board ?? emptyBoard).every(Boolean)) && (
                <>
                    <TicTacToeStatus status={status} />
                    <TicTacToeBoard
                        board={gameData?.board ?? emptyBoard}
                        winLine={winLine}
                        onSquareClick={handleClick}
                        boardAnimKey={boardAnimKey}
                    />
                </>
            )}
            {address && id && ((gameData?.whoWon && gameData.whoWon !== zeroAddress) || (gameData?.board ?? emptyBoard).every(Boolean)) && (
                <>
                    <TicTacToeStatus status={status} />
                    <NewGameForm onNewGame={handleNewGame} />
                </>
            )}
        </div>
    );
};

export default TicTacToe;
