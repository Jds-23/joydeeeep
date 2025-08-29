import { createFileRoute, Link } from '@tanstack/react-router'
import { experiments, type ExperimentLink } from '../../constant/experiment'

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
    return (
        <div className="flex flex-wrap gap-3 items-center">
            {links.map((link, index) => (
                <span key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2 text-gray-400">•</span>}
                    {link.external ? (
                        <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                        >
                            {link.text}
                            <svg className="ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </a>
                    ) : (
                        <Link 
                            to={link.href} 
                            className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
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
        <div className="flex flex-col p-6 min-h-screen max-w-4xl mx-auto">
            <nav className="mb-6">
                <Link 
                    to="/experiments" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Experiments
                </Link>
            </nav>

            <main>
                <header className="mb-8">
                    <div className="flex flex-col gap-4">
                        <div>
                            <span className="inline-block px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-800 rounded-full mb-2">
                                {experiment.id}
                            </span>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {experiment.title}
                            </h1>
                        </div>
                        
                        <time className="text-sm text-gray-600" dateTime={experiment.date}>
                            {experiment.date}
                        </time>
                    </div>
                </header>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                    <div className="prose prose-gray max-w-none">
                        {typeof experiment.description === 'string' ? (
                            <p className="text-gray-700 leading-relaxed">{experiment.description}</p>
                        ) : (
                            <div className="text-gray-700">{experiment.description}</div>
                        )}
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Resources</h2>
                    <ExperimentLinks links={experiment.links} />
                </section>
            </main>
        </div>
    )
}