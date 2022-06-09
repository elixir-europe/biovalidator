const fs = require("fs");
const BioValidator = require('../src/core/biovalidator-core');
const IsChildTermOf = require('../src/keywords/ischildtermof');

test("isChildTermOf", () => {
  let inputSchema = fs.readFileSync("examples/schemas/isChildTerm-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/isChildTerm.json");
  let jsonObj = JSON.parse(inputObj);



  const validator = new BioValidator();

  return validator._validate(jsonSchema, jsonObj).then((data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(1);
    expect(data[0].message).toContain('Provided term is not child of');
  });
});
