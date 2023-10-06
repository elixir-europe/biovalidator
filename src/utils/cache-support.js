const NodeCache = require("node-cache");

class CacheSupport {
    constructor() {
        this.compiledSchemas = new NodeCache({stdTTl: 21600, checkperiod: 3600, useClones: false});
        this.compiledSchemas2020 = new NodeCache({stdTTl: 21600, checkperiod: 3600, useClones: false});
        this.referencedSchemas = new NodeCache({stdTTl: 21600, checkperiod: 3600, useClones: false});
    }

    getCompiledSchema(id) {

    }

    setCompliedSchema(id, schema) {

    }

    getReferencedSchema(url) {

    }

    setReferencedSchema(url, schema) {

    }
}
