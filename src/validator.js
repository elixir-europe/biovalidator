var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});

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