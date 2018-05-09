const fs = require("fs");
const runValidation = require("./validator");

test(" -> isChildTermOf Schema", () => {
  let inputSchema = fs.readFileSync("examples/schemas/ischildterm-schema.json");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/isChildTerm.json");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data[0]).toBeUndefined();
  });
});
