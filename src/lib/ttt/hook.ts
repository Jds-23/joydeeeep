import { useAccount, useConfig, useSendCalls } from "wagmi";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ttt_contract_address } from "../../constant";
import { TicTacToe } from "../../constant/abis/tictactoe";
import { multicall, waitForCallsStatus } from "wagmi/actions";
import { hexToBinary } from "../utils/hexToBin";
import { zeroAddress } from "viem";

export const emptyBoard = Array(9).fill(null);

export const useGameQuery = (id: bigint | undefined) => {
    const config = useConfig()
    const { address } = useAccount()
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
                        functionName: "games",
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
            let turn: `0x${string}` | null = null;
            let players: [`0x${string}`, `0x${string}`] | null = null;

            if (results[0].status === "success") {
                players = [results[0].result[1], results[0].result[2]];
                let boardInBinary = hexToBinary(results[0].result[0])
                if (boardInBinary.length === 24) {
                    turn = results[0].result[2];
                } else {
                    turn = results[0].result[1];
                }
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
                players,
                turn,
                whoWon
            }
        },
        initialData: {
            board: emptyBoard,
            players: null,
            whoWon: null,
            turn: null,
        },
        refetchInterval: (query) => {
            const data = query.state.data;
            if (data && address) {
                if (data.whoWon !== zeroAddress) {
                    return false;
                }
                if (data.turn?.toLowerCase() === address.toLowerCase()) {
                    return false;
                } else {
                    return 1000;
                }
            }
            return false;
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

type GameMutationResult = {
    type: "newGame"
    id: bigint
} | {
    type: "play"
    board: ('X' | 'O' | null)[]
    id: bigint
}

export const useGameMutation = () => {
    const config = useConfig()
    const { address } = useAccount()
    const { sendCallsAsync } = useSendCalls()
    const queryClient = useQueryClient()

    return useMutation<GameMutationResult, Error, GameAction>({
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
                    return await sendCallsAsync({
                        calls: [
                            {
                                to: ttt_contract_address[config.chains[0].id],
                                abi: TicTacToe,
                                functionName: "newGame",
                                args: [address, action.opponent]
                            }
                        ]
                    }).then(async result => {
                        const status = await waitForCallsStatus(config, result)
                        console.log('newGame', status.receipts?.[0]?.logs.find(log => log.address.toLowerCase() === ttt_contract_address[config.chains[0].id].toLowerCase())?.data)
                        return {
                            type: "newGame",
                            id: BigInt(parseInt(status.receipts?.[0]?.logs.find(log => log.address.toLowerCase() === ttt_contract_address[config.chains[0].id].toLowerCase())?.data?.replace(/^0x/i, '') ?? "0", 16))
                        }
                    })
                case "play":
                    return await sendCallsAsync({
                        calls: [
                            {
                                to: ttt_contract_address[config.chains[0].id],
                                abi: TicTacToe,
                                functionName: "play",
                                args: [action.id, action.position]
                            }
                        ]
                    }).then(async result => {
                        const status = await waitForCallsStatus(config, result)
                        console.log('play', status.receipts?.[0]?.logs.find(log => log.address.toLowerCase() === ttt_contract_address[config.chains[0].id].toLowerCase())?.data)
                        let boardInBinary = hexToBinary(status.receipts?.[0]?.logs.find(log => log.address.toLowerCase() === ttt_contract_address[config.chains[0].id].toLowerCase())?.data?.replace(/^0x/i, '') ?? "0")
                        boardInBinary = boardInBinary.split('').reverse().join('').substring(0, 18).padEnd(18, '0');
                        const board: ('X' | 'O' | null)[] = emptyBoard;
                        for (let i = 0; i < boardInBinary.length; i++) {
                            if (boardInBinary[i] === '1') {
                                board[i % 9] = i < 9 ? 'X' : 'O';
                            }
                        }
                        return {
                            type: "play",
                            board,
                            id: action.id
                        }
                    })
            }
        },
        onSuccess: (data) => {
            if (data.type === "play") {
                queryClient.setQueryData(["ttt", "game", data.id.toString()], (oldData: any) => {
                    const { players, turn } = oldData;
                    return {
                        ...oldData,
                        board: data.board,
                        turn: turn === players[0] ? players[1] : players[0]
                    }
                })
            }
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
