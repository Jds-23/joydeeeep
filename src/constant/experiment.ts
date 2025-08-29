export interface ExperimentLink {
    text: string;
    href: string;
    external: boolean;
    internal?: boolean;
}

export interface Experiment {
    id: string;
    title: string;
    date: string;
    description: string | React.ReactNode;
    links: ExperimentLink[];
}

export const experiments: Experiment[] = [
    {
        id: "EXP0005",
        title: "ZKEmail Recovery for Porto Account",
        date: "2025.08.28",
        description: "A zero-knowledge email-based account recovery system for Porto accounts.",
        links: [
            { text: "Github", href: "https://github.com/Jds-23/account/blob/feat/zkemail-account-recovery/test/ZKEmailSigner.t.sol", external: true },
            { text: "Substack", href: "https://joydeepsingha.substack.com/p/zk-email-recovery-for-porto", external: true }
        ]
    },
    {
        id: "EXP0004",
        title: "Optimized Onchain TicTacToe game with Porto",
        date: "2025.06.24",
        description: "A fully on-chain TicTacToe game built with smart contracts and integrated with Porto wallet. Features optimized game state encoding, real-time multiplayer, and seamless Web3 interactions with minimal gas costs.",
        links: [
            { text: "Play", href: "/tictactoe", internal: true, external: false },
            { text: "Porto", href: "https://porto.sh", external: true },
            { text: "Github", href: "https://github.com/Jds-23/tictactoe", external: true }
        ]
    },
    {
        id: "EXP0003",
        title: "Permissioned Telegram bot with Porto",
        date: "2025.03.25",
        description: "A Telegram bot leveraging EIP-7702 for account abstraction with Porto wallet integration. Enables users to execute blockchain transactions directly from Telegram with fine-grained permission controls and spending limits.",
        links: [
            { text: "See Demo", href: "https://x.com/0xJoydeeeep/status/1904494591941996669", external: true },
            { text: "Porto", href: "https://porto.sh", external: true },
            { text: "Github", href: "https://github.com/Jds-23/7702-tg-bot", external: true }
        ]
    },
    {
        id: "EXP0002",
        title: "Asymmetric Fees UniswapV4 Hook",
        date: "2024.02.25",
        description: "A UniswapV4 hook inspired by Nezlobin’s Directional Fee, designed to make LPs more profitable by dynamically adjusting the pool fee.",
        links: [
            { text: "EthBangkok Showcase", href: "https://ethglobal.com/showcase/asymetricfeeshook-btttj", external: true },
            { text: "Github", href: "https://github.com/Jds-23/asymmetric-fees-hook", external: true }
        ]
    },
    {
        id: "EXP0001",
        title: "Scanning the blockchain right from spotlight using RayScan",
        date: "2024.08.17",
        description: "A macOS Spotlight extension that enables real-time blockchain scanning and transaction lookup directly from the system search. Built with Raycast integration for seamless Web3 data access without leaving the desktop environment.",
        links: [
            { text: "Tweet Link", href: "https://x.com/0xJoydeeeep/status/1824675559965896789", external: true },
            { text: "Github", href: "https://github.com/Jds-23/rayscan", external: true }
        ]
    }
];