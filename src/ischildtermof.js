'use strict';

var Ajv = require('ajv');
var request = require('request');

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    async: true,
    type: 'array',
    validate: findChildTerms,
    errors: true
  };

  function findChildTerms(schema, data) {
    return new Promise( function(resolve, reject) {
      const parentTerm = schema.parentTerm;
      const ontologyId = schema.ontologyId;
      const olsSearchUrl = "https://www.ebi.ac.uk/ols/api/search?q=";

      let errors = [];

      if(parentTerm && ontologyId) {
        let errorCount = 0;
        for (var i = 0; i < data.length; i++) {
          const termUri = encodeURIComponent(data[i]);
          const url = olsSearchUrl + termUri
          + "&exact=true&groupField=true&allChildrenOf=" + encodeURIComponent(parentTerm)
          + "&ontology=" + ontologyId + "&queryFields=iri";

          console.log('Evaluating isChildTermOf', url);
          request(url, function(error, response, body) {
            let jsonBody = JSON.parse(body);
            if(jsonBody.response.numFound === 1) {
              resolve(true);
            } else if(jsonBody.response.numFound === 0) {
              errors.push({
                keyword: 'isChildTermOf',
                message: 'is not child term of ' + parentTerm,
                params: {keyword: 'isChildTermOf'}
              });
              errorCount++;
              if (errorCount === data.length) {
                reject(new Ajv.ValidationError(errors));
              }
            } else {
              errors.push({
                keyword: 'isChildTermOf',
                message: 'Something went wrong while validating term, try again.',
                params: {keyword: 'isChildTermOf'}
              });
              errorCount++;
              if (errorCount === data.length) {
                reject(new Ajv.ValidationError(errors));
              }
            }
          });
        }
      } else {
        errors.push({
          keyword: 'isChildTermOf',
          message: 'Missing required variable in schema isChildTermOf, required properties are: parentTerm and ontologyId.',
          params: {keyword: 'isChildTermOf'}
        });
        reject(new Ajv.ValidationError(errors));
      }

    });
  }

  ajv.addKeyword('isChildTermOf', defFunc.definition);
  return ajv;
};
