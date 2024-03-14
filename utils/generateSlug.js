var slugify = require('slugify')
const { slugify: bengaliSlugify } = require('transliteration');

// Slugify using Bengali transliteration


const generateSlug = (name) => {
    const bengaliSlug = bengaliSlugify(name);
    return slugify(bengaliSlug, { lower: true });
}

module.exports = generateSlug;