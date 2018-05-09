let Ajv = require("ajv");
let DefFunc = require("./ischildtermof");
const ValidationError = require("./validation-error");

let ajv = new Ajv({allErrors: true});
let defFunc = new DefFunc(ajv);

function convertToValidationErrors(ajvErrorObjects) {
  let localErrors = [];
  ajvErrorObjects.forEach( (errorObject) => {
    let tempValError = new ValidationError([errorObject.message], errorObject.dataPath, errorObject.params.missingProperty);
    let index = localErrors.findIndex(valError => (valError.dataPath === tempValError.dataPath));

    if(index !== -1) {
      localErrors[index].errors.push(tempValError.errors[0]);
    } else {
      localErrors.push(tempValError);
    }
  });
  return localErrors;
}

function runValidation(inputSchema, inputObject) {
  return new Promise((resolve, reject) => {
    var validate = ajv.compile(inputSchema);
    Promise.resolve(validate(inputObject))
    .then((data) => {
        if (validate.errors) {
          // For debug reasons
          console.log(validate.errors);
          
          resolve(convertToValidationErrors(validate.errors));
        } else {
          resolve([]);
        }
      }
    ).catch((err, errors) => {
      if (!(err instanceof Ajv.ValidationError)) {
        throw err;
      }
      console.log(ajv.errorsText(err.errors));
      resolve(err.errors);
    });
  });
}

module.exports = runValidation;