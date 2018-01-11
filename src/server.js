const express = require('express');
const bodyParser = require('body-parser');

const runValidation = require('./validator');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(function(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).send({"error": "Malformed JSON please check your request body."});
  }
});

app.post('/validate', (req, res) => {
  console.log('Received validation request!');

  var inputSchema = req.body.schema;
  var submittable = req.body.submittable;

  if (inputSchema && submittable) {
    runValidation(inputSchema, submittable).then((output) => {
      res.status(200).send(output);
    });
  } else {
    res.status(400).send(
      {"error": "Both schema and submittable are required to execute validation."}
    );
  }

});

app.get('/validate', (req, res) => {
  res.send({
    message: "This is the USI JSON Schema Validator. Please POST to this endpoint the schema and object to validate structured as in bodyStructure. For more information and examples on how to use the validator see https://github.com/EMBL-EBI-SUBS/json-schema-validator.",
    bodyStructure: {
      schema: {},
      submittable: {}
    }
  })
});

app.listen(port, () => {
  console.log(` -- Started server on port ${port} --`);
});
