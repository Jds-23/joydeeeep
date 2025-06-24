export function ellipsis(str: string, length: number) {
    return str.length > length ? str.slice(0, length) + '...' + str.slice(-length) : str
}
