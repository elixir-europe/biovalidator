const expect = require('expect');
const fs = require('fs');

const runValidation = require('./validator');

it('Empty Schema, empty object', () => {
  let res = runValidation({}, {});
  
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});

it('Attributes Schema, attributes object', () => {
  var inputSchema = fs.readFileSync('examples/schemas/attributes-schema.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  var inputObj = fs.readFileSync('examples/objects/attributes.json');
  var jsonObj = JSON.parse(inputObj);
  
  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});

it('BioSamples Schema, FAANG \'organism\' sample', () => {
  var inputSchema = fs.readFileSync('examples/schemas/biosamples-schema.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  var inputObj = fs.readFileSync('examples/objects/faang-organism-sample.json');
  var jsonObj = JSON.parse(inputObj);
  
  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});

it('FAANG Schema v2, FAANG \'organism\' sample', () => {
  var inputSchema = fs.readFileSync('examples/schemas/faang-schema-2.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  var inputObj = fs.readFileSync('examples/objects/faang-organism-sample.json');
  var jsonObj = JSON.parse(inputObj);
  
  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});

it('FAANG Schema v2, FAANG \'specimen\' sample', () => {
  var inputSchema = fs.readFileSync('examples/schemas/faang-schema-2.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  var inputObj = fs.readFileSync('examples/objects/faang-specimen-sample.json');
  var jsonObj = JSON.parse(inputObj);
  
  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});

it('FAANG Schema v2, \'pool of specimens\' sample', () => {
  var inputSchema = fs.readFileSync('examples/schemas/faang-schema-2.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  var inputObj = fs.readFileSync('examples/objects/faang-poolOfSpecimens-sample.json');
  var jsonObj = JSON.parse(inputObj);
  
  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});

it('FAANG Schema v2, \'cell specimen\' sample', () => {
  var inputSchema = fs.readFileSync('examples/schemas/faang-schema-2.json');
  var jsonSchema = JSON.parse(inputSchema);
  
  var inputObj = fs.readFileSync('examples/objects/faang-cellSpecimen-sample.json');
  var jsonObj = JSON.parse(inputObj);
  
  let res = runValidation(jsonSchema, jsonObj);
  expect(res).toBeA('object');
  expect(res.result).toBeA('string').toBe('Valid!');
});