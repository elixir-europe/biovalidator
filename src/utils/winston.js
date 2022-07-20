const { format } = require("winston");
const winston = require("winston");
const { printf, combine, timestamp } = format;
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
    zippedArchive: true, // gzip archived log files
    dirname: this.logPath, // target directory for log files
    maxSize: "20m", // maximum size of the file after which it will rotate
    maxFiles: "14d" // number of days log files will be kept for
  }
};

const dateFormat = printf((info) => {
  return `${info.timestamp} [${info.level}] ${info.message}`;
});

const transportsArray = [
  new winston.transports.Console(options.console),
  new (winston.transports.DailyRotateFile)({
    filename: 'biovalidator.log',
    dirname: logDir,
    datePattern: 'YYYY-MM-DD-HH'
  })
]

const logger = winston.createLogger({
  format: combine(
    timestamp(),
    dateFormat
  ),
  transports: transportsArray,
  exitOnError: false,
});

function getLogger(logDir) {
  const transportsArray = [];
  transportsArray.push(new winston.transports.Console(options.console));
  // transportsArray.push(new winston.transports.File({
  //   level: 'info',
  //   filename: 'logs/example.log'
  // }));
  transportsArray.push(new(winston.transports.DailyRotateFile)({
    filename: 'rotate.log',
    dirname: logDir,
    datePattern: 'YYYY-MM-DD-HH'
  }));

  return winston.createLogger({
    format: combine(
        timestamp(),
        dateFormat
    ),
    transports: transportsArray,
    exitOnError: false,
  });
}

module.exports = {logger, getLogger};
