const axios = require("axios");
const {logger} = require("../utils/winston");
const CustomAjvError = require("../model/custom-ajv-error");
const {default: ajv} = require("ajv");

class IsValidTerm {
    constructor(keywordName, olsSearchUrl) {
        this.keywordName = keywordName ? keywordName : "isValidTerm";
        this.olsSearchUrl = olsSearchUrl;
    }

    configure(ajv) {
        const keywordDefinition = {
            keyword: this.keywordName,
            async: this.isAsync(),
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
        return true;
    }

    generateKeywordFunction() {
        return (schema, data) => {
            return new Promise((resolve, reject) => {
                if (schema) {
                    let errors = [];

                    const termUri = data;
                    const encodedTermUri = encodeURIComponent(termUri);
                    const url = this.olsSearchUrl + encodedTermUri + "&exact=true&groupField=true&queryFields=iri";

                    axios({method: "GET", url: url, responseType: 'json'})
                        .then((response) => {
                            if (response.status === 200 && response.data.response.numFound === 1) {
                                logger.debug(`Returning resolved term from OLS: [${termUri}]`);
                            } else if (response.status === 200 && response.data.response.numFound === 0) {
                                logger.warn(`Failed to resolve term from OLS. Term not present: [${termUri}]`);
                                errors.push(new CustomAjvError(
                                    "isValidTerm", `provided term does not exist in OLS: [${termUri}]`,
                                    {keyword: "isValidTerm"})
                                );
                            } else {
                                logger.error(`Failed to resolve term from OLS. Unknown error: [${termUri}]`);
                                errors.push(new CustomAjvError(
                                    "isValidTerm", "Something went wrong while validating term, try again.",
                                    {keyword: "isValidTerm"})
                                );
                            }
                        })
                        .catch((error) => {
                            logger.error(`Failed to resolve term from OLS. Unknown error: [${termUri}]. [${error.response.data.errorMessage}]`);
                            errors.push(new CustomAjvError(
                                "isValidTerm", "Something went wrong while validating term, try again." + error.response.data.errorMessage,
                                {keyword: "isValidTerm"})
                            );
                        })
                        .finally(() => {
                            if (errors.length > 0) {
                                reject(new ajv.ValidationError(errors));
                            } else {
                                resolve(true);
                            }
                        });
                } else {
                    logger.warn(`Trying to work with empty schema. Why are we here : [${schema}]`);
                    resolve(true);
                }
            });
        };
    }
}

module.exports = IsValidTerm;
