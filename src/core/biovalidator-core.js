const Promise = require('bluebird');
const Ajv = require("ajv/dist/2019").default;
const addFormats = require("ajv-formats");
const request = require("request-promise");
const AppError = require("../model/application-error");
const {getFiles, readFile} = require("../utils/file_utils");
const {isChildTermOf, isValidTerm, isValidTaxonomy} = require("../keywords");
const GraphRestriction = require("../keywords/graphRestriction");
const ValidationError = require("../model/validation-error");
const {logger} = require("../utils/winston");

const customKeywordValidators = [
    new isChildTermOf(null, "https://www.ebi.ac.uk/ols/api/search?q="),
    new isValidTerm(null, "https://www.ebi.ac.uk/ols/api/search?q="),
    new isValidTaxonomy(null),
    new GraphRestriction(null, "https://www.ebi.ac.uk/ols/api")
];

class BioValidator {
    constructor(localSchemaPath) {
        this.validatorCache = {};
        this.cachedSchemas = {};
        this.ajvInstance = this._getAjvInstance(localSchemaPath);
    }

    // wrapper around _validate to process output
    validate(inputSchema, inputObject) {
        logger.log("silly", "Running validation...");
        return new Promise((resolve, reject) => {
            this._validate(inputSchema, inputObject)
                .then((validationResult) => {
                        if (validationResult.length === 0) {
                            resolve([]);
                        } else {
                            let ajvErrors = [];
                            validationResult.forEach(validationError => {
                                ajvErrors.push(validationError);
                            });
                            resolve(this.convertToValidationErrors(ajvErrors));
                        }
                    }
                ).catch((error) => {
                if (error.errors) {
                    logger.error("failed to validate: " + JSON.stringify(error))
                    reject(new AppError(error.errors));
                } else {
                    logger.error("An error occurred while running the validation: " + JSON.stringify(error));
                    reject(error);
                }
            });
        });
    }

    getCachedSchema() {
        this.ajvInstance.getSchema("");
    }

    clearCachedSchema() {
        this.ajvInstance.removeSchema();
        this.validatorCache = {};
        this.cachedSchemas = {};
    }

    // AJV requires $async keyword in schemas if they use any of async custom defined keywords.
    // We populate all schemas/defs with $async as a workaround to avoid users manually entering $async in schemas.
    _insertAsyncToSchemasAndDefs(inputSchema) {
        inputSchema["$async"] = true;
        if (inputSchema.hasOwnProperty("definitions")) {
            let defs = Object.keys(inputSchema.definitions);
            for (let x = 0; x < defs.length; x++) {
                inputSchema.definitions[defs[x]]["$async"] = true;
            }
        }
    }

    _validate(inputSchema, inputObject) {
        this._insertAsyncToSchemasAndDefs(inputSchema);

        return new Promise((resolve, reject) => {
            const compiledSchemaPromise = this.getValidationFunction(inputSchema);

            compiledSchemaPromise.then((validate) => {
                Promise.resolve(validate(inputObject))
                    .then((data) => {
                            if (validate.errors) {
                                resolve(validate.errors);
                            } else {
                                resolve([]);
                            }
                        }
                    ).catch((err) => {
                    if (!(err instanceof Ajv.ValidationError)) {
                        logger.error("An error occurred while running the validation.");
                        reject(new AppError("An error occurred while running the validation."));
                    } else {
                        logger.debug("Validation failed with errors: " + this.ajvInstance.errorsText(err.errors, {dataVar: inputObject.alias}));
                        resolve(err.errors);
                    }
                });
            }).catch((err) => {
                logger.error("Failed to compile schema: " + err);
                reject(err);
            });
        });
    }

    convertToValidationErrors(ajvErrorObjects) {
        let localErrors = [];
        ajvErrorObjects.forEach((errorObject) => {
            let tempValError = new ValidationError(errorObject);
            let index = localErrors.findIndex(valError => (valError.dataPath === tempValError.dataPath));

            if (index !== -1) {
                localErrors[index].errors.push(tempValError.errors[0]);
            } else {
                localErrors.push(tempValError);
            }
        });
        return localErrors;
    }

    getValidationFunction(inputSchema) {
        const schemaId = inputSchema['$id'];

        if (this.validatorCache[schemaId]) {
            return Promise.resolve(this.validatorCache[schemaId]);
        } else {
            const compiledSchemaPromise = this.ajvInstance.compileAsync(inputSchema);
            if (schemaId) {
                this.validatorCache[schemaId] = compiledSchemaPromise;
            }
            return Promise.resolve(compiledSchemaPromise);
        }
    }

    _getAjvInstance(localSchemaPath) {
        const ajvInstance = new Ajv({allErrors: true, strict: false, loadSchema: this._resolveReference()});
        const draft7MetaSchema = require("ajv/dist/refs/json-schema-draft-07.json")
        ajvInstance.addMetaSchema(draft7MetaSchema)
        addFormats(ajvInstance);

        this._addCustomKeywordValidators(ajvInstance);
        this._preCompileLocalSchemas(ajvInstance, localSchemaPath);

        return ajvInstance
    }

    _resolveReference() {
        return (uri) => {
            if (this.cachedSchemas[uri]) {
                return Promise.resolve(this.cachedSchemas[uri]);
            } else {
                return new Promise((resolve, reject) => {
                    request({method: "GET", url: uri, json: true})
                        .then(resp => {
                            const loadedSchema = resp;
                            this._insertAsyncToSchemasAndDefs(loadedSchema);
                            this.cachedSchemas[uri] = loadedSchema;
                            resolve(loadedSchema);
                        }).catch(err => {
                        logger.error("Failed to retrieve remote schema: " + uri + ", " + JSON.stringify(err))
                        reject(new AppError("Failed to resolve $ref: " + uri + ", status: " + err.statusCode));
                    });
                });
            }
        };
    }

    _addCustomKeywordValidators(ajvInstance) {
        customKeywordValidators.forEach(customKeywordValidator => {
            ajvInstance = customKeywordValidator.configure(ajvInstance);
        });

        return ajvInstance;
    }

    _preCompileLocalSchemas(ajv, localSchemaPath) {
        if (localSchemaPath) {
            let schemaFiles = getFiles(localSchemaPath);
            for (let file of schemaFiles) {
                let schema = readFile(file);
                ajv.getSchema(schema["$id"] || ajv.compile(schema));
                this.cachedSchemas[schema["$id"]] = schema;
            }
        }
    }
}

module.exports = BioValidator;
