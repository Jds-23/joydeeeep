import { useZeroDev } from '../lib/zerodev/provider'
import { ellipsis } from '../lib/utils/ellipsis'
import { useClipboard } from '../lib/hooks/useClipboard'
import { Button } from './ui/button'
import { ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface AccountDropdownProps {
    open: boolean;
    onClose: () => void;
    onSignOut: () => void;
    anchorRef: React.RefObject<HTMLButtonElement>;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ open, onClose, onSignOut, anchorRef }) => {
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
        </div>
    );
};

interface AccountButtonGroupProps {
    address: string;
    onCopy: () => void;
    onDropdown: () => void;
    dropdownAnchorRef: React.RefObject<HTMLButtonElement>;
}

const AccountButtonGroup: React.FC<AccountButtonGroupProps> = ({ address, onCopy, onDropdown, dropdownAnchorRef }) => (
    <span className="flex flex-row">
        <Button
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-r-none"
            type="button"
            onClick={onCopy}
        >
            {ellipsis(address, 6)}
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
    const { address, isLoading, connect, disconnect } = useZeroDev();
    const [copy] = useClipboard();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownAnchorRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;

    const handleCopy = useCallback(() => {
        if (address) copy(address);
    }, [address, copy]);

    const handleDropdown = useCallback(() => {
        setIsDropdownOpen((v) => !v);
    }, []);

    const handleSignOut = useCallback(() => {
        disconnect();
    }, [disconnect]);

    if (!address) {
        return (
            <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => connect()}
                disabled={isLoading}
                type="button"
            >
                {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
        );
    }

    return (
        <div className="flex flex-row gap-2 items-center relative">
            <AccountButtonGroup
                address={address}
                onCopy={handleCopy}
                onDropdown={handleDropdown}
                dropdownAnchorRef={dropdownAnchorRef}
            />
            <AccountDropdown
                open={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onSignOut={handleSignOut}
                anchorRef={dropdownAnchorRef}
            />
        </div>
    );
};
