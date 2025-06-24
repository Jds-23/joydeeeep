import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/experiments')({
    component: ExperimentsPage,
})

const experiments = [
    {
        id: "EXP0004",
        title: "Optimized Onchain TicTacToe game with Porto",
        date: "2024.06.24",
        links: [
            { text: "Play", href: "/tictactoe", internal: true },
            { text: "Porto", href: "https://porto.sh", external: true },
            { text: "Github", href: "https://github.com/Jds-23/tictactoe", external: true }
        ]
    },
    {
        id: "EXP0003",
        title: "Permissioned Telegram bot with Porto",
        date: "2024.03.25",
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
        links: [
            { text: "EthBangkok Showcase", href: "https://ethglobal.com/showcase/asymetricfeeshook-btttj", external: true },
            { text: "Github", href: "https://github.com/Jds-23/asymmetric-fees-hook", external: true }
        ]
    },
    {
        id: "EXP0001",
        title: "Scanning the blockchain right from spotlight using RayScan",
        date: "2024.08.17",
        links: [
            { text: "Tweet Link", href: "https://x.com/0xJoydeeeep/status/1824675559965896789", external: true },
            { text: "Github", href: "https://github.com/Jds-23/rayscan", external: true }
        ]
    }
];

function ExperimentLinks({ links }: { links: { text: string, href: string, external: boolean }[] }) {
    return (
        <div className="flex flex-wrap gap-1 items-center">
            {links.map((link, index) => (
                <span key={index} className="flex items-center">
                    {index > 0 && <span className="mx-1 text-gray-400">•</span>}
                    {link.external ? (
                        <a
                            href={link.href}
                            target={link.external ? "_blank" : "_self"}
                            rel={link.external ? "noopener noreferrer" : undefined}
                            className="text-blue-600 hover:text-blue-800 underline transition-colors"
                        >
                            {link.text}
                        </a>
                    ) : (
                        <Link to={link.href} className="text-blue-600 hover:text-blue-800 underline transition-colors">
                            {link.text}
                        </Link>
                    )}
                </span>
            ))}
        </div>
    );
}

function ExperimentItem({ experiment }: { experiment: { id: string, title: string, date: string, links: { text: string, href: string, external: boolean }[] } }) {
    return (
        <article className="mb-6 last:mb-0">
            <div className="flex flex-col gap-2">
                <div>
                    <span className="font-bold text-gray-900">{experiment.id}:</span>
                    <span className="ml-2 text-gray-800">{experiment.title}</span>
                </div>

                <ExperimentLinks links={experiment.links} />

                <time className="text-xs text-gray-500" dateTime={experiment.date}>
                    {experiment.date}
                </time>
            </div>
        </article>
    );
}

export default function ExperimentsPage() {
    return (
        <div className="flex flex-col p-6 min-h-screen max-w-2xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Experiments</h1>
            </header>

            <main>
                <section aria-label="List of experiments">
                    {experiments.map((experiment) => {
                        const experimentWithExternalLinks = {
                            ...experiment,
                            links: experiment.links.map(link => ({
                                ...link,
                                external: 'internal' in link ? !link.internal : link.external
                            }))
                        };
                        return <ExperimentItem key={experiment.id} experiment={experimentWithExternalLinks} />;
                    })}
                </section>
            </main>
        </div>
    );
}
