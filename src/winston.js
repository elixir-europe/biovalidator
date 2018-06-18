const { createLogger, format, transports } = require("winston");
const { printf, combine, timestamp } = format;
require("winston-daily-rotate-file");

// define the custom settings for each transport (console, file)
const options = {
  console: {
    level: "debug",
    json: false,
    colorize: true
  },
  rotate: {
    level: "debug",
    filename: "json-schema-validator-%DATE%.log",
    datePattern: "YYYYMMDD",
    zippedArchive: true, // gzip archived log files
    dirname: "./log", // target directory for log files
    maxSize: "20m", // maximum size of the file after which it will rotate
    maxFiles: "14d" // number of days log files will be kept for
  }
};

const dateFormat = printf((info) => {
  return `${info.timestamp} [${info.level}] ${info.message}`;
});

const logger = createLogger({
  format: combine(
    timestamp(),
    dateFormat
  ),
  transports: [
    new transports.Console(options.console),
    new transports.DailyRotateFile(options.rotate)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;
