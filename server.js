const express = require('express');
const bodyParser = require('body-parser');

var {validate} = require('./validator')

var app = express();
app.use(bodyParser.json());

app.post('/validate', (req, res) => {
  var inputSchema = req.body.schema;
  var submittable = req.body.submittable;
  
  var results = validate(inputSchema, submittable);
  
  res.status(200).send(results);
});

app.listen(3000, () => {
  console.log('Server is up on port 3000')
});