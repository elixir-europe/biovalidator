const fs = require("fs");
const BioValidator = require('../src/core/biovalidator-core');

test(" -> IsValidIdentifier prefixes schema", () => {
    let inputSchema = JSON.parse(fs.readFileSync("examples/schemas/isValidIdentifier-schema.json"));
    let inputData = JSON.parse(fs.readFileSync("examples/objects/isValidIdentifier_pass.json"));

    return new BioValidator()._validate(inputSchema, inputData).then((data) => {
        expect(data).toBeDefined();
    });
});

test(" -> IsValidIdentifier single prefix", () => {
    let inputSchema = JSON.parse(fs.readFileSync("examples/schemas/isValidIdentifier-single-prefix-schema.json"));
    let inputData = JSON.parse(fs.readFileSync("examples/objects/isValidIdentifier-single-prefix_pass.json"));

    return new BioValidator()._validate(inputSchema, inputData).then((data) => {
        expect(data).toBeDefined();
    });
});

test(" -> IsValidIdentifier 2 Schema", () => {
    let inputSchema = JSON.parse(fs.readFileSync("examples/schemas/isValidIdentifier-schema.json"));
    let inputData = JSON.parse(fs.readFileSync("examples/objects/isValidIdentifier_fail.json"));

    return new BioValidator()._validate(inputSchema, inputData).then((data) => {
        expect(data).toBeDefined();
        expect(data.length).toBe(1);
        expect(data[0].message).toContain('Failed to resolve term from identifiers.org');
    });
});

test(" -> IsValidIdentifier 3 Schema", () => {
    let inputSchema = JSON.parse(fs.readFileSync("examples/schemas/isValidIdentifier-schema.json"));
    let inputData = JSON.parse(fs.readFileSync("examples/objects/isValidIdentifier_fail_namespace.json"));

    return new BioValidator()._validate(inputSchema, inputData).then((data) => {
        expect(data).toBeDefined();
        expect(data.length).toBe(1);
        expect(data[0].message).toContain('is not a valid namespace for the identifier');

    });
});
