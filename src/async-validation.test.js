const expect = require('expect');
const fs = require('fs');

const runValidation = require('./validator');

it(' -> isChildTermOf Schema', function() {
  var inputSchema = fs.readFileSync('examples/schemas/ischildterm-schema.json');
  var jsonSchema = JSON.parse(inputSchema);

  var inputObj = fs.readFileSync('examples/objects/isChildTerm.json');
  var jsonObj = JSON.parse(inputObj);

  runValidation(jsonSchema, jsonObj).then((output) => {
    expect(output).toBeA('object');
    expect(output.result).toBeA('string').toBe('Valid!');
    //console.log("result: " + output.result);
  });
});
