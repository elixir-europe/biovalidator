const express = require('express');
const bodyParser = require('body-parser');

var runValidation = require('./validator');

var app = express();
app.use(bodyParser.json());

app.post('/validate', (req, res) => {
  console.log('Received validation request!');
  var inputSchema = req.body.schema;
  var submittable = req.body.submittable;

  runValidation(inputSchema, submittable).then((output) => {
    res.status(200).send(output);
  });

});

app.get('/validate', (req, res) => {
  res.send({
    message: "This is the USI JSON Schema Validator. Please POST to this endpoint the schema and object to validate structured as in bodyStructure.",
    bodyStructure: {
      schema: {},
      submittable: {}
    }
  })
});

app.listen(3000, () => {
  console.log('Server is up on port 3000')
});
