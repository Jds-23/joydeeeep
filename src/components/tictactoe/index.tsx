import React, { useState } from 'react';
import { emptyBoard, useGameQuery, useGameMutation } from '../../lib/ttt/hook';
import { Connect } from '../Connect';
import Square from './Square';
import { useQueryState } from 'nuqs'

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

const TicTacToe: React.FC = () => {
    // const [board, setBoard] = useState<(string | null)[]>(emptyBoard);
    const [gameId] = useQueryState("id");
    const id = gameId ? BigInt(gameId) : undefined;
    const { data: gameData, refetch: refetchGame, } = useGameQuery(id);
    const board = gameData?.board ?? emptyBoard;
    const [xIsNext, setXIsNext] = useState(true);
    const [boardAnimKey, setBoardAnimKey] = useState(0);
    const result = calculateWinner(board);
    const winner = result?.winner;
    const winLine = result?.line;
    const { mutate: gameMutation } = useGameMutation(
        {
            onSuccess: () => {
                refetchGame().then(({ data }) => {
                    console.log(data)
                })
            }
        }
    );
    function handleClick(index: number) {
        if (!id) {
            return;
        }
        gameMutation({
            type: "play",
            id,
            position: index
        })
    }

    console.log(gameData)

    function handleReset() {
        // setBoard(emptyBoard);
        setXIsNext(true);
        setBoardAnimKey(k => k + 1);
    }

    let status;
    if (winner) {
        status = `Winner: ${winner}`;
    } else if (board.every(Boolean)) {
        status = "It's a draw!";
    } else {
        status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    }

    // Win line SVG
    const winLineSVG = winLine ? (() => {
        // Map board index to SVG grid coordinates
        const pos = [
            [0, 0], [1, 0], [2, 0],
            [0, 1], [1, 1], [2, 1],
            [0, 2], [1, 2], [2, 2],
        ];
        const [a, b, c] = winLine;
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
        <div className="flex flex-col items-center">
            <div className="mb-4 text-lg font-semibold text-gray-700">{status}</div>
            <div className="relative w-[270px] h-[270px]">
                <svg
                    key={boardAnimKey}
                    className={`absolute top-0 left-0 w-full h-full pointer-events-none z-20`}
                    viewBox="0 0 150 150"
                >
                    {/* Vertical line 1 */}
                    <line
                        x1="50" y1="150" x2="50" y2="150"
                        className="stroke-gray-500"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <animate attributeName="y1" from="150" to="0" dur="0.5s" fill="freeze" />
                    </line>
                    {/* Vertical line 2 (reverse growth) */}
                    <line
                        x1="100" y1="0" x2="100" y2="0"
                        className="stroke-gray-500"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <animate attributeName="y2" from="0" to="150" dur="0.5s" fill="freeze" />
                    </line>
                    {/* Horizontal line 1 */}
                    <line
                        x1="0" y1="50" x2="0" y2="50"
                        className="stroke-gray-500"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <animate attributeName="x2" from="0" to="150" dur="0.5s" fill="freeze" />
                    </line>
                    {/* Horizontal line 2 (reverse growth) */}
                    <line
                        x1="150" y1="100" x2="150" y2="100"
                        className="stroke-gray-500"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
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
                                if (val) {
                                    return;
                                }
                                handleClick(i)
                            }}
                            highlight={winLine?.includes(i)}
                        />
                    ))}
                </div>
            </div>
            <button
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={handleReset}
            >
                Reset
            </button>
            <Connect />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const opponent = formData.get("opponent") as `0x${string}`;
                    gameMutation({
                        type: "newGame",
                        opponent: opponent
                    })
                }}
            >
                <input className='border-2 border-gray-300 rounded-md px-2 py-1' type="text" name="opponent" placeholder="Opponent address" />
                <button
                    className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    type="submit"
                >
                    New Game
                </button>
            </form>
            {/* <button
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => {
                    gameMutation({
                        type: "newGame",
                        opponent: "0xa31aBd41FfA26cC22C6e78761756985275513C88"
                    })
                }}
            >
                New Game
            </button> */}
            {/* Tailwind custom keyframes for SVG draw animations */}
            <style>{`
        @layer utilities {
          @keyframes draw-x {
            0% { stroke-dasharray: 0 56; }
            50% { stroke-dasharray: 28 28; }
            100% { stroke-dasharray: 56 0; }
          }
          .animate-draw-x line {
            stroke-dasharray: 56;
            stroke-dashoffset: 56;
            animation: draw-x 0.4s cubic-bezier(.4,0,.2,1) forwards;
          }
          @keyframes draw-o {
            0% { stroke-dasharray: 0 100; }
            100% { stroke-dasharray: 100 0; }
          }
          .animate-draw-o circle {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: draw-o 0.4s cubic-bezier(.4,0,.2,1) forwards;
          }
          @keyframes draw-win {
            0% { stroke-dasharray: 0 200; }
            100% { stroke-dasharray: 200 0; }
          }
          .animate-draw-win {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            animation: draw-win 0.5s cubic-bezier(.4,0,.2,1) forwards;
          }
          @keyframes board-lines {
            0% { opacity: 0; transform: scaleX(0.7) scaleY(0.7); }
            60% { opacity: 1; transform: scaleX(1.05) scaleY(1.05); }
            100% { opacity: 1; transform: scaleX(1) scaleY(1); }
          }
          .animate-board-lines {
            animation: board-lines 0.6s cubic-bezier(.4,0,.2,1);
          }
        }
      `}</style>
        </div>
    );
};

export default TicTacToe;
