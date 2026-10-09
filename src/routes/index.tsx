import { createFileRoute } from '@tanstack/react-router'
import { experiments } from '../constant/experiment'
import { ExperimentPosterStack } from '../components/ExperimentPosterStack'

export const Route = createFileRoute('/')({
    component: App,
})

function App() {
    return (
        <div className="flex flex-col md:flex-row gap-5 p-3 md:px-6 mx-auto">
            <aside className="md:w-2/5 md:sticky md:top-4 md:self-start">
                <h2 className="text-base font-bold">Hello there, this page is made by Joydeep.</h2>
                <p className="text-xs">Talk to me about programming, rust, maybe agentic coding, ethereum UX(aa,interop,wallets,etc) <a href="https://twitter.com/0xJoydeeeep" className="text-blue-500">Twitter</a>. Check out my <a href="https://github.com/Jds-23" className="text-blue-500">Github</a>. I also write sometimes on <a href="https://substack.com/@0xjoydeeeep" className="text-blue-500">substack</a>.</p>
            </aside>

            <section className="md:w-3/5">
                <h3 className="text-sm font-bold mb-2">Experiments</h3>
                <ExperimentPosterStack experiments={experiments} />
            </section>
        </div>
    )
}
