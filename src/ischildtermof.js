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
      const ontology = schema.ontology;
      const olsSearchUrl = "https://www.ebi.ac.uk/ols/api/search?q=";

      let errors = [];
      let errorCount = 0;
      for (var i = 0; i < data.length; i++) {
        const termUri = encodeURIComponent(data[i]);
        const url = olsSearchUrl + termUri
        + "&exact=true&groupField=true&allChildrenOf=" + encodeURIComponent(parentTerm)
        + "&ontology=" + ontology + "&queryFields=iri";

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
            if (errorCount === termsArray.length) {
              reject(new Ajv.ValidationError(errors));
            }
          } else {
            errors.push({
              keyword: 'isChildTermOf',
              message: 'Something went wrong while validating term, try again.',
              params: {keyword: 'isChildTermOf'}
            });
            errorCount++;
            if (errorCount === termsArray.length) {
              reject(new Ajv.ValidationError(errors));
            }
          }
        });
      }
    });
  }





/*
  function checkIsChildTermOf(schema, data) {
    return new Promise(function(resolve, reject) {
      const parentTerm = schema.parentTerm;
      const ontology = schema.ontology;
      const termsArray = data;

      let errorCount = 0;
      let errors = [];
      for (var i = 0; i < termsArray.length; i++) { // loop through all provided terms
        const url = "https://www.ebi.ac.uk/ols/api/ontologies/" + ontology + "/terms?iri=" + termsArray[i];

        findParentTerm(url, parentTerm).then(function(result) {
          if (result) {
            resolve(result);
          } else {
            errorCount++;
            errors.push('No child term of ' + parentTerm + ' found.')
            if (errorCount === termsArray.length) {
              reject(new Ajv.ValidationError(errors));
            }
          }
        }).catch(function(){
          errorCount++;
          console.log(errorCount);
          errors.push('Could not access OLS API to check parent term.');
          if (errorCount === termsArray.length) {
            reject(new Ajv.ValidationError(errors));
          }
        });
      }
    });
  }

  function findParentTerm(url, parentTerm, responseBody, promiseParam, resolveParam, rejectParam) {

    if (!promiseParam && !resolveParam && !rejectParam) {
      promiseParam = new Promise(function(resolve, reject) {
        resolveParam = resolve;
        rejectParam = reject;
      });
    }

    if (responseBody) {
      let jsonBody = JSON.parse(responseBody);
      if (jsonBody._embedded.terms[0].iri === parentTerm) {
        resolveParam(true);
      }
      if (jsonBody._embedded.terms[0].is_root) {
        resolveParam(false);
      }
    }

    console.log('Calling: ', url);
    request(url, function(error, response, body) {
      if (error === null && response.statusCode === 200) {
        let jsonBody = JSON.parse(body);
        let parentUrl = jsonBody._embedded.terms[0]._links.parents.href;
        findParentTerm(parentUrl, parentTerm, body, promiseParam, resolveParam, rejectParam);
      } else {
        //reject(error);
        console.log('failled....');
        rejectParam(false);
      }
    });
    return promiseParam;
  }
*/
  ajv.addKeyword('isChildTermOf', defFunc.definition);
  return ajv;
};
