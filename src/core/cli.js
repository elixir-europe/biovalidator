const logger = require("../utils/winston");
const {log_error, log_info } = require("../utils/logger");
const BioValidator = require("./biovalidator-core");
const {readJsonFile} = require("../utils/file_utils");
const {exit} = require("yargs");

class BioValidatorCli {
    constructor(pathToSchema, pathToJson, pathToRefSchema) {
        this.pathToSchema = pathToSchema
        this.pathToJson = pathToJson
        this.biovalidator = new BioValidator(pathToRefSchema);
    }

    validate() {
        try {
            this.schema = readJsonFile(this.pathToSchema);
            this.data =  readJsonFile(this.pathToJson)
        } catch (err) {
            logger.error("Both schema and data files are required for validation");
            process.exit(1)
        }

        if (this.schema && this.data) {
            this.biovalidator.validate(this.schema, this.data).then((output) => {
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
            log_info("Validation passed successfully.");
        } else {
            log_error("Validation failed with following error(s):\n")
            log_error(this.error_report(output));
        }
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
