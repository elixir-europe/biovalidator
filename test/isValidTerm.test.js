const fs = require("fs");
const BioValidator = require('../src/bio-validator');
const IsValidTerm = require('../src/keywords/isvalidterm');

test("isValidTerm", () => {
  const inputSchema = fs.readFileSync("examples/schemas/isValidTerm-schema.json");
  const jsonSchema = JSON.parse(inputSchema);

  const inputObj = fs.readFileSync("examples/objects/isValidTerm.json");
  const jsonObj = JSON.parse(inputObj);

  const validator = new BioValidator([new IsValidTerm(null, 'https://www.ebi.ac.uk/ols/api/search?q=')]);

  return validator.validate(jsonSchema, jsonObj).then((data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(1);
    expect(data[0].message).toContain('provided term does not exist in OLS');
  });

});
