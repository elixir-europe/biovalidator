const Promise = require('bluebird');
const Ajv = require("ajv/dist/2019").default;
const addFormats = require("ajv-formats");
const request = require("request-promise");
const AppError = require("../model/application-error");
const {getFiles, readFile} = require("../utils/file_utils");
const {isChildTermOf, isValidTerm, isValidTaxonomy} = require("../keywords");
const GraphRestriction = require("../keywords/graphRestriction");
const ValidationError = require("../model/validation-error");
const logger = require("../utils/winston");

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
        this.localSchemaPath = localSchemaPath;
        this.ajvInstance = this._getAjvInstance();
    }

    runValidation(inputSchema, inputObject) {
        logger.log("silly", "Running validation...");
        return new Promise((resolve, reject) => {
            this.validate(inputSchema, inputObject)
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
                    reject(new AppError(error.errors));
                } else {
                    logger.log("error", "An error occurred while running the validation. Error : " + JSON.stringify(error));
                    reject(new AppError("An error occurred while running the validation."));
                }
            });
        });
    }

    validate(inputSchema, inputObject) {
        inputSchema["$async"] = true;
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
                        console.error("An error occurred while running the validation.");
                        reject(new AppError("An error occurred while running the validation."));
                    } else {
                        console.debug("debug", this.ajvInstance.errorsText(err.errors, {dataVar: inputObject.alias}));
                        resolve(err.errors);
                    }
                });
            }).catch((err) => {
                console.error("async schema compiled encountered and error");
                console.error(err.stack);
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

    _getAjvInstance() {
        const ajvInstance = new Ajv({allErrors: true, strict: false, loadSchema: this._resolveReferences()});
        const draft7MetaSchema = require("ajv/dist/refs/json-schema-draft-07.json")
        ajvInstance.addMetaSchema(draft7MetaSchema)
        addFormats(ajvInstance);

        this._addCustomKeywordValidators(ajvInstance);
        this._preCompileLocalSchemas(ajvInstance);

        return ajvInstance
    }

    _resolveReferences() {
        const cachedSchemas = this.cachedSchemas;

        return (uri) => {
            if (cachedSchemas[uri]) {
                return Promise.resolve(cachedSchemas[uri]);
            } else {
                return new Promise((resolve, reject) => {
                    request({
                        method: "GET",
                        url: uri,
                        json: true
                    }).then(resp => {
                        const loadedSchema = resp;
                        loadedSchema["$async"] = true;
                        cachedSchemas[uri] = loadedSchema;
                        resolve(loadedSchema);
                    }).catch(err => {
                        logger.error("Failed to retrieve remote schema: " + uri + ", " + err.name + ": " + err.statusCode)
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

    _preCompileLocalSchemas(ajv) {
        if (this.localSchemaPath) {
            let schemaFiles = getFiles(this.localSchemaPath);
            for (let file of schemaFiles) {
                let schema = readFile(file);
                ajv.getSchema(schema["$id"] || ajv.compile(schema));
                this.cachedSchemas[schema["$id"]] = schema;
            }
        }
    }
}

module.exports = BioValidator;
