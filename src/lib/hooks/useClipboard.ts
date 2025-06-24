import { useState, useCallback } from 'react';

/**
 * useClipboard - React hook for copying text to clipboard with feedback
 * @param timeout Duration in ms for how long `copied` stays true (default: 1500)
 * @returns [copy, copied]:
 *   copy - function to copy a string to clipboard
 *   copied - boolean, true if copy was successful recently
 */
export function useClipboard(timeout: number = 1500): [copy: (text: string) => Promise<boolean>, copied: boolean] {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(async (text: string) => {
        if (!navigator?.clipboard) {
            return false;
        }
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), timeout);
            return true;
        } catch {
            setCopied(false);
            return false;
        }
    }, [timeout]);

    return [copy, copied];
}
