# ELIXIR biovalidator - Extended JSON Schema validator with ontology validation
[![Build Status](https://travis-ci.org/EMBL-EBI-SUBS/json-schema-validator.svg?branch=master)](https://travis-ci.org/EMBL-EBI-SUBS/json-schema-validator) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/7fbabc981e294249a9a0967965418058)](https://www.codacy.com/app/fpenim/json-schema-validator?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=EMBL-EBI-SUBS/json-schema-validator&amp;utm_campaign=Badge_Grade)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

ELIXIR biovalidator is a [JSON Schema](http://json-schema.org/) validator extended from popular javascript library [AJV](https://ajv.js.org/). 
In addition to standard JSON Schema validation, the biovalidator covers many validation use cases related life sciences, including ontology validation and taxonomy validation. 
Furthermore, the biovalidator is capable of running as a server or in CLI mode. 

The biovalidator currently supports JSON Schema draft-06/07/2019-09.

## Major Changes in new version
- `graph_restriction` renamed to `graphRestriction` to be consistent with other keywords
- Merged `validator-cli.js` with `src/server.js`. Now one entry point to the application: `src/biovalidator.js`
- Changes to arguments accepted at the startup
  - `--json` renamed to `--data`
  - Added `--ref`, `--port`, `--baseUrl`, `pidPath` 

## Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Using biovalidator as a server](#using-biovalidator-as-a-server)
- [Using biovalidator as a CLI command](#using-biovalidator-as-a-cli-command)
- [Startup arguments](#startup-arguments)
- [Extended keywords for ontology and taxonomy validation](#extended-keywords-for-ontology-and-taxonomy-validation)
  - [graphRestriction](#graphrestriction)
  - [isChildTermOf](#ischildtermof)
  - [isValidTerm](#isvalidterm)
  - [isValidTaxonomy](#isvalidtaxonomy)
- [Running in Docker](#running-in-docker)
- [License](#license)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/about/) - v10.19.1.0+
- [npm](https://www.npmjs.com/) 
You can also run the [biovalidator using docker](#running-in-docker) without installing node or npm. 

### Installation

- Install Node.js: https://nodejs.org/en/ (v10.19.1.0+)
- Check node and npm version
```shell
node -v
npm -v
```
- Clone project and install dependencies:
```
git clone https://github.com/elixir-europe/biovalidator.git
cd biovalidator
npm install
```
- Run test cases to see everything is in order
```
npm test
```

## Using biovalidator as a server

By default, biovalidator will start as a server. Read [startup arguments](#startup-arguments) section for more server options. 
```
node src/biovalidator
```

Once the server is up and running it can be accessed in your browser at [http://localhost:3020/](http://localhost:3020/). 
The biovalidator also exposes an endpoint for validation: [http://localhost:3020/validate](http://localhost:3020/validate). 
The `/validate` POST endpoint accepts JSON as data and has the following structure.
```json
{
  "schema": {},
  "data": {}
}
```
- schema: JSON Schema to validate the data
- data: data to be validated using given JSON Schema

Make sure to add content-type header if there are any problems using the API.
```
Content-Type: application/json
```

**Example:** Sending a POST request with the following body:
```json
{
  "schema": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "alias": {
        "description": "A sample unique identifier in a submission.",
        "type": "string"
      },
      "taxonId": {
        "description": "The taxonomy id for the sample species.",
        "type": "integer"
      },
      "taxon": {
        "description": "The taxonomy name for the sample species.",
        "type": "string"
      },
      "releaseDate": {
        "description": "Date from which this sample is released publicly.",
        "type": "string",
        "format": "date"
      }
    },  
    "required": ["alias", "taxonId" ]
  },
  "object": {
    "alias": "MA456",
    "taxonId": 9606
  }
}
```
will produce a response like:

HTTP status code `200`
```json
[]
```
An example of a validation response with errors:

HTTP status code `200`
```json
[
  {
    "errors": [
        "should have required property 'value'"
    ],
    "dataPath": ".attributes['age'][0].value"
  },
  {
    "errors": [
        "should NOT be shorter than 1 characters",
        "should match format \"uri\""
    ],
    "dataPath": ".attributes['breed'][0].terms[0].url"
  }
]
```
Where *errors* is an array of error messages for a given input identified by its path on *dataPath*. 
There may be one or more error objects within the response array. An empty array represents a valid validation result.

## Using biovalidator as a CLI command
The biovalidator can also be run as a CLI application. If you provide `--schema` and `--data` as parameters to the application, it will execute in CLI mode. 
To see all the available options, run `node ./src/biovalidator --help`
```
$ node ./src/biovalidator --help

ELIXIR biovalidator: JSON Schema validator with ontology extension
usage: node ./src/biovalidator.js [--schema=path/to/schema.json]
[--data=path/to/data.json] [--ref=path/to/ref/dir]

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
      --baseUrl  base URL for the server. Only valid in server mode.
      --pidPath  PID file name and path. Only valid in server mode.
      --logDir   path to the log directory.
  -s, --schema   path to the schema file.
  -d, --data     path to the data file.
  -r, --ref      path to referenced schema directory/file/glob pattern.
  -p, --port     exposed port in server mode. Only valid in server mode.

Examples:
  node ./src/biovalidator.js                Runs in CLI mode to validate
  --data=test_data.json                     'test_data.json' with
  --schema=test_schema.json                 'test_schema.json'
```

## Startup arguments
- `--ref`:
If you have a set of local schemas that will be used as `$ref` in your validating schema, these can be passed to biovalidator using `--ref` argument.
The `--ref` argument can be used in both server and CLI mode. `--ref` accepts file path, directory and glob patterns as values. 
When parsing glob patterns, it is better to wrap with `'` to avoid parsing them by command line. 
```
node src/biovalidator --ref=/path/to/reference/schema/dir/*.json
node src/biovalidator --ref '/path/to/reference/schema/dir/*.json'
```

- `--port`:
By default server will run on port 3020. To change the exposed port `--port` can be provided as an argument. Only works in server mode. 
```
node src/biovalidator --port=8080
```

- `--baseUrl`:
Base URL can be provided as an argument to change the URL of the server. Only works in server mode.
```
node src/biovalidator --baseUrl=/schema  # will serve the content under http://localhost:3020/schema
```

- `--pidPath`:
  Path to the PID file. Application will run the PID to the given file. The default is `./server.pid`. Only works in server mode.
  Also note that, this is the path to the file and not the directory it will be written to.
```
node src/biovalidator --pidPath=/pid/file/path/server.pid
```

- `--logPath`:
Can be provided to specify the directory of the log files. Log files will be rotated every 24 hours. Only works in server mode.
```
node src/biovalidator --logPath=/log/directory/path
```

## Extended keywords for ontology and taxonomy validation
The biovalidator supports four extended keywords for ontology and taxonomy validation: `graphRestriction`, `isChildTermOf`, `isValidTerm` and `isValidTaxonomy`.

### graphRestriction
This custom keyword *evaluates if an ontology term is child of another*. This keyword is applied to a string (CURIE) and **passes validation if the term is a child of the term defined in the schema**.
The keyword requires one or more **parent terms** *(classes)* and **ontology ids** *(ontologies)*, both of which should exist in [OLS - Ontology Lookup Service](https://www.ebi.ac.uk/ols).

This keyword works by doing an asynchronous call to the [OLS API](https://www.ebi.ac.uk/ols/api/) that will respond with the required information to know if a given term is child of another.
Being an async validation step, whenever used in a schema, the schema must have the flag: `"$async": true` in its object root.

Schema:
```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://schema.dev.data.humancellatlas.org/module/ontology/5.3.0/organ_ontology",
    "$async": true,
    "properties": {
        "ontology": {
            "description": "A term from the ontology [UBERON](https://www.ebi.ac.uk/ols/ontologies/uberon) for an organ or a cellular bodily fluid such as blood or lymph.",
            "type": "string",
            "graphRestriction":  {
                "ontologies" : ["obo:hcao", "obo:uberon"],
                "classes": ["UBERON:0000062","UBERON:0000179"],
                "relations": ["rdfs:subClassOf"],
                "direct": false,
                "include_self": false
            }
        }
    }
}
```
Data:
```json
{
    "ontology": "UBERON:0000955"
}
```

### isChildTermOf
This custom keyword also *evaluates if an ontology term is child of another* and is a simplified version of the graphRestriction keyword. This keyword is applied to a string (url) and **passes validation if the term is a child of the term defined in the schema**.
The keyword requires the **parent term** and the **ontology id**, both of which should exist in [OLS - Ontology Lookup Service](https://www.ebi.ac.uk/ols).

This keyword works by doing an asynchronous call to the [OLS API](https://www.ebi.ac.uk/ols/api/) that will respond with the required information to know if a given term is child of another.
Being an async validation step, whenever used in a schema, the schema must have the flag: `"$async": true` in its object root.

Schema:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$async": true,
  "properties": {
    "term": {
      "type": "string",
      "format": "uri",
      "isChildTermOf": {
        "parentTerm": "http://purl.obolibrary.org/obo/PATO_0000047",
        "ontologyId": "pato"
      }
    }
  }
}
```
Data:
```json
{
  "term": "http://purl.obolibrary.org/obo/PATO_0000383"
}
```

### isValidTerm
This custom keyword *evaluates if a given ontology term url exists in OLS* ([Ontology Lookup Service](https://www.ebi.ac.uk/ols)). It is applied to a string (url) and **passes validation if the term exists in OLS**. It can be applied to any string defined in the schema.

This keyword works by doing an asynchronous call to the [OLS API](https://www.ebi.ac.uk/ols/api/) that will respond with the required information to determine if the term exists in OLS or not.
Being an async validation step, whenever used in a schema, the schema must have the flag: `"$async": true` in its object root.

Schema:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$async": true,
  "properties": {
    "url": {
      "type": "string",
      "format": "uri",
      "isValidTerm": true
    }
  }
}
```
Data:
```json
{
  "url": "http://purl.obolibrary.org/obo/PATO_0000383"
}
```

### isValidTaxonomy
This custom keyword evaluates if a given *taxonomy* exists in ENA's Taxonomy Browser. It is applied to a string (url) and **passes validation if the taxonomy exists in ENA**. It can be applied to any string defined in the schema.

This keyword works by doing an asynchronous call to the [ENA API](https://www.ebi.ac.uk/ena/taxonomy/rest/any-name/<REPLACE_ME_WITH_AXONOMY_TERM>) that will respond with the required information to determine if the term exists or not.
Being an async validation step, whenever used in a schema, the schema must have the flag: `"$async": true` in its object root.

Schema:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Is valid taxonomy expression.",
  "$async": true,
  "properties": {
    "value": { 
      "type": "string", 
      "minLength": 1, 
      "isValidTaxonomy": true
    }
  }
}
```
Data:
```json
{
  "metagenomic source" : [ {
    "value" : "wastewater metagenome"
  } ]
}
```

## Running in Docker
A Dockerized version of biovalidator is available on [quay.io](https://quay.io/repository/ebi-ait/biovalidator). 
This image can be used to run the validator without cloning this repository. 

Pull docker image from [quay.io](https://quay.io/repository/ebi-ait/biovalidator)
```shell
docker pull quay.io/ebi-ait/biovalidator:2.0.0
```
Run in server mode
```shell
docker run -p 3020:3020 -d quay.io/ebi-ait/biovalidator:2.0.0
```
Run in onetime CLI mode
```shell
docker run quay.io/ebi-ait/biovalidator:2.0.0 --schema /path/to/schema.json --data /path/to/data.json
```

## Development
For development purposes using [nodemon](https://nodemon.io/) is useful. It reloads the application every time something has changed on save time.
```
nodemon src/biovalidator
```

## License
 For more details about licensing see the [LICENSE](LICENSE.md).
