'use strict';

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    async: true,
    type: 'array',
    validate: checkIsChildTermOf,
    errors: true
  };

  function checkIsChildTermOf(schema, data) {
    //console.log('parentTerm: ' + schema.parentTerm); // string - uri
    //console.log('terms: ' + data); // [string - uri]
    // TODO - ontology term lookup
    return true;
  }

  ajv.addKeyword('isChildTermOf', defFunc.definition);
  return ajv;
};
