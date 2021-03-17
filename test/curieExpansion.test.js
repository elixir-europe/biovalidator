const CurieExpansion = require("../src/utils/curie_expansion");

test("Curie expansion with no errors", () => {
    const curieExpansion = new CurieExpansion("https://www.ebi.ac.uk/ols/api/search?q=");
    const curie = "EFO:0000399";

    const isCurie = CurieExpansion.isCurie(curie);

    expect(isCurie).toBe(true);

    return curieExpansion.expandCurie(curie).then( (uri) => {
        expect(uri).toBe("http://www.ebi.ac.uk/efo/EFO_0000399");
    });
});
