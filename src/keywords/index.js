const isChildTermOf = require('./ischildtermof');
const isValidTaxonomy = require('./isvalidtaxonomy');
const isValidTerm = require('./isvalidterm')

module.exports = {
    isChildTermOf: isChildTermOf,
    isValidTaxonomy: isValidTaxonomy,
    isValidTerm: isValidTerm
}
