const fs = require("fs");
const BioValidator = require('../src/core/biovalidator-core');

test(" -> graphRestriction async", () => {
    let schema = JSON.parse(
        fs.readFileSync("test/resources/ega/graph_restrictions_async/schema.json").toString());
    let data = JSON.parse(
        fs.readFileSync("test/resources/ega/graph_restrictions_async/data.json").toString());

    const validator = new BioValidator();
    return validator._validate(schema, data).then((result) => {
        expect(result).toBeDefined();
    });
});

test(" -> graphRestriction async invalid", () => {
    let schema = JSON.parse(
        fs.readFileSync("test/resources/ega/graph_restrictions_async/schema.json").toString());
    let data = JSON.parse(
        fs.readFileSync("test/resources/ega/graph_restrictions_async/data.json").toString());

    const validator = new BioValidator();
    return validator._validate(schema, data).then((result) => {
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        expect(result[0].message).toContain('Provided term is not child of');
    });
});

test(" -> graphRestriction async referenced", () => {
    let schema = JSON.parse(
        fs.readFileSync("test/resources/ega/graph_restrictions_async/ref/schema.json").toString());
    let data = JSON.parse(
        fs.readFileSync("test/resources/ega/graph_restrictions_async/ref/data.json").toString());
    let referencedSchemaPath = "test/resources/ega/graph_restrictions_async/schema.json";

    const validator = new BioValidator(referencedSchemaPath);
    return validator._validate(schema, data).then((result) => {
        expect(result).toBeDefined();
    });
});

test(" -> graphRestriction async referenced invalid", () => {
    let schema = JSON.parse(
        fs.readFileSync("test/resources/ega/graph_restrictions_async/ref/schema.json").toString());
    let data = JSON.parse(
        fs.readFileSync("test/resources/ega/graph_restrictions_async/ref/data_invalid.json").toString());
    let referencedSchemaPath = "test/resources/ega/graph_restrictions_async/schema.json";

    const validator = new BioValidator(referencedSchemaPath);
    return validator._validate(schema, data).then((result) => {
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        expect(result[0].message).toContain('Provided term is not child of');
    });
});

