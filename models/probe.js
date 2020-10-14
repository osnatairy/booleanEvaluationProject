const mongoose = require('mongoose')

probeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
        evaluationid  : String,  
        filename : String,
        conceptCount:  Number,
        closesNum: Number,  
        termsNum: Number,
        cnf: String,
        dnf:String,
        expType: String,
        probRound: Number,
        concepts: String,
        choosenConcept: String,
        probability: Number,
        conceptValue: Boolean,
        runTimeToEvaluatedNextProb: Number,
        exp_num: Number,
        isReadOnce : Boolean,
        evaluate: Boolean,
        conceptsList: String,
        conceptList2: String,

});

module.exports = mongoose.model('Probe', probeSchema);