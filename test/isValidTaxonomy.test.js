const fs = require("fs");
const runValidation = require("../src/validator");

test("valid taxonomy expression should pass the validation", () => {
  let inputSchema = fs.readFileSync("examples/schemas/isValidTaxonomy-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/isValidTaxonomy.json");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    console.log(data);
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  });
});

test("invalid taxonomy expresson should return an error", () => {
  let inputSchema = fs.readFileSync("examples/schemas/isValidTaxonomy-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/isInvalidTaxonomy.json");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    console.log(data);
    expect(data).toBeDefined();
    expect(data.length).toBe(1);
  });
});