import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { permissions } from '../constant/permissions/ttt'
import { useGrantPermissions } from 'porto/wagmi/Hooks'
import { baseSepolia } from 'viem/chains'
import { ellipsis } from '../lib/utils/ellipsis'
import { useClipboard } from '../lib/hooks/useClipboard'

export function Connect() {
    const connect = useConnect()
    const disconnect = useDisconnect()
    const { address } = useAccount()
    const { data } = useEnsName({ address })
    const [copy,] = useClipboard()

    const { mutate: grantPermissions } = useGrantPermissions({
        mutation: {
            onSuccess: () => {
                console.log('Permissions granted')
            }
        }
    })

    const connector = connect.connectors.find(
        (connector) => connector.id === 'xyz.ithaca.porto',
    )!

    if (!address) {
        return (
            <button
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() =>
                    connect.connect({
                        connector,
                    })
                }
                type="button"
            >
                Sign in
            </button>
        )
    }

    if (address) {
        if (data) {
            return (
                <div className="flex flex-row gap-2">
                    <button
                        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        type="button"
                        onClick={() => {
                            copy(address)
                        }}
                    >
                        {data}
                    </button>
                    <button
                        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        onClick={() => grantPermissions(permissions(baseSepolia))}
                        type="button"
                    >
                        Grant Permissions
                    </button>
                </div>
            )
        }
        return (
            <div className="flex flex-row gap-2">
                <button
                    className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    type="button"
                    onClick={() => {
                        copy(address)
                    }}
                >
                    {ellipsis(address, 6)}
                </button>
                <button
                    className="mt-6 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    onClick={() => {
                        disconnect.disconnect()
                    }}
                >
                    Sign out
                </button>
                <button
                    className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={() => grantPermissions(permissions(baseSepolia))}
                    type="button"
                >
                    Grant Permissions
                </button>
            </div>
        )
    }

}