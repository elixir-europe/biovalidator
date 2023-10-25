const CurieExpansion = require("../utils/curie_expansion");
const ajv = require("ajv").default;
const axios = require('axios');
const CustomAjvError = require("../model/custom-ajv-error");
const {logger} = require("../utils/winston");
const NodeCache = require("node-cache");

class GraphRestriction {
    constructor(keywordName, olsBaseUrl) {
        this.keywordName = keywordName ? keywordName : "graphRestriction";
        this.olsBaseUrl = olsBaseUrl;
    }

    /**
     *
     * Given an AJV validator, returns the validator with the graph-restriction keyword applied
     *
     * @param ajv
     */
    configure(ajv) {
        const keywordDefinition = {
            keyword: this.keywordName,
            async: GraphRestriction._isAsync(),
            type: "string",
            validate: this.generateKeywordFunction(),
            errors: true
        };

        return ajv.addKeyword(keywordDefinition);
    }

    keywordFunction() {
        return this.generateKeywordFunction();
    }

    isAsync() {
        return GraphRestriction._isAsync();
    }

    static _isAsync() {
        return true;
    }

    generateKeywordFunction() {
        const olsSearchUrl = `${this.olsBaseUrl}/search?q=`;
        const cachedOlsResponses = new NodeCache({stdTTl: 21600, checkperiod: 3600, useClones: false});
        const curieExpansion = new CurieExpansion(olsSearchUrl);

        const callCurieExpansion = (terms) => {
            let expanded = terms.map((t) => {
                if (CurieExpansion.isCurie(t)) {
                    return curieExpansion.expandCurie(t);
                } else {
                    return t
                }
            });

            return Promise.all(expanded);
        };

        const generateErrorObject = (message) => {
            return new CustomAjvError("graphRestriction", message, {});
        };

        return (schema, data) => {
            return new Promise((resolve, reject) => {
                let parentTerms = schema.classes;
                const ontologyIds = schema.ontologies;
                let queryFields = schema.queryFields ? schema.queryFields.join(",") : "obo_id";
                let errors = [];

                if (parentTerms && ontologyIds) {
                    if (schema.includeSelf === true && parentTerms.includes(data)) {
                        resolve(data);
                    } else {
                        callCurieExpansion(parentTerms).then((iris) => {
                            const parentTerm = iris.join(",");
                            const ontologyId = ontologyIds.join(",").replace(/obo:/g, "");

                            const termUri = encodeURIComponent(data);
                            const url = olsSearchUrl + termUri
                                + "&exact=true&groupField=true&allChildrenOf=" + encodeURIComponent(parentTerm)
                                // + "&ontology=" + ontologyId + "&queryFields=obo_id,label";
                                + "&ontology=" + ontologyId + "&queryFields=" + queryFields;

                            let olsResponsePromise;
                            if (cachedOlsResponses.has(url)) {
                                olsResponsePromise = Promise.resolve(cachedOlsResponses.get(url));
                                logger.debug("Returning cached response for OLS request: " + url)
                            } else {
                                olsResponsePromise = axios({
                                    method: "GET",
                                    url: url,
                                    responseType: 'json'
                                });
                            }

                            olsResponsePromise.then((response) => {
                                cachedOlsResponses.set(url, response);
                                if (response.status === 200 && response.data.response.numFound === 1) {
                                    logger.debug(`Returning resolved term from OLS: [${parentTerm}]`);
                                } else if (response.status === 200 && response.data.response.numFound === 0) {
                                    logger.warn(`Failed to resolve term from OLS. Invalid relationship: [${ontologyId}]`);
                                    errors.push(generateErrorObject(`Provided term is not child of [${parentTerm}]`));
                                } else {
                                    logger.error(`Failed to resolve term from OLS. Unknown error: [${ontologyId}]`);
                                    errors.push(generateErrorObject("Something went wrong while validating term, try again."));
                                }
                            }).catch(err => {
                                logger.error("Failed to resolve term from OLS. Unknown error: " + err);
                                errors.push(generateErrorObject(err));
                            }).finally(function () {
                                if (errors.length > 0) {
                                    reject(new ajv.ValidationError(errors));
                                } else {
                                    resolve(true);
                                }
                            });
                        }).catch(err => {
                            logger.error("Failed to resolve term from OLS. Unknown error: " + err);
                            errors.push(generateErrorObject(err));
                        }).finally(function () {
                            if (errors.length > 0) {
                                reject(new ajv.ValidationError(errors));
                            }
                        });
                    }
                } else {
                    errors.push(generateErrorObject("Missing required variable in schema graphRestriction, required properties are: parentTerm and ontologyId."));
                    reject(ajv.ValidationError);
                }
            });
        };

    }
}

module.exports = GraphRestriction;
