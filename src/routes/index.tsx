import { createFileRoute } from '@tanstack/react-router'
import { experiments } from '../constant/experiment'
import { ExperimentItem } from '../components/ExperimentItem'

export const Route = createFileRoute('/')({
    component: App,
})

function App() {
    return (
        <div className="flex flex-col p-4 min-h-screen max-w-screen-sm mx-auto">
            <h2 className="text-xl font-bold ">Hello there, this page is made by Joydeep.</h2>
            <p className="text-sm">Talk to me about ethereum UX(aa,interop,wallets,etc) <a href="https://twitter.com/0xJoydeeeep" className="text-blue-500">Twitter</a>. Check out my <a href="https://github.com/Jds-23" className="text-blue-500">Github</a>. I also write sometimes on <a href="https://substack.com/@0xjoydeeeep" className="text-blue-500">substack</a>.</p>

            <section className="mt-8">
                <h3 className="text-lg font-bold mb-4">Experiments</h3>
                {experiments.map((experiment) => (
                    <ExperimentItem key={experiment.id} experiment={experiment} />
                ))}
            </section>
        </div>
    )
}
