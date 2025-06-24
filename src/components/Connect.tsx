import { useAccount, useDisconnect, useConnect, useEnsName } from 'wagmi'
import { permissions } from '../constant/permissions/ttt'
import { useGrantPermissions } from 'porto/wagmi/Hooks'
import { baseSepolia } from 'viem/chains'
import { ellipsis } from '../lib/utils/ellipsis'
import { useClipboard } from '../lib/hooks/useClipboard'
import { Button } from './ui/button'
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function Connect() {
    const connect = useConnect()
    const disconnect = useDisconnect()
    const { address } = useAccount()
    const { data } = useEnsName({ address })
    const [copy,] = useClipboard()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

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

        return (
            <div className="flex flex-row gap-2 items-center relative">
                <span className="flex flex-row">
                    <Button
                        className="bg-blue-500 text-white hover:bg-blue-600 rounded-r-none"
                        type="button"
                        onClick={() => {
                            copy(address)
                        }}
                    >
                        {data ? data : ellipsis(address, 6)}
                    </Button>
                    <Button
                        className="text-white px-1 text-xs bg-blue-500 hover:bg-blue-600 rounded-l-none border-l border-l-white"
                        type="button"
                        onClick={() => setIsDropdownOpen((v) => !v)}
                        aria-haspopup="true"
                        aria-expanded={isDropdownOpen}
                    >
                        <ChevronDown size={18} />
                    </Button>
                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                        <div
                            ref={dropdownRef}
                            className="absolute left-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded shadow-lg min-w-[160px] flex flex-col"
                        >
                            <Button
                                className="w-full justify-start px-4 py-2 text-gray-700 hover:bg-gray-100 bg-transparent shadow-none mt-0"
                                onClick={() => {
                                    disconnect.disconnect();
                                    setIsDropdownOpen(false);
                                }}
                                type="button"
                            >
                                Sign out
                            </Button>
                            <Button
                                className="w-full justify-start px-4 py-2 text-gray-700 hover:bg-gray-100 bg-transparent shadow-none mt-0"
                                onClick={() => {
                                    grantPermissions(permissions(baseSepolia));
                                    setIsDropdownOpen(false);
                                }}
                                type="button"
                            >
                                Grant Permissions
                            </Button>
                        </div>
                    )}
                </span>
            </div>
        )
    }

}