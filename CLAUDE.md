# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Vite dev server with hot module reloading
- **Build**: `npm run build` - TypeScript compilation followed by Vite build
- **Lint**: `npm run lint` - Run ESLint checks
- **Lint fix**: `npm run lint:fix` - Run ESLint with auto-fix
- **Preview**: `npm run preview` - Preview production build locally

## Architecture Overview

This is a React + TypeScript + Vite application that implements a decentralized Tic-Tac-Toe game using Web3 technologies:

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Routing**: TanStack Router with file-based routing and auto-code splitting
- **Styling**: Tailwind CSS v4 with Vite plugin
- **State Management**: TanStack Query for server state, nuqs for URL state
- **Web3**: Wagmi + Viem for Ethereum interactions, Porto wallet connector
- **Network**: Base Sepolia testnet

### Key Architecture Patterns

**Web3 Integration**:
- Wagmi config in `src/wagmi.ts` connects to Base Sepolia via RPC
- Smart contract interactions through custom hooks in `src/lib/ttt/hook.ts`
- Contract ABIs and addresses defined in `src/constant/`

**Routing Structure**:
- File-based routing with TanStack Router
- Auto-generated route tree in `src/routeTree.gen.ts`
- Main routes: `/` (home), `/experiments`, `/tictactoe`

**Game Logic**:
- Tic-Tac-Toe game state managed through `useGameQuery` and `useGameMutation`
- Board state encoded/decoded from hex to binary for blockchain storage
- Real-time game updates via polling when it's opponent's turn
- Optimistic UI updates with loading states (`LX`/`LO`) during transactions

**Component Organization**:
- UI components in `src/components/ui/` (button, ellipsis button)
- Game-specific components in `src/components/tictactoe/`
- Utility functions in `src/lib/utils/`
- Custom hooks in `src/lib/hooks/`

### Smart Contract Integration

The app interacts with deployed Tic-Tac-Toe contracts:
- Contract addresses stored per chain in `src/constant/index.ts`
- Game state stored on-chain as hex-encoded board positions
- Uses multicall for efficient batch contract reads
- Implements optimistic updates for better UX during transactions

### State Management Patterns

- **Server State**: TanStack Query for blockchain data fetching and caching
- **URL State**: nuqs for game ID and other URL parameters
- **Game State**: Custom hooks that combine contract calls with local state
- **Refetch Strategy**: Automatic polling when waiting for opponent moves