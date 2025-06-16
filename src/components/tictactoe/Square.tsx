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

export default Square;