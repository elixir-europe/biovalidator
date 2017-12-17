const expect = require('expect');
const fs = require('fs');

const runValidation = require('./validator');

it('Empty Schema, it should pass', () => {
  let res = runValidation({}, {});
  
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});

it('Attributes Schema, attributes it should pass', () => {
  var inputSchema = fs.readFileSync('examples/schemas/attributes-schema.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  var inputObj = fs.readFileSync('examples/objects/attributes.json');
  var jsonObj = JSON.parse(inputObj);
  
  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});

it('BioSamples Schema, biosamples sample it should pass', () => {
  var inputSchema = fs.readFileSync('examples/schemas/biosamples-schema.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  var inputObj = fs.readFileSync('examples/objects/faang-organism-sample.json');
  var jsonObj = JSON.parse(inputObj);
  
  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});

it('BioSamples Schema, cell specimen sample it should pass', () => {
  var inputSchema = fs.readFileSync('examples/schemas/biosamples-schema.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  var inputObj = fs.readFileSync('examples/objects/faang-cellSpecimen-sample.json');
  var jsonObj = JSON.parse(inputObj);
  
  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});

it('FAANG Schema v2, animal sample', () => {
  var inputSchema = fs.readFileSync('examples/schemas/faang-schema-2.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  var inputObj = fs.readFileSync('examples/objects/faang-organism-sample.json');
  var jsonObj = JSON.parse(inputObj);
  
  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});
/*
it('FAANG Schema, animal sample it should pass', () => {
  var inputSchema = fs.readFileSync('examples/schemas/faang-schema.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  var inputObj = fs.readFileSync('examples/objects/faang-organism-sample.json');
  var jsonObj = JSON.parse(inputObj);
  
  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});

it('FAANG Schema, cell specimen sample it should pass', () => {
  var inputSchema = fs.readFileSync('examples/schemas/faang-schema.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  var inputObj = fs.readFileSync('examples/objects/faang-cellSpecimen-sample.json');
  var jsonObj = JSON.parse(inputObj);
  
  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});
*/
it('FAANG Schema, pool of specimens sample it should pass', () => {
  var inputSchema = fs.readFileSync('examples/schemas/faang-schema.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  var inputObj = fs.readFileSync('examples/objects/faang-poolOfSpecimens-sample.json');
  var jsonObj = JSON.parse(inputObj);
  
  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});