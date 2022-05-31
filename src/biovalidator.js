const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')

const {log_error} = require("./utils/logger");
const BioValidatorCli = require("./core/cli");
const BioValidatorServer = require("./core/server");

const argv = yargs(hideBin(process.argv))
    .usage(_getUsage())
    // .demandOption(['schema', 'data'])
    .alias('s', 'schema')
    .alias('d', 'data')
    .alias('r', 'ref')
    .describe('schema', 'path to the schema file')
    .describe('data', 'path to the data file')
    .describe('ref', 'path to referenced schema directory, file or glob pattern')
    .example('node ./src/biovalidator.js --data=valid.json --schema=test_schema.json',
        'Validates \'valid.json\' with \'test_schema.json\'.')
    .argv

let help = argv["help"]
let schemaRef = argv["ref"]
let schema = argv["schema"]
let data = argv["data"]
let port = argv["port"]

if (help) {
    _printHelp();
} else if (data || schema) {
    if (!_validateCliArgs()) {
        process.exit(1);
    }
    new BioValidatorCli(schema, data, schemaRef).validate();
} else {
    new BioValidatorServer(port, schemaRef).start();
}

function _getUsage() {
    let helpText = "\nbiovalidator: JSON Schema validator with ontology extension\n";
    helpText = helpText.concat("usage: node ./biovalidator.js [--schema=path/to/schema] [--data=path/to/json]")
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

