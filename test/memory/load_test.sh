#!/bin/bash

function validate() {
    request_data=`jq -s '{schema: .[0], data: .[1]'} $1 $2`
    curl -H "Content-Type: application/json" -X POST http://localhost:3020/validate -d "$request_data"
}

function createTestRequestJsonFile() {
  request_data=`jq -s '{schema: .[0], data: .[1]'} $1 $2`
  echo $request_data > test.json
}

function loadTest() {
  ab -p test.json -T application/json -c 10 -n 1000 https://www.ebi.ac.uk/ait/biovalidator/validate
}

dataPath=../../examples/objects/test-schema-valid.json
schemaPath=../../examples/schemas/test-schema.json
createTestRequestJsonFile $schemaPath $dataPath
loadTest

dataPath=../../examples/objects/graphRestriction_pass.json
schemaPath=../../examples/schemas/graphRestriction-schema.json
createTestRequestJsonFile $schemaPath $dataPath
loadTest

dataPath=../../examples/objects/isValidIdentifier-single-prefix_pass.json
schemaPath=../../examples/schemas/isValidIdentifier-single-prefix-schema.json
createTestRequestJsonFile $schemaPath $dataPath
loadTest

dataPath=../../examples/objects/isValidTaxonomy.json
schemaPath=../../examples/schemas/isValidTaxonomy-schema.json
createTestRequestJsonFile $schemaPath $dataPath
loadTest
