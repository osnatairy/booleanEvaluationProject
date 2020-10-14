var fs = require('fs')
var async = require("async");
const mongoose = require('mongoose')
var Boolean = require('../../models/boolean')
var Probe = require('../../models/probe')
var ProbeConceptValue = require('../../models/probconceptvalue')
var algoinfo = require('../../models/algoInfo')

var bool = require('./boolean')
var deshpande = require('./deshpande');
var randomMethod = require('./randomProb')
var huristicAllen = require('./huristicAllen')
var algo1 = require('./algo1')
var greedy = require('./greedy')
var toCNF = require('./convert_toCNF-positive')


module.exports = {
    index:1,

    //allProbingProcess: [],
    algorithm :"", 
    expressionList:[],
    conceptValueNum:0,
    conceptValues : [],
    startTime :0,
    endTime :0,
    round : 0,
    sumTerms :0,
    sumConcepts: 0,
    sumClauses: 0,
    sumTrueEvaluate: 0,
    sumFalseEvaluate: 0,
    t_arr : [],
    f_arr : [],
    conceptList  : {},
    avgRunTime : 0,
    dicResult:{},
    choosencONCEPT :"",
   
    createTCPH_ExpressionData: async function(probing, index){
        console.log( " " + probing.exp_num +". 4. ******* start createTCPH_ExpressionData ****")      
        console.log(" -- "+`  The script uses approximately ${Math.round( process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`)
                  
        probing.cnf =  this.algorithm == "deshpande" ? probing.cnf : "" 
       
        probing.dicByConcept2 = arrToDic({},probing.dicByConcept.split(',')) 
       
        probing.evaluationid = this.evaluationid
        probing.update = true
        probing.algorithm = this.algorithm
        probing.expressionType = "dnf"
        probing.isReadOnce = probing.isReadOnce == 'true'
       
        probing.termsNum = probing.cnf.split('&').length
        probing.updateDic = true
       
        probing.probability = 0.5;
        probing.runTimeToEvaluatedNextProb = 0;
        let dnf_arr = bool.buildArrExpression(probing.dnf, false)
        if(this.algorithm == "greedy")
            bool.getConceptReturn(dnf_arr, probing.dicByConcept2)
        dnf_arr = null
    },
  
    startTCPH_MultipleEvaluationProcess: async function(){
        console.log("algorithm: " + this.algorithm)

        this.conceptList = {}
        this.evaluationid = Date.now()

        let exp_num = 1
        const start = async () => {            
            await asyncForEach(this.expressionList, async (file) => {  
 
                file.exp_num = exp_num++
                
                await this.createTCPH_ExpressionData(file, this.index)
                
                for (var key in file.dicByConcept2) {
                    key = key.trim()
                    if(this.conceptList.hasOwnProperty(key))
                        this.conceptList[key] += file.dicByConcept2[key]
                    else
                        this.conceptList[key] = file.dicByConcept2[key]
                };
             
                if (Object.keys(file).length != 0){
                    this.sumTerms += file.termsNum
                    this.sumClauses += file.closesNum
                }
            });
           
        
            let a = this.sumTerms
            let b = this.sumClauses
            let bool_ev = new Boolean({            
                _id : new mongoose.Types.ObjectId(),
                evaluationid: this.evaluationid,
                conceptCount:  this.conceptList.length, //
                sumTerms: a,
                sumClauses: b,
                round: 0, 
                algorithm:this.algorithm,
                probValueOrder: this.conceptValueNum, 
                sumExpressions: exp_num -1,   
                folder:  this.folder,
                conceptList:  JSON.stringify(this.conceptList)       
            })
            
            bool_ev.save(function(err, doc) {
                if (err) return console.error(err);
                
                console.log("bool_ev inserted succussfully!");
              });

            await this.evaluate()
            console.log(this.avgRunTime)
            console.log(this.round)
            const filter = { evaluationid: this.evaluationid };
            const update = { round: this.round,
                            sumFalseEvaluate: this.sumFalseEvaluate,
                            sumTrueEvaluate:this.sumTrueEvaluate,
                            avgRunTime: this.avgRunTime/this.round
                        };

            await Boolean.countDocuments(filter); 

            let doc = await Boolean.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true // Make this update into an upsert
            });
            console.log("******************* <- process.js -> end of startTCPH_EvaluationProcess -> *********************")
    
        }
        await start()
      },

    evaluate: async function(){
        await this.saveProbeingRound()

        console.log( " " + this.index +". 9. ************************** START EVALUATION *********************************")
        let i = 0

        while(!await this.checkIfExpressionIsEvalueted(i)){
            this.round ++;
            if(i% 100 == 0)
                console.log(" =======choosencONCEPT==="+this.choosencONCEPT +" =====expressionList length===== "+this.expressionList.length+"========== START NEW PROBING FASE #" +i + " ========== ========== ========== ")
        
            let probing_varient = await this.probingAnalysis(i) // return the next variable to prob
            this.choosencONCEPT = probing_varient
         
            let probing_value = this.chooseProbeValue(probing_varient)
         
            this.updateExpression(probing_varient,probing_value) 
            await this.saveProbeingRound( )
            i++          
            
        }
        return;
    },

  
    checkIfExpressionIsEvalueted: async function(num){        
        if(this.expressionList.length == 0){ 
            return true;                 
        }
        let evaluate = true
        let number = 0
        let tempList = []

        const checkEvalutions = async () => {            
            await asyncForEach(this.expressionList, async (expression) => { 
                let dnf_arr = bool.buildArrExpression(expression.dnf, false)
               
                if (this.algorithm == "deshpande"){
                    let cnf_arr = bool.buildArrExpression(expression.cnf, true)
                    if (cnf_arr.length == 0 || dnf_arr.length ==  0){
                      
                    }  
                    else{
                        tempList.push(expression)
                        
                    }
                    if (cnf_arr.length > 0 && dnf_arr.length > 0){                    
                        evaluate = false;
                    } 
                    cnf_arr = null
                }
                else{
                 
                    if (dnf_arr.length ==  0){
                      
                    }
                    else{
                        tempList.push(expression)
                    }
                    if (dnf_arr.length >  0){
                        evaluate = false;
                    } 
                }
                
                number++             
            });
            this.expressionList = tempList
            tempList = null
           
            if(this.expressionList.length == 0)
                evaluate = true;            
            dnf_arr = false
            return evaluate
        }  
        return await checkEvalutions()
             
    },

    probingAnalysis: async function(round){
        this.startCountTime()
        let conceptToProb = ""
        if(this.algorithm == "deshpande"){
            conceptToProb = await deshpande.chooseNextConcept(this.expressionList)
          
        }
        if(this.algorithm  == "random"){
            conceptToProb = await randomMethod.chooseNextConcept(this.expressionList)
          
        }
        if(this.algorithm == "huristicAllen"){
            conceptToProb = await huristicAllen.chooseNextConcept(this.expressionList,this.round)
         
        }
        if(this.algorithm == "algo1"){
            conceptToProb = await algo1.chooseNextConcept(this.expressionList,this.round)
           
        }
        if(this.algorithm == "greedy"){
            conceptToProb = await greedy.chooseNextConcept(this.expressionList,this.round)
         
        }
      
        this.stopCountTime()
        this.dicResult = conceptToProb.dicResult;
        conceptToProb.dicResult = null;
        return conceptToProb.choosen;
    },
    
    chooseProbeValue: function(concept){
       
        let val;
        if(concept in this.conceptValues)
            val = this.conceptValues[concept]
        else{
            val = randomProbValue()
            this.conceptValues[concept] = val
            let saveProbeVal = new ProbeConceptValue({
                _id: new mongoose.Types.ObjectId()  , 
                conceptName: concept,
                value: val,
                experimenteNum: this.conceptValueNum,
                queryName: this.queryName,
            }) 
            saveProbeVal.save(function(err, doc) {
                if (err) return console.error(err);              
              });
            }
        return val;
    },

    saveProbeingRound: async function(){
     
        let idx = 1
        let docs = []
        let terms = 0
        let clauses = 0
        const saveProbings = async () => {            
            await asyncForEach(this.expressionList, async (expression) => {
                   
                    terms += expression.termsNum
                    clauses +=expression.closesNum
                    if(expression.update){
                    let probe = new Probe({    
                        _id: new mongoose.Types.ObjectId()  , 
                        evaluationid: expression.evaluationid,
                        filename : expression.filename,
                        conceptCount: Object.keys(expression.dicByConcept2).length,
                        closesNum: expression.closesNum,  
                        termsNum: expression.termsNum,    
                        cnf: expression.cnf,
                        dnf:expression.dnf,
                        expType : expression.expressionType,
                        probRound: this.round,
                        choosenConcept: expression.choosenConcept,
                        probability: expression.probability,
                        conceptValue: expression.conceptValue,
                        runTimeToEvaluatedNextProb: this.runTimeToEvaluatedNextProb,
                        exp_num: expression.exp_num,
                        isReadOnce : expression.isReadOnce,
                        evaluate: expression.evaluate,
                        conceptsList :Object.keys(expression.dicByConcept2).length > 0 ? Object.keys(expression.dicByConcept2).join(): ""
                      
                    })
                    expression.update = false

                    idx++
                    const result = await probe.save();
                  
                }

            });
            
        }  
        await saveProbings()
       
    },

    updateExpression: async function(concept,val){
      
        const updateExp = async () => {            
            await asyncForEach(this.expressionList, async (expression) => {  
                
                if (Object.keys(expression.dicByConcept2).includes(concept)){
                 
                    let choosen = {"conceptName": concept ,"value": val}
                
                    expression.choosenConcept = concept
                    expression.conceptValue = val                   
                    bool.index = this.index                   
                    let r = bool.simplifyExp([choosen], expression.cnf,expression.dnf,expression.exp_num,this.algorithm)
                   
                    this.t_arr.push(r.t_arr)
                    this.f_arr.push(r.f_arr)
                    if(r.isEvaluateFalse){
                        
                        expression.evaluate = false
                        this.sumFalseEvaluate += 1
                    }
                    if(r.isEvaluateTrue){
                    
                        expression.evaluate = true
                        this.sumTrueEvaluate += 1
                    }
                    expression.cnf = bool.buildStrExpression(r.cnf)
                    expression.dnf = bool.buildStrExpression(r.dnf)
                  
                    expression.dicByConcept2 = r.dic
                    expression.conceptCount = Object.keys(r.dic).length

                    r = null
                    expression.termsNum = bool.count_terms(expression.cnf)
                    expression.closesNum = bool.count_clauses(expression.dnf)
                    expression.update = true
                    expression.updateDic = true
                    
                }          
            });
           
            return 
        }  
        await updateExp()   
    },


    startCountTime: function(){
        this.startTime = new Date()      
    },
    stopCountTime: function(){
        this.endTime = new Date()
        let timeDiff = this.endTime - this.startTime; //in ms
        this.runTimeToEvaluatedNextProb = timeDiff
        this.avgRunTime += this.runTimeToEvaluatedNextProb
    },

}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function arrToDic(dic,arr){

    arr.forEach(element => {
        element = element.trim()
        dic[element] = 0
    });
    return dic
}

function randomProbValue(){
    let val = Math.random() >= 0.5
    return val;
}

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }
  
