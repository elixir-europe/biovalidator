const fs = require("fs");
const runValidation = require("../src/validator");

test(" -> Empty Schema (empty object)", () => {
  return runValidation({}, {}).then( (data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  });
});

test(" -> Attributes Schema (attributes object)", () => {
  let inputSchema = fs.readFileSync("examples/schemas/attributes-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/attributes.json"); 
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  });
});

test("BioSamples Schema - FAANG \'organism\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/biosamples-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-organism-sample.json");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  });
});

test("Test error output", () => {
  let inputSchema = fs.readFileSync("test/schemas/test-output-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("test/objects/test-attributes.json");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(1);
    expect(data[0].errors.length).toBe(2);
  });
});