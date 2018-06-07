var Ajv = require("ajv");
var request = require("request");
const logger = require('../winston');

module.exports = function defFunc(ajv) {

  function findTerm(schema, data) {
    return new Promise((resolve, reject) =>{
      const olsSearchUrl = "https://www.ebi.ac.uk/ols/api/search?q=";
      let errors = [];

      let errorCount = 0;
      for(let i = 0; i < data.length; i++) {
        const termUri = data[i];
        const encodedTermUri = encodeURIComponent(termUri);
        const url = olsSearchUrl + encodedTermUri + "&exact=true&groupField=true&queryFields=iri";

        logger.log("debug", `Looking for term [${termUri}] in OLS.`);
        request(url, (error, Response, body) => {
          let jsonBody = JSON.parse(body);

          // TODO

        });
      }
    });
    
    
  }

  defFunc.definition = {
    async: true,
    type: "array",
    validate: findTerm,
    errors: true
  };

  ajv.addKeyword("isValidTerm", defFunc.definition);
  return ajv;
};
