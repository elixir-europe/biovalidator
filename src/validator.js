let Ajv = require("ajv");
const logger = require('./winston');
let IsChildTermOf = require("./custom/ischildtermof");
let IsValidTerm = require("./custom/isvalidterm");
const ValidationError = require("./model/validation-error");
const AppError = require("./model/application-error");

let ajv = new Ajv({allErrors: true});
let isChildTermOf = new IsChildTermOf(ajv);
let isValidTerm = new IsValidTerm(ajv);

function convertToValidationErrors(ajvErrorObjects) {
  let localErrors = [];
  ajvErrorObjects.forEach( (errorObject) => {
    let tempValError = new ValidationError(errorObject);
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
  logger.log("silly", "Running validation...");
  return new Promise((resolve, reject) => {
    var validate = ajv.compile(inputSchema);
    Promise.resolve(validate(inputObject))
    .then((data) => {
        if (validate.errors) {
          logger.log("debug", ajv.errorsText(validate.errors, {dataVar: inputObject.alias}));
          resolve(convertToValidationErrors(validate.errors));
        } else {
          resolve([]);
        }
      }
    ).catch((err, errors) => {
      if (!(err instanceof Ajv.ValidationError)) {
        logger.log("error", "An error ocurred while running the validation.");
        reject(new AppError("An error ocurred while running the validation."));
      } else {
        logger.log("debug", ajv.errorsText(err.errors, {dataVar: inputObject.alias}));
        resolve(convertToValidationErrors(err.errors));
      }
    });
  });
}

module.exports = runValidation;