const logger = require("./winston");
const ValidationError = require("./model/validation-error");
const AppError = require("./model/application-error");

const { ElixirValidator, isChildTermOf, isValidTerm, isValidTaxonomy} = require('elixir-jsonschema-validator');

const validator = new ElixirValidator([
  new isChildTermOf(null, "https://www.ebi.ac.uk/ols/api/search?q="),
  new isValidTerm(null, "https://www.ebi.ac.uk/ols/api/search?q="),
  new isValidTaxonomy(null)
]);

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
    validator.validate(inputSchema, inputObject)
    .then((validationResult) => {
        if (validationResult.length == 0) {
          resolve([]);
        } else {
          let ajvErrors = [];
          validationResult.forEach(validationError => {
            ajvErrors.push(validationError);
          });

          resolve(convertToValidationErrors(ajvErrors));
        }
      }
    ).catch((error) => {
      if (error.errors) {
        reject(new AppError(error.errors));
      } else {
        logger.log("error", "An error ocurred while running the validation. Error : " + JSON.stringify(error));
        reject(new AppError("An error ocurred while running the validation."));
      }
    });
  });
}

module.exports = runValidation;