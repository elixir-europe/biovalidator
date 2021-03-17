const fs = require("fs");
const BioValidator = require('../src/bio-validator');
const IsValidTaxonomy = require('../src/keywords/isvalidtaxonomy');

test("valid taxonomy expression should pass the validation", () => {
  let inputSchema = fs.readFileSync("examples/schemas/isValidTaxonomy-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/isValidTaxonomy.json");
  let jsonObj = JSON.parse(inputObj);

  const schemaValidator = new BioValidator(
      [new IsValidTaxonomy(null)]
  );

  return schemaValidator.validate(jsonSchema, jsonObj).then( (data) => {
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

  const schemaValidator = new BioValidator(
    [new IsValidTaxonomy(null)]
  )
  
  return schemaValidator.validate(jsonSchema, jsonObj).then( (data) => {
    console.log(data);
    expect(data).toBeDefined();
    expect(data.length).toBe(1);
    expect(data[0].message).toContain('provided taxonomy expression does not exist: [not valid taxonomy]');
  });
});
