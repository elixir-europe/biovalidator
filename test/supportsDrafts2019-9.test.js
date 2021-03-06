const fs = require("fs");
const BioValidator = require('../src/biovalidator');

test("draft2019-9Recursive", () => {
  let inputSchema = fs.readFileSync("examples/schemas/draft2019-9-support-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/draft2019-9-support.json");
  let jsonObj = JSON.parse(inputObj);



  const validator = new BioValidator();

  return validator.validate(jsonSchema, jsonObj).then((data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  });
});
