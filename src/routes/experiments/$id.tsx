import { createFileRoute, Link } from '@tanstack/react-router'
import { experiments, type ExperimentLink } from '../../constant/experiment'
import { useListNav } from '../../lib/hooks/useListNav'
import { cn } from '../../lib/utils/cn'
import { ListNavHint } from '../../components/command/KeyHint'

export const Route = createFileRoute('/experiments/$id')({
    loader: ({ params }) => {
        const experiment = experiments.find(exp => exp.id === params.id)
        if (!experiment) {
            throw new Error('Experiment not found')
        }
        return { experiment }
    },
    component: ExperimentDetailPage,
})

function ExperimentLinks({ links }: { links: ExperimentLink[] }) {
    const { activeIndex, register } = useListNav({ count: links.length })
    const activeClass = (index: number) => index === activeIndex && 'ring-2 ring-neutral-900 ring-offset-1'

    return (
        <div className="flex flex-wrap gap-2 items-center">
            {links.map((link, index) => (
                <span key={index} className="flex items-center">
                    {index > 0 && <span className="mx-1 text-gray-400">•</span>}
                    {link.external ? (
                        <a
                            ref={register(index)}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn("inline-flex items-center px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors", activeClass(index))}
                        >
                            {link.text}
                            <svg className="ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </a>
                    ) : (
                        <Link
                            ref={register(index)}
                            to={link.href}
                            className={cn("inline-flex items-center px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors", activeClass(index))}
                        >
                            {link.text}
                        </Link>
                    )}
                </span>
            ))}
        </div>
    )
}

function ExperimentDetailPage() {
    const { experiment } = Route.useLoaderData()

    return (
        <div className="flex flex-col p-4 min-h-screen max-w-3xl mx-auto">
            <nav className="mb-3 text-sm">
                <Link 
                    to="/experiments" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <svg className="mr-1 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Experiments
                </Link>
            </nav>

            <main>
                <header className="mb-4">
                    <div className="flex flex-col gap-2">
                        <div>
                            <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full mb-1">
                                {experiment.id}
                            </span>
                            <h1 className="text-xl font-bold text-gray-900">
                                {experiment.title}
                            </h1>
                        </div>
                        
                        <time className="text-xs text-gray-600" dateTime={experiment.date}>
                            {experiment.date}
                        </time>
                    </div>
                </header>

                <section className="mb-4">
                    <h2 className="text-sm font-semibold text-gray-900 mb-1.5">Description</h2>
                    <div className="prose prose-gray max-w-none">
                        {typeof experiment.description === 'string' ? (
                            <p className="text-sm text-gray-700 leading-relaxed">{experiment.description}</p>
                        ) : (
                            <div className="text-sm text-gray-700">{experiment.description}</div>
                        )}
                    </div>
                </section>

                <section className="mb-4">
                    <div className="flex items-end justify-between gap-4 mb-2">
                        <h2 className="text-sm font-semibold text-gray-900">Resources</h2>
                        <ListNavHint />
                    </div>
                    <ExperimentLinks links={experiment.links} />
                </section>
            </main>
        </div>
    )
}