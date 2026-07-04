import { createFileRoute } from '@tanstack/react-router'
import { experiments } from '../constant/experiment'
import { ExperimentPosterStack } from '../components/ExperimentPosterStack'

export const Route = createFileRoute('/')({
    component: App,
})

function App() {
    return (
        <div className="flex flex-col md:flex-row gap-8 p-4 md:px-8 mx-auto">
            <aside className="md:w-2/5 md:sticky md:top-8 md:self-start">
                <h2 className="text-xl font-bold ">Hello there, this page is made by Joydeep.</h2>
                <p className="text-sm">Talk to me about ethereum UX(aa,interop,wallets,etc) <a href="https://twitter.com/0xJoydeeeep" className="text-blue-500">Twitter</a>. Check out my <a href="https://github.com/Jds-23" className="text-blue-500">Github</a>. I also write sometimes on <a href="https://substack.com/@0xjoydeeeep" className="text-blue-500">substack</a>.</p>
            </aside>

            <section className="md:w-3/5">
                <h3 className="text-lg font-bold mb-4">Experiments</h3>
                <ExperimentPosterStack experiments={experiments} />
            </section>
        </div>
    )
}
