// Original: https://github.com/Marak/colors.js/blob/master/lib/styles.js

const styleCodes = {
    // Reset all styles.
    reset: [0, 0],

    // Text styles.
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],

    // Foregound classic colours.
    fgBlack: [30, 39],
    fgRed: [31, 39],
    fgGreen: [32, 39],
    fgYellow: [33, 39],
    fgBlue: [34, 39],
    fgMagenta: [35, 39],
    fgCyan: [36, 39],
    fgWhite: [37, 39],
    fgGray: [90, 39],

    // Foreground bright colours.
    fgBrightRed: [91, 39],
    fgBrightGreen: [92, 39],
    fgBrightYellow: [93, 39],
    fgBrightBlue: [94, 39],
    fgBrightMagenta: [95, 39],
    fgBrightCyan: [96, 39],
    fgBrightWhite: [97, 39],

    // Background basic colours.
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    bgGray: [100, 49],
    bgGrey: [100, 49],

    // Background bright colours.
    bgBrightRed: [101, 49],
    bgBrightGreen: [102, 49],
    bgBrightYellow: [103, 49],
    bgBrightBlue: [104, 49],
    bgBrightMagenta: [105, 49],
    bgBrightCyan: [106, 49],
    bgBrightWhite: [107, 49],
};

// This object will contain the string representation for all style codes.
const styles = {};

// Loop over all the style codes and assign them to the `styles` object.
//
// The a `styleCode` in the `styleCodes` object consists of two numbers:
// Index 0: The opening style code (In HTML this can be the opening <b> tag).
// Index 1: The closing style code (In HTML this can be the closing </b> tag).
for (let styleCode of Object.keys(styleCodes)) {
    styles[styleCode] = {
        open: `\x1B[${styleCodes[styleCode][0]}m`,
        close: `\x1B[${styleCodes[styleCode][1]}m`,
    };
}

const errorOpen = styles.bold.open + styles.fgRed.open + styles.bgBlack.open;
const resetText = styles.reset.close; // Close everything
const normalText = styles.bold.open + styles.fgGreen.open + styles.bgBlack.open;

module.exports = {errorOpen, normalText, resetText};
