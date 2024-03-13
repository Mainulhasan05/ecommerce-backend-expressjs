var slugify = require('slugify')

const generateSlug = (name) => {
    return slugify(name, {
        lower: true,
        strict:false,
        trim:true,
        replacement: '-'
    })
}

module.exports = generateSlug;