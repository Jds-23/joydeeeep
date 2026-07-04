import { ExperimentPoster } from './ExperimentPoster'
import type { Experiment } from '../constant/experiment'

export function ExperimentPosterStack({ experiments }: { experiments: Experiment[] }) {
    return (
        <div className="relative">
            {experiments.map((experiment, index) => (
                <ExperimentPoster
                    key={experiment.id}
                    experiment={experiment}
                    index={index}
                    total={experiments.length}
                />
            ))}
        </div>
    )
}
