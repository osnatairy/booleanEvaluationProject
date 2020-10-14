const mongoose = require('mongoose')

probeConceptValueSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    conceptName: String,
    value: Boolean,
    experimenteNum: Number,
    queryName: String,
});

module.exports = mongoose.model('ProbeConceptValue', probeConceptValueSchema);