const fs = require("fs");
const BioValidator = require("../src/core/biovalidator-core")
const biovalidator = new BioValidator();

test("Empty Schema (empty object)", () => {
  return biovalidator.validate({}, {}).then( (data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  });
});

test("Attributes Schema", () => {
  let inputSchema = fs.readFileSync("examples/schemas/attributes-schema.json", "utf-8");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/attributes.json", "utf-8");
  let jsonObj = JSON.parse(inputObj);

  return biovalidator.validate(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(1);
    expect(data[0].errors.length).toBe(1);
    expect(data[0].errors).toContain('must match format "uri"');
  });
});

test("BioSamples Schema - FAANG \'organism\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/biosamples-schema.json", "utf-8");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-organism-sample.json", "utf-8");
  let jsonObj = JSON.parse(inputObj);

  return biovalidator.validate(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  });
});

test("Study Schema", () => {
  let inputSchema = fs.readFileSync("examples/schemas/submittables/study-schema.json", "utf-8");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/study.json", "utf-8");
  let jsonObj = JSON.parse(inputObj);

  return biovalidator.validate(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(2);
  });
});
