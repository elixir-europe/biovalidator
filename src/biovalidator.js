const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')

const {log_error} = require("./utils/logger");
const BioValidatorCli = require("./core/cli");
const BioValidatorServer = require("./core/server");

const argv = yargs(hideBin(process.argv))
    .usage(_getUsage())
    .alias('s', 'schema')
    .alias('d', 'data')
    .alias('r', 'ref')
    .alias('p', 'port')
    .describe('schema', 'path to the schema file.')
    .describe('data', 'path to the data file.')
    .describe('ref', 'path to referenced schema directory/file/glob pattern.')
    .describe('port', 'exposed port in server mode. Only valid in server mode.')
    .describe('baseUrl', 'base URL for the server. Only valid in server mode.')
    .describe('pidPath', 'PID file name and path. Only valid in server mode.')
    .describe('logDir', 'path to the log directory.')
    .example('node ./src/biovalidator.js --data=test_data.json --schema=test_schema.json',
        'Runs in CLI mode to validate \'test_data.json\' with \'test_schema.json\'')
    .argv

let help = argv["help"]
let schemaRef = argv["ref"]
let schema = argv["schema"]
let data = argv["data"]
let port = argv["port"]
let baseUrl = argv["baseUrl"]
let pidPath = argv["pidPath"]
let logDir = argv["logDir"]

if (help) {
    _printHelp();
} else if (data || schema) {
    if (!_validateCliArgs()) {
        process.exit(1);
    }
    new BioValidatorCli(schema, data, schemaRef).validate();
} else {
    new BioValidatorServer(port, schemaRef)
        .withBaseUrl(baseUrl)
        .withPid(pidPath)
        .withLogDir(logDir)
        .start();
}

function _getUsage() {
    let helpText = "\nELIXIR biovalidator: JSON Schema validator with ontology extension\n";
    helpText = helpText.concat("usage: node ./src/biovalidator.js [--schema=path/to/schema.json] " +
        "[--data=path/to/data.json] [--ref=path/to/ref/dir]")
    return helpText
}

function _printHelp() {
    console.log(_getUsage())
}

function _validateCliArgs() {
    let valid = true
    if (!schema || schema === "" || typeof schema === "boolean") {
        log_error("missing --data. Please add data file path to run in CLI mode.");
        valid = false;
    }
    if (!data || data === "" || typeof data === "boolean") {
        log_error("missing --schema. Please add schema file path to run in CLI mode.");
        valid = false;
    }

    return valid;
}

