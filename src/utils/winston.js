const {format} = require("winston");
const winston = require("winston");
const {printf, combine, timestamp} = format;
require("winston-daily-rotate-file");

logDir = process.env.BIOVALIDATOR_LOG_DIR || "logs";

const options = {
    console: {
        level: "debug",
        json: false,
        colorize: true
    },
    rotate: {
        level: "info",
        filename: "json-schema-validator-%DATE%.log",
        datePattern: "YYYYMMDD",
        zippedArchive: true,
        dirname: this.logPath,
        maxSize: "20m",
        maxFiles: "14d"
    }
};

const dateFormat = printf((info) => {
    return `${info.timestamp} [${info.level}] ${info.message}`;
});

const transportsArray = [
    new winston.transports.Console(options.console)
]

const logger = winston.createLogger({
    format: combine(
        timestamp(),
        dateFormat
    ),
    transports: transportsArray,
    exitOnError: false,
});

function addLogDirectory(logDirectory) {
    logger.add(new winston.transports.DailyRotateFile({
        filename: 'biovalidator.log',
        dirname: logDirectory,
        datePattern: 'YYYY-MM-DD-HH'
    }));
}

module.exports = {logger, addLogDirectory};
