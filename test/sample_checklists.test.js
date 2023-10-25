const fs = require("fs");
const BioValidator = require("../src/core/biovalidator-core")
const biovalidator = new BioValidator();
const checklistFolder = "test/resources/ena_samples/checklists/";
const validObjectFolder = "test/resources/ena_samples/objects/valid/";
const invalidObjectFolder = "test/resources/ena_samples/objects/invalid/";
const samplePrefix = "SAMEA_";

describe("Sample Checklist tests", () => {
  it('Sample Checklist tests for valid objects', ()=> {
    fs.readdir(checklistFolder, (err, files) => {
      files.forEach(file => {
        let inputSchema = fs.readFileSync(checklistFolder + file);
        let jsonSchema = JSON.parse(inputSchema);

        let inputObj = fs.readFileSync(validObjectFolder + samplePrefix + file);
        let jsonObj = JSON.parse(inputObj);

        biovalidator.validate(jsonSchema, jsonObj).then( (data) => {
          expect(data).toBeDefined();
          expect(data.length).toBe(0);
        });
      });
    })
  });

  it('Sample Checklist tests with invalid objects', ()=> {
    var missingPropertyMap = new Map([
      ["ERC000012.json", "project name"],
      ["ERC000013.json", "project name"],
      ["ERC000014.json", "project name"],
      ["ERC000015.json", "project name"],
      ["ERC000016.json", "project name"],
      ["ERC000017.json", "project name"],
      ["ERC000018.json", "project name"],
      ["ERC000019.json", "project name"],
      ["ERC000020.json", "project name"],
      ["ERC000021.json", "project name"],
      ["ERC000022.json", "project name"],
      ["ERC000023.json", "project name"],
      ["ERC000024.json", "project name"],
      ["ERC000025.json", "project name"],
      ["ERC000027.json", "project name"],
      ["ERC000028.json", "isolation_source"],
      ["ERC000029.json", "collected_by"],
      ["ERC000030.json", "Event Date/Time Start"],
      ["ERC000031.json", "absolute air humidity"],
      ["ERC000032.json", "geographic location (country and/or sea)"],
      ["ERC000033.json", "geographic location (country and/or sea)"],
      ["ERC000034.json", "tissue_type"],
      ["ERC000035.json", null],
      ["ERC000036.json", "investigation type"],
      ["ERC000037.json", "collection date"],
      ["ERC000038.json", "Sampling Station"],
      ["ERC000039.json", "dev_stage"],
      ["ERC000040.json", "target gene"],
      ["ERC000041.json", "isolate"],
      ["ERC000043.json", "strain"],
      ["ERC000044.json", "host scientific name"],
      ["ERC000045.json", "collection_date"],
      ["ERC000047.json", "sequencing method"],
      ["ERC000048.json", "assembly software"],
      ["ERC000049.json", "viral identification software"],
      ["ERC000050.json", "sample derived from"],
      ["ERC000051.json", "sample origin"],
    ]);

    fs.readdir(checklistFolder, (err, files) => {
      files.forEach(file => {
        if (file === "ERC000011.json") return;
        let inputSchema = fs.readFileSync(checklistFolder + file);
        let jsonSchema = JSON.parse(inputSchema);

        let inputObj = fs.readFileSync(invalidObjectFolder + samplePrefix + file);
        let jsonObj = JSON.parse(inputObj);

        biovalidator.validate(jsonSchema, jsonObj).then( (data) => {
          expect(data).toBeDefined();
          if (missingPropertyMap.get(file) != null) {
            expect(data.length).toBe(1);
            expect(data[0].errors.length).toBe(1);
            expect(data[0].errors).toContain('must have required property \'' + missingPropertyMap.get(file) + '\'');
          } else {
            expect(data.length).toBe(0);
          }
        });
      });
    })
  });
});
