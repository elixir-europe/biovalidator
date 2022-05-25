const fs = require('fs');
const glob = require('glob');

function getFiles(filePattern) {
    let files = [];
    if (glob.hasMagic(filePattern)) {
        const dataFiles = glob.sync(filePattern, {cwd: process.cwd()})
        files = files.concat(dataFiles);
    } else {
        files.push(filePattern);
    }

    console.log(files)
    console.log("files length: " + files.length)
    return files;
}

function readFile(filePath) {
    let schema = fs.readFileSync(filePath).toString();
    let jsonSchema = JSON.parse(schema.toString());
    jsonSchema["$async"] = true;

    return jsonSchema;
}

module.exports = { getFiles, readFile }
