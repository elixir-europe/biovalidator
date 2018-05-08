class ValidationError {
    constructor(errors, dataPath, input) {
        this.errors = errors;
        if(input) {
            if(dataPath) {
                this.dataPath = dataPath + '.' + input;
            } else {
                this.dataPath = input;
            }
        } else {
            if(dataPath) {
                this.dataPath = dataPath;
            }
        }
    }

};

module.exports = ValidationError;