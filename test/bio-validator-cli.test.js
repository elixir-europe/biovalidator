const BioValidatorCLI = require("../src/biovalidator-cli")

test("Using wrong parameters results with error", () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    const schema = "schema/not_exists.json";
    const json = "json/not_exists.json";
    const cli = new BioValidatorCLI(schema, json);
    cli.validate();

    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
});

test( "Invalid JSON should result with validation error", () => {
    const schema = "test/resources/cli/test_schema.json";
    const json = "test/resources/cli/invalid.json";
    const cli = new BioValidatorCLI(schema, json);
    const jsonErrors = [
        {
            "dataPath": ".alias",
            "errors": [
                "should have required property 'alias'"
            ]
        },
        {
            "dataPath": ".taxonId",
            "errors": [
                "should have required property 'taxonId'"
            ]
        }
    ]

    const expectedErrorOutput = ".alias\n" +
        "\tshould have required property 'alias'\n" +
        ".taxonId\n" +
        "\tshould have required property 'taxonId'\n";

    let errorOutput = cli.error_report(jsonErrors);

    expect(errorOutput).toBeDefined();
    expect(errorOutput).toEqual(expectedErrorOutput)

});

test("Should be able to reference schemas from a directory", () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    const schema = "test/resources/ref_test_schema.json";
    const data = "test/resources/ref_test_valid.json";
    const ref = "test/resources/schema_dir/*";
    const cli = new BioValidatorCLI(schema, data, ref);
    cli.validate();


});
