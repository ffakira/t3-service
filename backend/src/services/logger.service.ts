import Winston from "winston";

const Logger = Winston.createLogger({
    level: "info",
    format: Winston.format.combine(
        Winston.format.timestamp(),
        Winston.format.printf(({ timestamp, level, message}) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new Winston.transports.Console()
    ]
});

/** @dev Simple console color formatting. */
interface Format {
    (text: string): string;
    bold: Format;
    italic: Format;
    underline: Format;
}

function createChainFormat (colorCode: string): Format {
    const baseFormat = (text: string): string => `\x1b[${colorCode}m${text}\x1b[0m`;
    baseFormat.bold = (text: string): string => createChainFormat(`${colorCode};1`)(text);
    baseFormat.italic = (text: string): string => createChainFormat(`${colorCode};3`)(text);
    baseFormat.underline = (text: string): string => createChainFormat(`${colorCode};4`)(text);
    return baseFormat as Format;
}

export const format = {
    black: createChainFormat("30"),
    red: createChainFormat("31"),
    green: createChainFormat("32"),
    yellow: createChainFormat("33"),
    blue: createChainFormat("34"),
    magenta: createChainFormat("35"),
    cyan: createChainFormat("36"),
    white: createChainFormat("37"),
    gray: createChainFormat("90"),
    brightRed: createChainFormat("91"),
    brightGreen: createChainFormat("92"),
    brightYellow: createChainFormat("93"),
    brightBlue: createChainFormat("94"),
    brightMagenta: createChainFormat("95"),
    brightCyan: createChainFormat("96")
};

export default Logger;
