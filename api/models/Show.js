const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const ShowSchema = new Schema({
    title: {type: String, required: true},
    imdbId: {type: String, required: true, unique: true},
    startYear: {type: Number, required: false},
    endYear: {type: Number, required: false},
    type: {type: String, required: true},
    streamingInfo: {type: Array, required: false},
    fetchedAt: {type: String, required: true}

}, {timestamps: true});

const ShowModel = model('Show', ShowSchema);

module.exports = ShowModel;

