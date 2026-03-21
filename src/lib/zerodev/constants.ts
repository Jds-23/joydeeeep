import { constants } from "@zerodev/sdk"
import { baseSepolia } from "viem/chains"

export const KERNEL_VERSION = constants.KERNEL_V3_3
export const ENTRY_POINT = constants.getEntryPoint("0.7")
export const CHAIN = baseSepolia

const PROJECT_ID = import.meta.env.VITE_ZERODEV_PROJECT_ID

export const BUNDLER_RPC = `https://rpc.zerodev.app/api/v3/${PROJECT_ID}/chain/${CHAIN.id}`;
export const PAYMASTER_RPC = `https://rpc.zerodev.app/api/v3/${PROJECT_ID}/chain/${CHAIN.id}`;
