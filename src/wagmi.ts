import { porto } from 'porto/wagmi'
import { http, createConfig, createStorage } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

export const wagmiConfig = createConfig({
    chains: [baseSepolia],
    connectors: [porto()],
    storage: createStorage({ storage: localStorage }),
    transports: {
        // [baseSepolia.id]: http('https://base-sepolia.blockpi.network/v1/rpc/fad36fce3a3b45ea818730a9a5e22f6495375215'),
        [baseSepolia.id]: http('https://sepolia-preconf.base.org'),
    },
})