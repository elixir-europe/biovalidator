class ValidationError {
  constructor(errorObject) {
    if(errorObject.params.missingProperty) {
      this.dataPath = errorObject.dataPath + "." + errorObject.params.missingProperty;
    } else {
      this.dataPath = errorObject.dataPath;
    }

    if(errorObject.params.allowedValues) { // enum case
      this.errors = [errorObject.message + ": " + JSON.stringify(errorObject.params.allowedValues)];
    } else {
      this.errors = [errorObject.message];
    }
  }
}

// /**
//  * Convert array of error message objects to string
//  * @this   Ajv
//  * @param  {Array<Object>} errors optional array of validation errors, if not passed errors from the instance are used.
//  * @param  {Object} options optional options with properties `separator` and `dataVar`.
//  * @return {String} human readable string with all errors descriptions
//  */
// function errorsText(errors, options) {
//   errors = errors || this.errors;
//   if (!errors) return 'No errors';
//   options = options || {};
//   var separator = options.separator === undefined ? ', ' : options.separator;
//   var dataVar = options.dataVar === undefined ? 'data' : options.dataVar;

//   var text = '';
//   for (var i=0; i<errors.length; i++) {
//     var e = errors[i];
//     if (e) text += dataVar + e.dataPath + ' ' + e.message + separator;
//   }
//   return text.slice(0, -separator.length);
// }

module.exports = ValidationError;