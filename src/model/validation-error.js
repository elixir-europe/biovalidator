class ValidationError {
  constructor(errorObject) {
    if(errorObject.params.missingProperty) {
      this.dataPath = errorObject.instancePath + "." + errorObject.params.missingProperty;
    } else {
      this.dataPath = errorObject.instancePath.replaceAll("/", ".");
    }

    if(errorObject.params.allowedValues) { // enum case
      this.errors = [errorObject.message + ": " + JSON.stringify(errorObject.params.allowedValues)];
    } else {
      this.errors = [errorObject.message];
    }
  }
}

module.exports = ValidationError;
