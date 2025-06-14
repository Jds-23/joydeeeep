import React, { useState } from 'react';

const emptyBoard = Array(9).fill(null);

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

const Square: React.FC<{
    value: string | null;
    onClick: () => void;
    highlight?: boolean;
}> = ({ value, onClick, highlight }) => {
    return (
        <button
            className={`w-full h-full flex items-center justify-center bg-white transition-colors duration-200 focus:outline-none active:bg-gray-100 ${highlight ? 'bg-yellow-100' : ''
                }`}
            onClick={onClick}
            data-testid="square"
            style={{ aspectRatio: '1 / 1' }}
        >
            {value === 'X' && (
                <svg
                    className="w-12 h-12 stroke-blue-500 animate-draw-x"
                    viewBox="0 0 48 48"
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                >
                    <line x1="8" y1="8" x2="40" y2="40" />
                    <line x1="40" y1="8" x2="8" y2="40" />
                </svg>
            )}
            {value === 'O' && (
                <svg
                    className="w-12 h-12 stroke-red-500 animate-draw-o"
                    viewBox="0 0 48 48"
                    fill="none"
                    strokeWidth="4"
                >
                    <circle cx="24" cy="24" r="16" />
                </svg>
            )}
        </button>
    );
};

const TicTacToe: React.FC = () => {
    const [board, setBoard] = useState<(string | null)[]>(emptyBoard);
    const [xIsNext, setXIsNext] = useState(true);
    const [animateBoard, setAnimateBoard] = useState(false);
    const result = calculateWinner(board);
    const winner = result?.winner;
    const winLine = result?.line;

    function handleClick(index: number) {
        if (board[index] || winner) return;
        const newBoard = board.slice();
        newBoard[index] = xIsNext ? 'X' : 'O';
        setBoard(newBoard);
        setXIsNext(!xIsNext);
    }

    function handleReset() {
        setAnimateBoard(true);
        setBoard(emptyBoard);
        setXIsNext(true);
        setTimeout(() => setAnimateBoard(false), 600); // match animation duration
    }

    let status;
    if (winner) {
        status = `Winner: ${winner}`;
    } else if (board.every(Boolean)) {
        status = "It's a draw!";
    } else {
        status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    }

    // Board SVG lines
    const boardLines = [
        // vertical
        <line key="v1" x1="33.33%" y1="0" x2="33.33%" y2="100%" className="stroke-gray-300" strokeWidth="2" />,
        <line key="v2" x1="66.66%" y1="0" x2="66.66%" y2="100%" className="stroke-gray-300" strokeWidth="2" />,
        // horizontal
        <line key="h1" x1="0" y1="33.33%" x2="100%" y2="33.33%" className="stroke-gray-300" strokeWidth="2" />,
        <line key="h2" x1="0" y1="66.66%" x2="100%" y2="66.66%" className="stroke-gray-300" strokeWidth="2" />
    ];

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
                    className={`absolute top-0 left-0 w-full h-full pointer-events-none z-20 ${animateBoard ? 'animate-board-lines' : ''}`}
                    viewBox="0 0 150 150"
                >
                    {/* Board lines */}
                    <line x1="50" y1="0" x2="50" y2="150" className="stroke-gray-500" strokeWidth="2" strokeLinecap="round" />
                    <line x1="100" y1="0" x2="100" y2="150" className="stroke-gray-500" strokeWidth="2" strokeLinecap="round" />
                    <line x1="0" y1="50" x2="150" y2="50" className="stroke-gray-500" strokeWidth="2" strokeLinecap="round" />
                    <line x1="0" y1="100" x2="150" y2="100" className="stroke-gray-500" strokeWidth="2" strokeLinecap="round" />
                    {/* Win line */}
                    {winLineSVG}
                </svg>
                <div className="absolute top-0 left-0 w-full h-full grid grid-cols-3 grid-rows-3 z-10">
                    {board.map((val, i) => (
                        <Square
                            key={i}
                            value={val}
                            onClick={() => handleClick(i)}
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
