const axios = require('axios');

class CurieExpansion {
    constructor(olsSearchUrl) {
        this.olsSearchUrl = olsSearchUrl;
        this.cachedOlsCurieResponses = {};
    }

    static isCurie(term) {
        let curie = true;
        if (term.split(":").length !== 2 || term.includes("http")) {
            curie = false;
        }
        return curie;
    }

    expandCurie(term) {
        const termUri = encodeURIComponent(term);
        const url = this.olsSearchUrl + termUri
            + "&exact=true&groupField=true&queryFields=obo_id";

        return new Promise((resolve, reject) => {
            let curieExpandResponsePromise;

            if (this.cachedOlsCurieResponses[url]) {
                curieExpandResponsePromise = Promise.resolve(this.cachedOlsCurieResponses[url]);
            } else {
                curieExpandResponsePromise = axios({
                    method: "GET",
                    url: url,
                    responseType: 'json'
                });
            }

            curieExpandResponsePromise
                .then((response) => {
                    this.cachedOlsCurieResponses[url] = response;
                    if (response.data.response.numFound === 1) {
                        resolve(response.data.response.docs[0].iri);
                    } else {
                        reject("Could not retrieve IRI for " + term);
                    }
                }).catch(err => {
                reject(err)
            });
        });
    }
}

module.exports = CurieExpansion;