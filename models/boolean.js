const mongoose = require('mongoose')

booleanSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    evaluationid:String,
    conceptCount:  Number, //
    sumTerms: Number,
    sumClauses: Number,
    round: Number,    
    algorithm: String, //
    probMethod: String,
    probValueOrder: String, //
    sumExpressions: Number,
    folder: String,
    sumTrueEvaluate: Number,
    sumFalseEvaluate: Number,
    conceptList: String,
    experimentType: String,
    avgRunTime: Number
});

module.exports = mongoose.model('Boolean', booleanSchema);