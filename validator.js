var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});
//const fs = require('fs');

function runValidation(inputSchema, submittable) {
  var validate = ajv.compile(inputSchema);
  var valid = validate(submittable);
  if (valid) {
    return { result: 'Valid!'};
  } else {
    return { result: 'Invalid: ' + ajv.errorsText(validate.errors)};
  }
}

module.exports = {runValidation};

/*
// Example test
//  - Schema load
var inputSchema = fs.readFileSync('schemas/faang-schema.json');
var jsonSchema = JSON.parse(inputSchema);
var validator = ajv.compile(jsonSchema);

var inputAnimal = fs.readFileSync('objects/faang-animal-sample.json');
var jsonAnimal = JSON.parse(inputAnimal);
validate(jsonAnimal);

var inputCellSpecimen = fs.readFileSync('objects/faang-cellSpecimen-sample.json');
var jsonCellSpecimen = JSON.parse(inputCellSpecimen);
validate(jsonCellSpecimen);

var schema = JSON.parse(fs.readFileSync('schemas/example-schema.json'));
var validate = ajv.compile(schema);

var inputExample = JSON.parse(fs.readFileSync('objects/example.json'));
test(inputExample);
*/