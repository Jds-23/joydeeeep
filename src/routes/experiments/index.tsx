import { createFileRoute, Link } from '@tanstack/react-router'
import { experiments, type Experiment } from '../../constant/experiment'

export const Route = createFileRoute('/experiments/')({
    component: ExperimentsPage,
})

function ExperimentItem({ experiment }: { experiment: Experiment }) {
    const truncateDescription = (desc: string | React.ReactNode) => {
        if (typeof desc === 'string') {
            return desc.length > 120 ? desc.substring(0, 120) + '...' : desc;
        }
        return desc;
    };

    return (
        <article className="mb-6 last:mb-0">
            <Link 
                to="/experiments/$id" 
                params={{ id: experiment.id }}
                className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
                <div className="flex flex-col gap-3">
                    <div>
                        <span className="font-bold text-gray-900">{experiment.id}:</span>
                        <span className="ml-2 text-gray-800">{experiment.title}</span>
                    </div>
                    
                    <div className="text-sm text-gray-600 leading-relaxed hidden">
                        {typeof experiment.description === 'string' ? (
                            <p>{truncateDescription(experiment.description)}</p>
                        ) : (
                            <div>{experiment.description}</div>
                        )}
                    </div>
                    
                    <time className="text-xs text-gray-500" dateTime={experiment.date}>
                        {experiment.date}
                    </time>
                </div>
            </Link>
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
                    {experiments.map((experiment) => (
                        <ExperimentItem key={experiment.id} experiment={experiment} />
                    ))}
                </section>
            </main>
        </div>
    );
}
