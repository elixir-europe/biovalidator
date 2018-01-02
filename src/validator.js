var Ajv = require('ajv');
var DefFunc = require('./ischildtermof');

var ajv = new Ajv({allErrors: true});
var defFunc = new DefFunc(ajv);

function runValidation(inputSchema, submittable) {
  var validate = ajv.compile(inputSchema);
  var valid = validate(submittable);
  if (valid) {
    return { result: 'Valid!'};
  } else {
    return { result: 'Invalid: ' + ajv.errorsText(validate.errors)};
  }
}

module.exports = runValidation;
