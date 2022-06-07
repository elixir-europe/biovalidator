const fs = require("fs");
const BioValidator = require('../src/biovalidator');

test("Empty Schema (empty object)", () => {
    const validator = new BioValidator();
    return validator.validate({}, {}).then( (data) => {
        expect(data).toBeDefined();
        expect(data.length).toBe(0);
    });
});

test("Attributes Schema", () => {
    let inputSchema = fs.readFileSync("examples/schemas/attributes-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/attributes.json");
    let jsonObj = JSON.parse(inputObj);

    const validator = new BioValidator();

    return validator.validate(jsonSchema, jsonObj).then((data) => {
        expect(data).toBeDefined();
        expect(data.length).toBe(1);
        expect(data[0].message).toContain('should match format "uri"');
    });
});


test("BioSamples Schema - FAANG \'organism\' sample", () => {
    let inputSchema = fs.readFileSync("examples/schemas/biosamples-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/faang-organism-sample.json");
    let jsonObj = JSON.parse(inputObj);

    const validator = new BioValidator();

    return validator.validate(jsonSchema, jsonObj).then((data) => {
        expect(data).toBeDefined();
        expect(data.length).toBe(0);
    });
});

test("Study Schema", () => {
    let inputSchema = fs.readFileSync("examples/schemas/submittables/study-schema.json");
    let jsonSchema = JSON.parse(inputSchema);

    let inputObj = fs.readFileSync("examples/objects/study.json");
    let jsonObj = JSON.parse(inputObj);
    const validator = new BioValidator();

    return validator.validate(jsonSchema, jsonObj).then((data) => {
        expect(data).toBeDefined();
        expect(data.length).toBe(2);
    });
});
