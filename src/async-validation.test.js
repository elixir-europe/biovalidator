const expect = require('expect');
const fs = require('fs');

const runValidation = require('./validator');

it(' -> isChildTermOf Schema', function() {
  var inputSchema = fs.readFileSync('examples/schemas/ischildterm-schema.json');
  var jsonSchema = JSON.parse(inputSchema);

  var inputObj = fs.readFileSync('examples/objects/isChildTerm.json');
  var jsonObj = JSON.parse(inputObj);

  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});
