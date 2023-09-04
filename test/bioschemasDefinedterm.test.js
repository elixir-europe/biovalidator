const fs = require("fs");
const BioValidator = require('../src/core/biovalidator-core');

test(" -> BioSchemas DefinedTerm", () => {
    let schema = JSON.parse(
        fs.readFileSync("test/resources/bioschemas/schema.json").toString());
    let data = JSON.parse(
        fs.readFileSync("test/resources/bioschemas/data.json").toString());
    let referencedSchemaPath = "test/resources/bioschemas/schema_bioschemas_definedterm.json";

    const validator = new BioValidator(referencedSchemaPath);
    return validator._validate(schema, data).then((result) => {
        expect(result).toBeDefined()
        expect(result.length).toBe(0);
    });
});

test(" -> BioSchemas DefinedTerm invalid", () => {
    let schema = JSON.parse(
        fs.readFileSync("test/resources/bioschemas/schema.json").toString());
    let data = JSON.parse(
        fs.readFileSync("test/resources/bioschemas/data_invalid.json").toString());
    let referencedSchemaPath = "test/resources/bioschemas/schema_bioschemas_definedterm.json";

    const validator = new BioValidator(referencedSchemaPath);
    return validator._validate(schema, data).then((result) => {
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        // expect(result[0].message).toContain('Provided term is not child of');
        expect(result[0].message).toContain('should have required property');
    });
});

