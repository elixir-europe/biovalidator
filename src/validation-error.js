class ValidationError {
    constructor(errors, dataPath, input) {
        this.errors = errors;
        if(input) {
            this.dataPath = dataPath + '.' + input;
        } else {
            this.dataPath = dataPath;
        }
        
    }

};

module.exports = ValidationError;