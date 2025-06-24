import { useAccount, useDisconnect, useConnect, useEnsName } from 'wagmi'
import { permissions } from '../constant/permissions/ttt'
import { useGrantPermissions } from 'porto/wagmi/Hooks'
import { baseSepolia } from 'viem/chains'
import { ellipsis } from '../lib/utils/ellipsis'
import { useClipboard } from '../lib/hooks/useClipboard'
import { Button } from './ui/button'

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
            <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={() =>
                    connect.connect({
                        connector,
                        // @ts-ignore
                        capabilities: {
                            grantPermissions: permissions(baseSepolia),
                        },
                    })
                }
                type="button"
            >
                Sign in
            </Button>
        )
    }

    if (address) {
        if (data) {
            return (
                <div className="flex flex-row gap-2">
                    <Button
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        type="button"
                        onClick={() => {
                            copy(address)
                        }}
                    >
                        {data}
                    </Button>
                    <Button
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => grantPermissions(permissions(baseSepolia))}
                        type="button"
                    >
                        Grant Permissions
                    </Button>
                </div>
            )
        }
        return (
            <div className="flex flex-row gap-2">
                <Button
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    type="button"
                    onClick={() => {
                        copy(address)
                    }}
                >
                    {ellipsis(address, 6)}
                </Button>
                <Button
                    className="bg-red-500 text-white hover:bg-red-600"
                    onClick={() => {
                        disconnect.disconnect()
                    }}
                >
                    Sign out
                </Button>
                <Button
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => grantPermissions(permissions(baseSepolia))}
                    type="button"
                >
                    Grant Permissions
                </Button>
            </div>
        )
    }

}