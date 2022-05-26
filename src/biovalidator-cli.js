const logger = require("./winston");
const fs = require("fs");
const {log_error, log_info } = require("./utils/logger");
const BioValidator = require("./biovalidator");

class BioValidatorCLI {
    constructor(pathToSchema, pathToJson, schemaDirectory) {
        this.pathToSchema = pathToSchema
        this.pathToJson = pathToJson
        this.schemaDirectory = schemaDirectory;
    }

    read_schema(pathToSchema) {
        if (fs.existsSync(pathToSchema)) {
            let schemaStr = fs.readFileSync(pathToSchema, 'utf-8')
            return JSON.parse(schemaStr)
        } else {
            log_error("File '" + pathToSchema + "' does not exist!");
            process.exit(1);
        }
    }

    read_json(pathToJson) {
        if (fs.existsSync(pathToJson)) {
            let jsonStr = fs.readFileSync(pathToJson, 'utf-8')
            return JSON.parse(jsonStr)
        } else {
            log_error("File '" + pathToJson + "' does not exist!");
            process.exit(1);
        }
    }

    validate() {
        this.inputSchema = this.read_schema(this.pathToSchema)
        this.jsonToValidate = this.read_json(this.pathToJson)
        let biovalidator = new BioValidator(this.schemaDirectory);

        if (this.inputSchema && this.jsonToValidate) {
            biovalidator.runValidation(this.inputSchema, this.jsonToValidate).then((output) => {
                logger.log("silly", "Sent validation results.");
                this.process_output(output);
            }).catch((error) => {
                console.error("console error: " + error);
                logger.log("error", error);
            });
        } else {
            let appError = "Something is missing, both schema and object are required to execute validation.";
            log_error(appError);
        }
    }

    process_output(output) {
        if (output.length === 0) {
            log_info("No validation errors reported.");
        } else {
            log_error("The validation process has found the following error(s):\n")
            log_error(this.error_report(output));
        }
        console.log("Validation finished.");
    }

    error_report(jsonErrors) {
        let errorOutput = "";
        jsonErrors.forEach( (errorObject) => {
            const dataPath = errorObject.dataPath;
            const errors = errorObject.errors;
            let errorStr = "";
            errors.forEach( (error) => {
                errorStr = errorStr.concat("\n\t", error);
            })
            errorOutput = errorOutput.concat(dataPath + errorStr + "\n");
        })

        return errorOutput;
    }
}

module.exports = BioValidatorCLI;
