export const hexToBinary = (hex: string): string => {
    return parseInt(hex.replace(/^0x/i, ''), 16).toString(2);
}

export const binaryToHex = (binary: string): string =>
    parseInt(binary, 2).toString(16);