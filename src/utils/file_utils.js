const fs = require('fs');
const glob = require('glob');
const {log_error} = require("./logger");

function getFiles(filePattern) {
    let files = [];
    if (Array.isArray(filePattern)) {
        for (let fp of filePattern) {
            addFiles(fp, files);
        }
    } else {
        addFiles(filePattern, files);
    }

    return new Set(files);
}

function readFile(filePath) {
    let schema = fs.readFileSync(filePath).toString();
    let jsonSchema = JSON.parse(schema.toString());
    jsonSchema["$async"] = true;

    return jsonSchema;
}

function readJsonFile(filePath) {
    if (fs.existsSync(filePath)) {
        let jsonStr = fs.readFileSync(filePath, 'utf-8')
        return JSON.parse(jsonStr)
    } else {
        let error = "File '" + filePath + "' does not exist!";
        log_error(error);
        throw error;
    }
}

function addFiles(filePattern, files) {
    if (glob.hasMagic(filePattern)) {
        const dataFiles = glob.sync(filePattern, {cwd: process.cwd()})
        files = files.concat(dataFiles);
    } else {
        if (fs.lstatSync(filePattern).isDirectory()) {
            fs.readdirSync(filePattern).forEach(file => {
                files.push(filePattern + "/" + file);
            });
        } else {
            files.push(filePattern);
        }
    }
}

module.exports = {getFiles, readFile, readJsonFile}
