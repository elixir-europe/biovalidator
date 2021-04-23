const request = require("request-promise");
const Promise = require("bluebird");

class CurieExpansion {
    constructor(olsSearchUrl){
        this.olsSearchUrl = olsSearchUrl;
        this.cachedOlsCurieResponses = {};
    }

    static isCurie(term) {
        let curie = true;
        if (term.split(":").length !== 2 || term.includes("http")){
            curie = false;
        }
        return curie;
    }

    expandCurie(term) {
        const termUri = encodeURIComponent(term);
        const url = this.olsSearchUrl + termUri
            + "&exact=true&groupField=true&queryFields=obo_id";

        return new Promise((resolve, reject) => {
            let curieExpandResponsePromise = null;

            if(this.cachedOlsCurieResponses[url]) {
                curieExpandResponsePromise = Promise.resolve(this.cachedOlsCurieResponses[url]);
            } else {
                curieExpandResponsePromise = request({
                    method: "GET",
                    url: url,
                    json: true
                }).promise();
            }

            curieExpandResponsePromise
                .then((resp) => {
                    this.cachedOlsCurieResponses[url] = resp;
                    let jsonBody = resp;
                    if (jsonBody.response.numFound === 1) {
                        resolve(jsonBody.response.docs[0].iri);
                    }
                    else {
                        reject("Could not retrieve IRI for " + term);
                    }
                }).catch(err => {
                reject(err)
            });
        });
    }
}

module.exports = CurieExpansion;