const fs = require("fs");
const BioValidator = require('../src/biovalidator');
const GraphRestriction = require('../src/keywords/graph_restriction');


test(" -> graphRestriction 1 Schema", () => {
    let inputSchema = fs.readFileSync("examples/schemas/graphRestriction-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/graphRestriction_pass.json");
    let jsonObj = JSON.parse(inputObj);

    const validator = new BioValidator();

    return validator.validate(jsonSchema, jsonObj).then((data) => {
        expect(data).toBeDefined();
    });

});

test(" -> graphRestriction 2 Schema", () => {
    let inputSchema = fs.readFileSync("examples/schemas/graphRestriction-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/graphRestriction_normal.json");
    let jsonObj = JSON.parse(inputObj);


    const validator = new BioValidator();

    return validator.validate(jsonSchema, jsonObj).then((data) => {
        expect(data).toBeDefined();
    });
});

test(" -> graphRestriction 3 Schema", () => {
    let inputSchema = fs.readFileSync("examples/schemas/graphRestriction-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/graphRestriction_fail.json");
    let jsonObj = JSON.parse(inputObj);


    const validator = new BioValidator();

    return validator.validate(jsonSchema, jsonObj).then((data) => {
        expect(data).toBeDefined();
        expect(data.length).toBe(1);
        expect(data[0].message).toContain('Provided term is not child of');

    });
});
