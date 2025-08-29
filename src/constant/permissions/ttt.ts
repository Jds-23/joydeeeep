import { ttt_contract_address } from '../index'
import { type Chain } from 'viem/chains'

export const permissions = (
    chain: Chain
) =>
    ({
        expiry: Math.floor(Date.now() / 1_000) + 60 * 60, // 1 hour
        feeLimit: {
            currency: 'USD',
            value: '1',
          },
        permissions: {
            calls: [{ to: ttt_contract_address[chain.id], }],
            spend: [
                {
                  limit: 1000000000000000000n,
                  period: 'hour',
                  token: ttt_contract_address[chain.id],
                },
              ],
        },
    }) as const