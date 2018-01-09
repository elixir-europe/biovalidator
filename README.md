# JSON Schema Validator
[![Build Status](https://travis-ci.org/EMBL-EBI-SUBS/json-schema-validator.svg?branch=master)](https://travis-ci.org/EMBL-EBI-SUBS/json-schema-validator)

This repository contains a [JSON Schema](http://json-schema.org/) validator for the Unified Submission Interface (USI) project. This validator runs as a standalone node server that receives validation requests and gives back it's results.
The validation is done using the [AJV](https://github.com/epoberezkin/ajv) library version 6.0.0 that fully supports the JSON Schema **draft-07**.

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
- Get Node.js: https://nodejs.org/en/

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
### Development
For development purposes using [nodemon](https://nodemon.io/) is useful. It reloads the application everytime something changes on save time.

## Validator API
The validator exposes one single endpoint that will accept POST requests. When running on you local machine it will look like: **http://localhost:3000/validate**.

### Usage
The endpoint will expect the body to have the following structure:
```json
{
  "schema": {},
  "submittable": {}
}
```
Where the schema should be a valid json schema object to validate the submittable against.


**Example:**
Sending a POST request with the following body
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
  "submittable": {
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
will result in this response:

HTTP status code `200`
```json
{
  "result": "Valid!"
}
```
An invalid validation response will look like:

HTTP status code `200`
```json
{
  "result": "Invalid: data.attributes['age'][0] should have required property 'value'"
}
```

### Errors
Sending malformed JSON or a body with either the schema or the submittable missing will result in an error. Errors have the following structure:

HTTP status code `400`
```json
{
  "error": "Malformed JSON please check your request body."
}
```
## Custom keywords
The AJV library supports the implementation of custom json schema keywords to address validation scenarios that json schema is not capable of addressing.

### isChildTermOf
This custom keyword to *evaluates if an ontology term is child of other*. This keyword is applied to an array of strings (url) and **passes validation if at least one of the terms in the array is child of the term defined in the schema**.
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
