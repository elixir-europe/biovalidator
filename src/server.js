const express = require("express");
const bodyParser = require("body-parser");
const logger = require('./winston');
const runValidation = require("./validator");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(function(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    logger.log("info", "Received malformed JSON.");
    res.status(400).send({"error": "Received malformed JSON, please check your request body."});
  } else {
    logger.log("error", err.message);
    res.status(err.status).send({"error": "Ups, something went wrong"});
  }
});

app.post("/validate", (req, res) => {
  logger.log("debug", "Received POST request.");

  var inputSchema = req.body.schema;
  var inputObject = req.body.object;

  if (inputSchema && inputObject) {
    runValidation(inputSchema, inputObject).then((output) => {
      logger.log("silly", "Sent validation results.");
      res.status(200).send(output);
    });
  } else {
    logger.log("info", "Something is missing: schema and/or object .");
    res.status(400).send(
      {"error": "Something is missing, both schema and object are required to execute validation."}
    );
  }

});

app.get("/validate", (req, res) => {
  logger.log("silly", "Received GET request.");

  res.send({
    message: "This is the USI JSON Schema Validator. Please POST to this endpoint the schema and object to validate structured as in bodyStructure. For more information and examples on how to use the validator see https://github.com/EMBL-EBI-SUBS/json-schema-validator",
    bodyStructure: {
      schema: {},
      object: {}
    }
  });
});

app.listen(port, () => {
  logger.log("info", ` -- Started server on port ${port} --`);
});
