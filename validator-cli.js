const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

function get_usage() {
    let helpText = "\nBio-validator CLI (Command Line Interface)\n";
    helpText = helpText.concat("usage: node ./validator-cli.js [--schema=path/to/schema] [--json=path/to/json]")
    return helpText
}

function print_help() {
    console.log(get_usage())
}

const argv = yargs(hideBin(process.argv))
    .usage(get_usage())
    .demandOption(['schema', 'json'])
    .alias('s', 'schema')
    .alias('j', 'json')
    .alias('r', 'ref')
    .describe('schema', 'path to the schema file')
    .describe('json', 'path to the json file to validate')
    .describe('ref', 'path to referenced schema directory, file or glob pattern')
    .example('node ./validator-cli.js --json=valid.json --schema=test_schema.json',
        'Validates \'valid.json\' with \'test_schema.json\'.')
    .argv

const BioValidatorCLI = require("./src/biovalidator-cli");
const {log_error} = require("./src/utils/logger");

let schema = argv["schema"]
let json = argv["json"]
let schemaRef = argv["ref"]
let isParameterMissing = false;

if (!schema || schema === "" || typeof schema === "boolean") {
    log_error("Schema parameter or its value is missing!");
    isParameterMissing = true;
}
if (!json || json === "" || typeof json === "boolean") {
    log_error("Json parameter or its value is missing!");
    isParameterMissing = true;
}

if (isParameterMissing || argv["help"]) {
    print_help()
} else {
    const bioValidator = new BioValidatorCLI(schema, json, schemaRef);
    bioValidator.validate()
}
