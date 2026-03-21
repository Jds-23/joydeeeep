import { createFileRoute } from '@tanstack/react-router'
import { experiments } from '../../constant/experiment'
import { ExperimentItem } from '../../components/ExperimentItem'

export const Route = createFileRoute('/experiments/')({
    component: ExperimentsPage,
})

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
