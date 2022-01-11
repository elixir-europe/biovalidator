/**
 * Created by rolando on 08/08/2018.
 */

const Promise = require('bluebird');
const path = require("path");
const fs = require('fs');
// const Ajv = require("ajv").default;
const Ajv = require("ajv/dist/2019").default;
// import Ajv2019 from "ajv/dist/2019"
const addFormats = require("ajv-formats");
const request = require("request-promise");
const AppError = require("./model/application-error");

const devMode = 0;
console.debug = devMode ? console.debug : () => { };


/**
 *
 * Wraps the generic validator, outputs errors in custom format.
 *
 */

class BioValidator {
    constructor(customKeywordValidators, baseSchemaPath){
        this.validatorCache = {};
        this.cachedSchemas = {};
        this.ajvInstance = this.constructAjv(customKeywordValidators);
        this.baseSchemaPath = baseSchemaPath;
        this.customKeywordValidators = customKeywordValidators;
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

    validateWithRemoteSchema(schemaUri, document) {
        return this.getSchema(schemaUri)
            .then(schema => {return this.validateSingleSchema(document, schema)})
    }

    getSchema(schemaUri) {
        if(! this.cachedSchemas[schemaUri]) {
            return new Promise((resolve, reject) => {
                BioValidator.fetchSchema(schemaUri)
                    .then(schema => {
                        this.cachedSchemas[schemaUri] = schema;
                        resolve(schema);
                    })
                    .catch(err => {
                        reject(err);
                    })
            });
        } else {
            return Promise.resolve(this.cachedSchemas[schemaUri]);
        }
    }

    static fetchSchema(schemaUrl) {
        return request({
            method: "GET",
            url: schemaUrl,
            json: true,
        });
    }

    getValidationFunction(inputSchema) {
        const schemaId = inputSchema['$id'];

        if(this.validatorCache[schemaId]) {
            return Promise.resolve(this.validatorCache[schemaId]);
        } else {
            const compiledSchemaPromise = this.ajvInstance.compileAsync(inputSchema);
            if(schemaId) {
                this.validatorCache[schemaId] = compiledSchemaPromise;
            }
            return Promise.resolve(compiledSchemaPromise);
        }
    }

    constructAjv(customKeywordValidators) {
        // const ajvInstance = new Ajv({allErrors: true, strict:false, loadSchema: this.generateLoadSchemaRefFn()});
        const ajvInstance = new Ajv({allErrors: true, strict:false, loadSchema: this.generateLoadSchemaRefFn()});
        // const ajvInstance = new Ajv2019();
        const draft7MetaSchema = require("ajv/dist/refs/json-schema-draft-07.json")
        ajvInstance.addMetaSchema(draft7MetaSchema)
        addFormats(ajvInstance);
        BioValidator._addCustomKeywordValidators(ajvInstance, customKeywordValidators);

        return ajvInstance
    }

    static _addCustomKeywordValidators(ajvInstance, customKeywordValidators) {
        customKeywordValidators.forEach(customKeywordValidator => {
            ajvInstance = customKeywordValidator.configure(ajvInstance);
        });

        return ajvInstance;
    }

    generateLoadSchemaRefFn() {
        const cachedSchemas = this.cachedSchemas;
        const baseSchemaPath = this.baseSchemaPath;

        const loadSchemaRefFn = (uri) => {
            if(cachedSchemas[uri]) {
                return Promise.resolve(cachedSchemas[uri]);
            } else {
                if (baseSchemaPath) {
                    let ref = path.join(baseSchemaPath, uri);
                    console.log('loading ref ' + ref);
                    let jsonSchema = fs.readFileSync(ref);
                    let loadedSchema = JSON.parse(jsonSchema);
                    loadedSchema["$async"] = true;
                    cachedSchemas[uri] = loadedSchema;
                    return Promise.resolve(loadedSchema);
                }
                else {
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
                            reject(err);
                        });
                    });
                }
            }
        };

        return loadSchemaRefFn;
    }
}

module.exports = BioValidator;
