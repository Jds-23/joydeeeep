import { useAccount, useConfig, useSendCalls } from "wagmi";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ttt_contract_address } from "../../constant";
import { TicTacToe } from "../../constant/abis/tictactoe";
import { multicall, waitForCallsStatus } from "wagmi/actions";
import { hexToBinary } from "../utils/hexToBin";

export const emptyBoard = Array(9).fill(null);

export const useGameQuery = (id: bigint | undefined) => {
    const config = useConfig()
    return useQuery({
        queryKey: ["ttt", "game", id?.toString()],
        queryFn: async () => {
            if (!config) {
                return undefined;
            }
            if (!id) {
                return undefined;
            }
            const contracts = {
                address: ttt_contract_address[config.chains[0].id], // get chain of current chain
                abi: TicTacToe,
            } as const
            const results = await multicall(config, {
                contracts: [
                    {
                        ...contracts,
                        functionName: "getBoard",
                        args: [id],
                    },
                    {
                        ...contracts,
                        functionName: "whoWon",
                        args: [id],
                    }
                ]
            })

            const errors: Error[] = []
            const board: ('X' | 'O' | null)[] = emptyBoard;
            let whoWon: `0x${string}` | null = null;

            if (results[0].status === "success") {
                let boardInBinary = hexToBinary(results[0].result)
                boardInBinary = boardInBinary.split('').reverse().join('').substring(0, 18).padEnd(18, '0');
                for (let i = 0; i < boardInBinary.length; i++) {
                    if (boardInBinary[i] === '1') {
                        board[i % 9] = i < 9 ? 'X' : 'O';
                    }
                }
            } else {
                errors.push(results[0].error);
            }
            if (results[1].status === "success") {
                whoWon = results[1].result;
            } else {
                errors.push(results[1].error);
            }

            if (errors.length > 0) {
                throw new Error(errors.map(e => e.message).join(', '));
            }

            return {
                board,
                whoWon,
            }
        },
        initialData: {
            board: emptyBoard,
            whoWon: null,
        },
    })
}

type GameAction = {
    type: "newGame"
    opponent: `0x${string}`
} | {
    type: "play"
    id: bigint
    position: number
}

export const useGameMutation = (
    {
        onSuccess,
    }: {
        onSuccess: () => void
    } = {
            onSuccess: () => { },
        }
) => {
    const config = useConfig()
    const { address } = useAccount()
    const { sendCallsAsync } = useSendCalls()

    return useMutation({
        mutationKey: ["ttt", "newGame", address],
        mutationFn: async (
            action: GameAction
        ) => {
            if (!address) {
                throw new Error("No address");
            }
            if (!config) {
                throw new Error("No config");
            }
            switch (action.type) {
                case "newGame":
                    await sendCallsAsync({
                        calls: [
                            {
                                to: ttt_contract_address[config.chains[0].id],
                                abi: TicTacToe,
                                functionName: "newGame",
                                args: [address, action.opponent]
                            }
                        ]
                    }).then(async result => {
                        await waitForCallsStatus(config, result)
                        return result
                    })
                    break;
                case "play":
                    await sendCallsAsync({
                        calls: [
                            {
                                to: ttt_contract_address[config.chains[0].id],
                                abi: TicTacToe,
                                functionName: "play",
                                args: [action.id, action.position]
                            }
                        ]
                    }).then(async result => {
                        await waitForCallsStatus(config, result)
                        return result
                    })
                    break;
            }
            onSuccess();
        }
    })
}

// export const usePlayMutation = () => {
//     const config = useConfig()
//     return useMutation({
//         mutationFn: async (id: bigint) => {
//             if (!config) {
//                 throw new Error("No config");
//             }
//             const contracts = {
//                 address: ttt_contract_address[config.chains[0].id],
//                 abi: TicTacToe,
//             } as const

//             const result = await sendTransaction(config, {
//             }
//     })
// }

// query
// getBoard
// whoWon

// mutations
// newGame
// play
