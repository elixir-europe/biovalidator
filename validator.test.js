const expect = require('expect');
const fs = require('fs');

const runValidation = require('./validator');

it('Empty schema, it should pass', () => {
  let res = runValidation({}, {});
  
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});

it('FAANG Schema, empty object it should fail', () => {
  var inputSchema = fs.readFileSync('examples/schemas/faang-schema.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  let res = runValidation(jsonSchema, {});
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toNotBe('Valid!');
});

it('FAANG Schema, animal sample it should pass', () => {
  var inputSchema = fs.readFileSync('examples/schemas/faang-schema.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  var inputObj = fs.readFileSync('examples/objects/faang-animal-sample.json');
  var jsonObj = JSON.parse(inputObj);
  
  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});