const mongoose = require('mongoose')

expressionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    closesNum : Number,
    conceptCount:Number,
    isReadOnce : Boolean,
    dicByConcept :String,
    dnf :String,
    cnf:String,
    fileName: String,
    folderName: String
});

module.exports = mongoose.model('Expression', expressionSchema);






