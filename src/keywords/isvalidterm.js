const Ajv = require("ajv").default;
const request = require("request");
const logger = require("../winston");
const CustomAjvError = require("../model/custom-ajv-error");

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
        const findTerm = (schema, data) => {
            return new Promise((resolve, reject) => {
                if (schema) {
                    let errors = [];

                    const termUri = data;
                    const encodedTermUri = encodeURIComponent(termUri);
                    const url = this.olsSearchUrl + encodedTermUri + "&exact=true&groupField=true&queryFields=iri";

                    logger.log("debug", `Looking for term [${termUri}] in OLS.`);
                    request(url, (error, Response, body) => {
                        let jsonBody = JSON.parse(body);

                        if (jsonBody.response.numFound === 1) {
                            logger.log("debug", "Found 1 match!");
                            resolve(true);
                        } else if (jsonBody.response.numFound === 0) {
                            logger.log("debug", "Could not find term in OLS.");
                            errors.push(
                                new CustomAjvError(
                                    "isValidTerm", `provided term does not exist in OLS: [${termUri}]`,
                                    {keyword: "isValidTerm"})
                            );
                            reject(new Ajv.ValidationError(errors));
                        } else {
                            errors.push(
                                new CustomAjvError(
                                    "isValidTerm", "Something went wrong while validating term, try again.",
                                    {keyword: "isValidTerm"})
                            );
                            reject(new Ajv.ValidationError(errors));
                        }
                    });
                } else {
                    resolve(true);
                }
            });
        };

        return findTerm;
    }
}

module.exports = IsValidTerm;
