var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});
const fs = require('fs');

var inputSchema = fs.readFileSync('schemas/faang-schema.json');
var jsonSchema = JSON.parse(inputSchema);
var validate = ajv.compile(jsonSchema);

var inputObject = fs.readFileSync('objects/faang-sample.json');
var jsonObject = JSON.parse(inputObject);

test(jsonObject);

function test(data) {
  var valid = validate(data);
  if (valid) {
    console.log('Valid!');
  } else {
    console.log('Invalid: ' + ajv.errorsText(validate.errors));
  }
}