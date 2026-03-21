import { Link } from '@tanstack/react-router'
import type { Experiment } from '../constant/experiment'

const truncateDescription = (desc: string | React.ReactNode) => {
    if (typeof desc === 'string') {
        return desc.length > 120 ? desc.substring(0, 120) + '...' : desc;
    }
    return desc;
};

export function ExperimentItem({ experiment }: { experiment: Experiment }) {
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
