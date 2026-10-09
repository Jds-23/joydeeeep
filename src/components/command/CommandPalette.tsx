import { useMemo, useState } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from '@tanstack/react-router'
import { formatForDisplay, useHotkeyRegistrations } from '@tanstack/react-hotkeys'
import { commandGroups, commands, type CommandItem } from '../../lib/commands'
import { usePalette } from '../../lib/hooks/usePalette'
import { Kbd } from './KeyHint'

const groupClass =
    '[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-neutral-500'
const itemClass =
    'flex items-center justify-between gap-2 px-2.5 py-1.5 mx-1 rounded cursor-pointer text-xs data-[selected=true]:bg-neutral-900 data-[selected=true]:text-white'

function Keys({ keys }: { keys: string[] }) {
    return (
        <span className="hidden pointer-fine:inline-flex items-center gap-1 shrink-0">
            {keys.map((k, i) => (
                <Kbd key={i}>{k}</Kbd>
            ))}
        </span>
    )
}

interface ShortcutRow {
    group: string
    name: string
    combos: string[][]
}

/** Live list of every registered hotkey/sequence that carries a meta.name, merged by name. */
function useShortcutRows(): ShortcutRow[] {
    const { hotkeys, sequences } = useHotkeyRegistrations()
    return useMemo(() => {
        const rows = new Map<string, ShortcutRow>()
        const add = (group: string | undefined, name: string | undefined, combo: string[]) => {
            if (!name) return
            const g = group ?? 'Other'
            const key = `${g}:${name}`
            const row = rows.get(key) ?? { group: g, name, combos: [] }
            if (!row.combos.some(c => c.join() === combo.join())) row.combos.push(combo)
            rows.set(key, row)
        }
        hotkeys.forEach(reg => add(reg.options.meta?.group, reg.options.meta?.name, [formatForDisplay(reg.hotkey)]))
        sequences.forEach(reg => add(reg.options.meta?.group, reg.options.meta?.name, reg.sequence.map(k => formatForDisplay(k))))
        return [...rows.values()]
    }, [hotkeys, sequences])
}

export function CommandPalette() {
    const { isOpen, mode, open, close, setOpen } = usePalette()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const shortcutRows = useShortcutRows()

    const run = (item: CommandItem) => {
        if (!item.keepOpen) close()
        item.run({ navigate, showShortcuts: () => open('shortcuts') })
        setSearch('')
    }

    const shortcutGroups = [...new Set(shortcutRows.map(r => r.group))]

    return (
        <Command.Dialog
            open={isOpen}
            onOpenChange={value => {
                setOpen(value)
                if (!value) setSearch('')
            }}
            label="Command center"
            loop
            overlayClassName="fixed inset-0 z-[100] bg-black/30"
            contentClassName="fixed z-[101] left-1/2 top-[12vh] -translate-x-1/2 w-[calc(100vw-32px)] max-w-lg rounded-lg border-2 border-neutral-900 bg-white text-neutral-900 shadow-[4px_4px_0_0_#171717] overflow-hidden"
        >
            <div className="flex items-center gap-2 border-b-2 border-neutral-900 px-3">
                <span className="font-mono text-xs">{mode === 'shortcuts' ? '?' : '>'}</span>
                <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    onKeyDown={e => {
                        if (mode === 'shortcuts' && e.key === 'Backspace' && search === '') open('all')
                    }}
                    placeholder={mode === 'shortcuts' ? 'Search shortcuts…' : 'Jump to page, experiment, book, link…'}
                    className="w-full py-2 bg-transparent outline-none text-xs placeholder:text-neutral-400"
                />
                <Keys keys={['esc']} />
            </div>
            <Command.List className="max-h-[60vh] overflow-y-auto pb-2">
                <Command.Empty className="px-3 py-4 text-xs text-center text-neutral-500">Nothing found.</Command.Empty>

                {mode === 'all' &&
                    commandGroups.map(group => (
                        <Command.Group key={group} heading={group} className={groupClass}>
                            {commands
                                .filter(c => c.group === group)
                                .map(item => (
                                    <Command.Item
                                        key={item.id}
                                        value={item.id}
                                        keywords={[item.label, item.detail ?? '', ...(item.keywords ?? [])]}
                                        onSelect={() => run(item)}
                                        className={itemClass}
                                    >
                                        <span className="truncate">
                                            {item.label}
                                            {item.detail && <span className="ml-2 text-xs opacity-60">{item.detail}</span>}
                                        </span>
                                        {item.shortcut && <Keys keys={item.shortcut} />}
                                    </Command.Item>
                                ))}
                        </Command.Group>
                    ))}

                {mode === 'shortcuts' &&
                    shortcutGroups.map(group => (
                        <Command.Group key={group} heading={group} className={groupClass}>
                            {shortcutRows
                                .filter(r => r.group === group)
                                .map(row => (
                                    <Command.Item key={`${group}:${row.name}`} value={`${group}:${row.name}`} keywords={[row.name]} className={itemClass}>
                                        <span>{row.name}</span>
                                        <span className="flex items-center gap-2">
                                            {row.combos.map((combo, i) => (
                                                <span key={i} className="flex items-center gap-1">
                                                    {i > 0 && <span className="text-xs opacity-50">or</span>}
                                                    {combo.map((k, j) => (
                                                        <Kbd key={j}>{k}</Kbd>
                                                    ))}
                                                </span>
                                            ))}
                                        </span>
                                    </Command.Item>
                                ))}
                        </Command.Group>
                    ))}
            </Command.List>
        </Command.Dialog>
    )
}
