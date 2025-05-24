const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ArtistSchema = new Schema ({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    }
});

module.exports = mongoose.model('Artist', ArtistSchema);