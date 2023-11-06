const ajv = require("ajv").default;
const axios = require('axios');
const CustomAjvError = require("../model/custom-ajv-error");
const {logger} = require("../utils/winston");
const constants = require("../utils/constants");
const NodeCache = require("node-cache");

class IsValidIdentifier {
    constructor() {
        this.keywordName = "isValidIdentifier";
        this.identifiersOrgUrl = constants.IDENTIFIER_ORG_RESOLVER_URL;
    }

    configure(ajv) {
        return ajv.addKeyword({
            keyword: this.keywordName,
            type: "string",
            async: true,
            validate: this.validationFunction(),
            errors: true
        });
    }

    validationFunction() {
        const cachedIdentifiers = new NodeCache({stdTTl: 21600, checkperiod: 3600, useClones: false});;

        const generateErrorObject = (message) => {
            return new CustomAjvError(this.keywordName, message, {});
        };

        return (schema, identifier) => {
            return new Promise((resolve, reject) => {
                const prefixes = new Set(schema.prefixes);
                const prefix = schema.prefix;
                const identifierPrefix = identifier.substring(0, identifier.indexOf(":"));
                let errors = [];

                if (prefix) {
                    identifier = prefix + ":" + identifier;
                } else if (prefixes && !prefixes.has(identifierPrefix)) {
                    errors.push(generateErrorObject(`"${identifierPrefix}" is not a valid namespace for the identifier. Allowed namespaces are [${new Array(...prefixes).join(', ')}]`));
                    reject(new ajv.ValidationError(errors));
                    return;
                }

                let responsePromise;
                if (cachedIdentifiers.has(identifier)) {
                    responsePromise = Promise.resolve(cachedIdentifiers.get(identifier));
                    logger.debug("Returning cached response for identifiers.org request: " + identifier)
                } else {
                    responsePromise = axios({
                        method: "GET",
                        url: this.identifiersOrgUrl + identifier,
                        responseType: 'json'
                    });
                }

                responsePromise.then((response) => {
                    cachedIdentifiers.set(identifier, response);
                    if (response.status === 200 && response.data.payload.resolvedResources.length > 0) {
                        const resolvedUrl = response.data.payload.resolvedResources[0].compactIdentifierResolvedUrl;
                        logger.debug(`Returning resolved term: ${identifier} -> ${resolvedUrl}`);
                    } else {
                        errors.push(generateErrorObject(`Failed to resolve term from identifiers.org. [${response.errors}]`));
                    }
                }).catch(function (error) {
                    if (error.response.status === 400) {
                        errors.push(generateErrorObject(`Failed to resolve term from identifiers.org. [${error.response.data.errorMessage}]`));
                    } else {
                        errors.push(generateErrorObject(`Failed to resolve term from identifiers.org. [${error}]`));
                    }
                }).finally(function () {
                    if (errors.length > 0) {
                        reject(new ajv.ValidationError(errors));
                    } else {
                        resolve(true);
                    }
                });
            });
        };
    }
}

module.exports = IsValidIdentifier;
