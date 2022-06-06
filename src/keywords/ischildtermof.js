const Ajv = require("ajv").default;
const request = require("request");
const {logger} = require("../utils/winston");
const CustomAjvError = require("../model/custom-ajv-error");

class IsChildTermOf {
  constructor(keywordName, olsSearchUrl) {
      this.keywordName = keywordName ? keywordName : "isChildTermOf";
      this.olsSearchUrl = olsSearchUrl;
  }

  configure(ajv) {
      const keywordDefinition= {
          keyword: this.keywordName,
          async: this.isAsync(),
          type: "string",
          validate: this.generateKeywordFunction(),
          errors: true
      };

      return ajv.addKeyword( keywordDefinition);
  }

  keywordFunction() {
      return this.generateKeywordFunction();
  }

  isAsync() {
      return true;
  }

  generateKeywordFunction() {
      const findChildTerm= (schema, data) => {
        return new Promise((resolve, reject) => {
          const parentTerm = schema.parentTerm;
          const ontologyId = schema.ontologyId;
          let errors = [];
    
          if(parentTerm && ontologyId) {    
            const termUri = encodeURIComponent(data);
            const url = this.olsSearchUrl + termUri
            + "&exact=true&groupField=true&allChildrenOf=" + encodeURIComponent(parentTerm)
            + "&ontology=" + ontologyId + "&queryFields=iri";
    
            logger.log("debug", `Evaluating isChildTermOf, query url: [${url}]`);
            request(url, (error, response, body) => {
              let jsonBody = JSON.parse(body);
    
              if(jsonBody.response.numFound === 1) {
                logger.log("debug", "It's a child term!");
                resolve(true);
              } else if(jsonBody.response.numFound === 0) {
                logger.log("debug", `Provided term is not child of [${parentTerm}]`);
                errors.push(
                  new CustomAjvError(
                    "isChildTermOf", `Provided term is not child of [${parentTerm}]`,
                    {keyword: "isChildTermOf"})
                  );
                reject(new Ajv.ValidationError(errors));
              } else {
                errors.push(
                  new CustomAjvError(
                    "isChildTermOf", "Something went wrong while validating term, try again.", 
                    {keyword: "isChildTermOf"})
                  );
                reject(new Ajv.ValidationError(errors));
              }
            });
          } else {
            errors.push(
              new CustomAjvError(
                "isChildTermOf",
                "Missing required variable in schema isChildTermOf, required properties are: parentTerm and ontologyId.",
                {keyword: "isChildTermOf"})
              );
            reject(new Ajv.ValidationError(errors));
          }
        });
      }

      return findChildTerm;
  }
}

module.exports = IsChildTermOf;
