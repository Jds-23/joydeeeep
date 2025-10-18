import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { redirects } from '../../constant/redirects'
import { Box } from '../../components/ui/box'

export const Route = createFileRoute('/r/$id')({
    loader: ({ params }) => {
        const redirect = redirects.find(r => r.id === params.id)
        if (!redirect) {
            throw new Error('Redirect not found')
        }
        return { redirect }
    },
    component: RedirectPage,
})

function RedirectPage() {
    const { redirect } = Route.useLoaderData()
    const delay = redirect.delay ?? 500
    const [timeLeft, setTimeLeft] = useState(delay)

    useEffect(() => {
        // Update countdown every 100ms
        const countdownInterval = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 100))
        }, 100)

        // Redirect after delay
        const redirectTimer = setTimeout(() => {
            window.location.replace(redirect.link)
        }, delay)

        // Cleanup
        return () => {
            clearInterval(countdownInterval)
            clearTimeout(redirectTimer)
        }
    }, [redirect, delay])

    return (
        <div className="flex flex-col p-4 h-screen max-w-screen-sm mx-auto justify-center">
            <Box className="text-center">
                {/* Loading Spinner */}
                <div className="mb-4 flex justify-center">
                    <div className="w-12 h-12 border-2 border-black rounded-full border-t-transparent animate-spin"></div>
                </div>

                {/* Loading Message */}
                <h1 className="text-lg font-bold mb-2">
                    {redirect.loadingMessage}
                </h1>

                {/* Countdown */}
                <p className="text-sm mb-4">
                    Redirecting in {(timeLeft / 1000).toFixed(1)}s...
                </p>

                {/* Destination Link */}
                <div className="pt-4 border-t-2 border-black">
                    <p className="text-sm mb-1">Destination:</p>
                    <a
                        href={redirect.link}
                        className="text-sm text-blue-500 hover:underline break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {redirect.link}
                    </a>
                </div>
            </Box>
        </div>
    )
}
