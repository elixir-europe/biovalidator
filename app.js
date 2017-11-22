var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});
const fs = require('fs');

// Schema load
var inputSchema = fs.readFileSync('schemas/faang-schema.json');
var jsonSchema = JSON.parse(inputSchema);
var validate = ajv.compile(jsonSchema);

var inputAnimal = fs.readFileSync('objects/faang-animal-sample.json');
var jsonAnimal = JSON.parse(inputAnimal);
test(jsonAnimal);

var inputCellSpecimen = fs.readFileSync('objects/faang-cellSpecimen-sample.json');
var jsonCellSpecimen = JSON.parse(inputCellSpecimen);
test(jsonCellSpecimen);

/*
// Example test
var schema = JSON.parse(fs.readFileSync('schemas/example-schema.json'));
var validate = ajv.compile(schema);

var inputExample = JSON.parse(fs.readFileSync('objects/example.json'));
test(inputExample);
*/

function test(data) {
  var valid = validate(data);
  if (valid) {
    console.log('Valid!');
  } else {
    console.log('Invalid: ' + ajv.errorsText(validate.errors));
  }
}