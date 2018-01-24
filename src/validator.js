var Ajv = require("ajv");
var DefFunc = require('./ischildtermof');

var ajv = new Ajv({allErrors: true});
var defFunc = new DefFunc(ajv);

function runValidation(inputSchema, inputObject) {
  return new Promise((resolve, reject) => {
    var validate = ajv.compile(inputSchema);
    Promise.resolve(validate(inputObject))
    .then((data) => {
        if (validate.errors) {
          console.log(ajv.errorsText(validate.errors));
          resolve({ result: "Invalid: " + ajv.errorsText(validate.errors)});
        } else {
          resolve({ result: "Valid!"});
        }
      }
    ).catch((err, errors) => {
      if (!(err instanceof Ajv.ValidationError)) throw err;
      console.log(ajv.errorsText(err.errors));
      resolve({ result: "Invalid: " + ajv.errorsText(err.errors)});
    });
  });
}

module.exports = runValidation;
