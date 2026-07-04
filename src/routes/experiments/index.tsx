import { createFileRoute } from '@tanstack/react-router'
import { experiments } from '../../constant/experiment'
import { ExperimentPosterStack } from '../../components/ExperimentPosterStack'

export const Route = createFileRoute('/experiments/')({
    component: ExperimentsPage,
})

export default function ExperimentsPage() {
    return (
        <div className="flex flex-col p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Experiments</h1>
            </header>

            <main>
                <ExperimentPosterStack experiments={experiments} />
            </main>
        </div>
    );
}
