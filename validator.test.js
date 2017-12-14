const expect = require('expect');
const fs = require('fs');

const {runValidation} = require('./validator');

it('Empty schema, it should validate', () => {
  let res = runValidation({}, {});
  
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});

it('FAANG Schema, it should fail', () => {
  var inputSchema = fs.readFileSync('examples/schemas/faang-schema.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  let res = runValidation(inputSchema, {});
  console.log(res.result);
  expect(res).toBeA('object');
});