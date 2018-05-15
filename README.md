# JSON Schema Validator
[![Build Status](https://travis-ci.org/EMBL-EBI-SUBS/json-schema-validator.svg?branch=master)](https://travis-ci.org/EMBL-EBI-SUBS/json-schema-validator) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/7fbabc981e294249a9a0967965418058)](https://www.codacy.com/app/fpenim/json-schema-validator?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=EMBL-EBI-SUBS/json-schema-validator&amp;utm_campaign=Badge_Grade)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

This repository contains a [JSON Schema](http://json-schema.org/) validator for the EMBL-EBI Submissions Project. This validator runs as a standalone node server that receives validation requests and gives back it's results.
The validation is done using the [AJV](https://github.com/epoberezkin/ajv) library version 6.0.0 that fully supports the JSON Schema **draft-07**.

Deployed for tests purposes on heroku: https://usi-json-schema-validator.herokuapp.com/validate

:arrow_right: [Getting Started](README.md#getting-started)

:arrow_right: [Validator API](README.md#validator-api)

:arrow_right: [Custom keywords](README.md#custom-keywords)

:arrow_right: [License](README.md#license)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
To be able to run this project you'll need to have [Node.js](https://nodejs.org/en/about/) and [npm](https://www.npmjs.com/) installed in your machine.
npm is distributed with Node.js which means that when you download Node.js, you automatically get npm installed on your computer.

### Installing

#### Node.js / npm
- Get Node.js: https://nodejs.org/en/ (v8.11.1 LTS)

- If you use [Homebrew](https://brew.sh/) you can install node by doing:
```
brew install node
```

After installation check that everything is correctly installed and which versions you are running:
```
node -v
npm -v
```

#### Project
Clone project and install dependencies:
```
git clone https://github.com/EMBL-EBI-SUBS/json-schema-validator.git
cd json-schema-validator
npm install
```

### Running the Tests
```
node test
```

### Executing
```
node src/server
```
The node server will run on port **3000** and will expose one endpoint: **/validate**.

### Executing with Docker
1. Build docker image:
```
docker build -t subs/json-schema-validator .
```
2. Run docker image:
```
docker run -p 3000:3000 -d subs/json-schema-validator
```
### Development
For development purposes using [nodemon](https://nodemon.io/) is useful. It reloads the application everytime something has changed on save time.
```
nodemon src/server
```

## Validator API
The validator exposes one single endpoint that will accept POST requests. When running on you local machine it will look like: **http://localhost:3000/validate**.

### Usage
The endpoint will expect the body to have the following structure:
```json
{
  "schema": {},
  "object": {}
}
```
Where the schema should be a valid json schema object to validate the submittable against.

**Example:**
Sending a POST request with the following body:
```json
{
  "schema": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Attributes",
    "description": "USI submittable attributes schema.",

    "type": "object",
    "properties": {
      "attributes": {
        "type": "object",
        "properties": {},
        "patternProperties": {
          "^.*$": {
            "type": "array",
            "minItems": 1,
            "items": {
              "properties": {
                "value": {
                  "type": "string",
                  "minLength": 1
                },
                "units": {"type": "string"},
                "terms": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "format": "uri"
                  }
                }
              },
              "required": ["value"]
            }
          }
        }
      }
    }
  },
  "object": {
    "attributes": {
      "age": [{
        "value": "3",
        "units": "days",
        "terms":[
          "http://purl.obolibrary.org/obo/UO_0000033"
        ]
      }],
      "sex": [{
        "value": "female",
        "terms":[
          "http://purl.obolibrary.org/obo/PATO_0000383"
        ]
      }]
    }
  }
}
```
will produce a response like:

HTTP status code `200`
```json
[]
```
An invalid validation response will look like:

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
Where *errors* is an array of error messages for a given input identified by its path on *dataPath*. There may be one or more error objects within the response array. An empty array represents a valid validation result.

### API Errors
Sending malformed JSON or a body with either the schema or the submittable missing will result in an API error (the request will not reach the validation). API errors have the following structure:

HTTP status code `400`
```json
{
  "error": "Malformed JSON please check your request body."
}
```
## Custom keywords
The AJV library supports the implementation of custom json schema keywords to address validation scenarios that json schema is not capable of addressing.

### isChildTermOf
This custom keyword *evaluates if an ontology term is child of other*. This keyword is applied to an array of strings (url) and **passes validation if at least one of the terms in the array is child of the term defined in the schema**.
The keyword requires the **parent term** and the **ontology id**, both of which should exist in [OLS - Ontology Lookup Service](https://www.ebi.ac.uk/ols).
This keyword works by doing an asynchronous call to OLS API that will respond with the required information to know if a given term is child of another. Being an async validation step, whenever used is a schema it should have the flag: `"$async": true`
#### Usage
Schema:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$async": true,

  (...)

    "isChildTermOf": {
      "parentTerm": "http://purl.obolibrary.org/obo/PATO_0000047",
      "ontologyId": "pato"
    }
}
```
JSON object:
```json
{
  "attributes": {
    "sex": [{
      "value": "female",
      "terms":["http://purl.obolibrary.org/obo/PATO_0000383"]
    }]
  }
}
```

## License
 For more details about licensing see the [LICENSE](LICENSE.md).
