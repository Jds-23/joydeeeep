import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createPublicClient, http } from "viem"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
import { create7702KernelAccount, create7702KernelAccountClient } from "@zerodev/ecdsa-validator"
import { createZeroDevPaymasterClient } from "@zerodev/sdk"
import { CHAIN, KERNEL_VERSION, ENTRY_POINT, BUNDLER_RPC, PAYMASTER_RPC } from "./constants"

const STORAGE_KEY = "zerodev-private-key"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any

interface ZeroDevContextValue {
    address: `0x${string}` | undefined
    kernelClient: AnyClient | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    publicClient: any
    isConnected: boolean
    isLoading: boolean
    connect: () => Promise<void>
    disconnect: () => void
}

const publicClient = createPublicClient({
    chain: CHAIN,
    transport: http(),
})

const ZeroDevContext = createContext<ZeroDevContextValue>({
    address: undefined,
    kernelClient: undefined,
    publicClient,
    isConnected: false,
    isLoading: false,
    connect: async () => {},
    disconnect: () => {},
})

export const useZeroDev = () => useContext(ZeroDevContext)

async function buildKernelClient(privateKey: `0x${string}`) {
    const signer = privateKeyToAccount(privateKey)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const kernelAccount = await create7702KernelAccount(publicClient as any, {
        signer,
        entryPoint: ENTRY_POINT,
        kernelVersion: KERNEL_VERSION,
    })

    const paymasterClient = createZeroDevPaymasterClient({
        chain: CHAIN,
        transport: http(PAYMASTER_RPC),
    })

    const client = create7702KernelAccountClient({
        account: kernelAccount,
        chain: CHAIN,
        bundlerTransport: http(BUNDLER_RPC),
        paymaster: {
            getPaymasterData: (userOperation) =>
                paymasterClient.sponsorUserOperation({ userOperation }),
            getPaymasterStubData: (userOperation) =>
                paymasterClient.sponsorUserOperation({ userOperation }),
        },
    })

    return { client, address: signer.address }
}

export const ZeroDevProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [address, setAddress] = useState<`0x${string}` | undefined>()
    const [kernelClient, setKernelClient] = useState<AnyClient | undefined>()
    const [isLoading, setIsLoading] = useState(false)

    const isConnected = !!address && !!kernelClient

    const initFromKey = useCallback(async (key: `0x${string}`) => {
        setIsLoading(true)
        try {
            const { client, address: addr } = await buildKernelClient(key)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setKernelClient(client as any)
            setAddress(addr)
        } catch (err) {
            console.error("Failed to init ZeroDev account:", err)
            localStorage.removeItem(STORAGE_KEY)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            initFromKey(stored as `0x${string}`)
        }
    }, [initFromKey])

    const connect = useCallback(async () => {
        const key = generatePrivateKey()
        localStorage.setItem(STORAGE_KEY, key)
        await initFromKey(key)
    }, [initFromKey])

    const disconnect = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY)
        setAddress(undefined)
        setKernelClient(undefined)
    }, [])

    return (
        <ZeroDevContext.Provider
            value={{ address, kernelClient, publicClient, isConnected, isLoading, connect, disconnect }}
        >
            {children}
        </ZeroDevContext.Provider>
    )
}
