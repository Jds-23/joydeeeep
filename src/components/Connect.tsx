import { useAccount, useDisconnect, useConnect, useEnsName } from 'wagmi'
import { permissions } from '../constant/permissions/ttt'
import { useGrantPermissions } from 'porto/wagmi/Hooks'
import { baseSepolia } from 'viem/chains'
import { ellipsis } from '../lib/utils/ellipsis'
import { useClipboard } from '../lib/hooks/useClipboard'
import { Button } from './ui/button'
import { ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface AccountDropdownProps {
    open: boolean;
    onClose: () => void;
    onSignOut: () => void;
    onGrantPermissions: () => void;
    anchorRef: React.RefObject<HTMLButtonElement>;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ open, onClose, onSignOut, onGrantPermissions, anchorRef }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                anchorRef.current &&
                !anchorRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, onClose, anchorRef]);

    if (!open) return null;
    return (
        <div
            ref={dropdownRef}
            className="absolute left-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded shadow-lg min-w-[160px] flex flex-col"
        >
            <Button
                className="w-full justify-start px-4 py-2 text-gray-700 hover:bg-gray-100 bg-transparent shadow-none mt-0"
                onClick={() => {
                    onSignOut();
                    onClose();
                }}
                type="button"
            >
                Sign out
            </Button>
            <Button
                className="w-full justify-start px-4 py-2 text-gray-700 hover:bg-gray-100 bg-transparent shadow-none mt-0"
                onClick={() => {
                    onGrantPermissions();
                    onClose();
                }}
                type="button"
            >
                Grant Permissions
            </Button>
        </div>
    );
};

interface AccountButtonGroupProps {
    address: string;
    ensName?: string | null;
    onCopy: () => void;
    onDropdown: () => void;
    dropdownAnchorRef: React.RefObject<HTMLButtonElement>;
}

const AccountButtonGroup: React.FC<AccountButtonGroupProps> = ({ address, ensName, onCopy, onDropdown, dropdownAnchorRef }) => (
    <span className="flex flex-row">
        <Button
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-r-none"
            type="button"
            onClick={onCopy}
        >
            {ensName ? ensName : ellipsis(address, 6)}
        </Button>
        <Button
            className="text-white px-1 text-xs bg-blue-500 hover:bg-blue-600 rounded-l-none border-l border-l-white"
            type="button"
            onClick={onDropdown}
            ref={dropdownAnchorRef}
            aria-haspopup="true"
            aria-expanded={undefined}
        >
            <ChevronDown size={18} />
        </Button>
    </span>
);

export const Connect: React.FC = () => {
    const connect = useConnect();
    const disconnect = useDisconnect();
    const { address } = useAccount();
    const { data: ensName } = useEnsName({ address });
    const [copy] = useClipboard();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownAnchorRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;

    const { mutate: grantPermissions } = useGrantPermissions({
        mutation: {
            onSuccess: () => {
                console.log('Permissions granted');
            },
        },
    });

    const connector = connect.connectors.find((c) => c.id === 'xyz.ithaca.porto')!;

    const handleCopy = useCallback(() => {
        if (address) copy(address);
    }, [address, copy]);

    const handleDropdown = useCallback(() => {
        setIsDropdownOpen((v) => !v);
    }, []);

    const handleSignOut = useCallback(() => {
        disconnect.disconnect();
    }, [disconnect]);

    const handleGrantPermissions = useCallback(() => {
        grantPermissions(permissions(baseSepolia));
    }, [grantPermissions]);

    if (!address) {
        return (
            <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={() =>
                    connect.connect({
                        connector,
                        // @ts-expect-error porto types are not updated
                        capabilities: {
                            grantPermissions: permissions(baseSepolia),
                        },
                    })
                }
                type="button"
            >
                Sign in
            </Button>
        );
    }

    return (
        <div className="flex flex-row gap-2 items-center relative">
            <AccountButtonGroup
                address={address}
                ensName={ensName}
                onCopy={handleCopy}
                onDropdown={handleDropdown}
                dropdownAnchorRef={dropdownAnchorRef}
            />
            <AccountDropdown
                open={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onSignOut={handleSignOut}
                onGrantPermissions={handleGrantPermissions}
                anchorRef={dropdownAnchorRef}
            />
        </div>
    );
};