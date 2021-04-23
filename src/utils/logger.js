const styles = require("../utils/console_colour_styles");

function log_error(text) {
    console.log(styles.errorOpen, text, styles.resetText)
}

function log_info(text) {
    console.log(styles.normalText, text, styles.resetText);
}

module.exports = { log_error, log_info }
