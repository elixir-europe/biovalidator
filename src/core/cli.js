const logger = require("../winston");
const fs = require("fs");
const {log_error, log_info } = require("../utils/logger");
const BioValidator = require("../biovalidator-core");
const {readJsonFile} = require("../utils/file_utils");

class BioValidatorCli {
    constructor(pathToSchema, pathToJson, pathToRefSchema) {
        this.pathToSchema = pathToSchema
        this.pathToJson = pathToJson
        this.pathToRefSchema = pathToRefSchema;
    }

    validate() {
        let biovalidator = new BioValidator(this.pathToRefSchema);
        this.schema = readJsonFile(this.pathToSchema);
        this.data =  readJsonFile(this.pathToJson)

        if (this.schema && this.data) {
            biovalidator.runValidation(this.schema, this.data).then((output) => {
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

module.exports = BioValidatorCli;
