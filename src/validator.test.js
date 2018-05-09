const fs = require("fs");
const runValidation = require("./validator");

test(" -> Empty Schema (empty object)", () => {
  return runValidation({}, {}).then( (data) => {
    expect(data).toBeDefined();
    expect(data[0]).toBeUndefined();
  });
});

test(" -> Attributes Schema (attributes object)", () => {
  let inputSchema = fs.readFileSync("examples/schemas/attributes-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/attributes.json"); 
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data[0]).toBeUndefined();
  });
});

test("BioSamples Schema - FAANG \'organism\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/biosamples-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-organism-sample.json");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data[0]).toBeUndefined();
  });
});

test("FAANG Schema - FAANG \'organism\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-organism-sample.json");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data[0]).toBeUndefined();
  });
});

test("FAANG Schema - \'specimen\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-specimen-sample.json");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data[0]).toBeUndefined();
  });
});

test("FAANG Schema - \'pool of specimens\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-poolOfSpecimens-sample.json");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data[0]).toBeUndefined();
  });
});

test("FAANG Schema - \'cell specimen\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-cellSpecimen-sample.json");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data[0]).toBeUndefined();
  });
});

test("FAANG Schema - \'cell culture\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-cellCulture-sample.json");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data[0]).toBeUndefined();
  });
});

test("FAANG Schema - \'cell line\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-cellLine-sample.json");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data[0]).toBeUndefined();
  });
});
