//var fs = require('fs');
var express = require('express');
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/BooleanEvaluaionProject',
{ useNewUrlParser: true ,useUnifiedTopology: true})

var ProbConceptValue = require('../../models/probconceptvalue')
var Expression = require('../../models/expression')

var probingProcess = require('../../public/experiments/MultipleEvaluationProcess');
probingProcess.index = 0

async function runMultipleExpression1(expressions,tempObj){
    console.log(expressions.length)
    console.log(tempObj)
  
    probingProcess.probing = {}   
    probingProcess.sequanceNum=0;
    probingProcess.sequance = [];
    probingProcess.startTime =0;
    probingProcess.endTime =0;
    probingProcess.round = 0;
    probingProcess.sumTerms =0;
    probingProcess.sumConcepts= 0;
    probingProcess.sumClauses= 0;
    probingProcess.sumTrueEvaluate= 0;
    probingProcess.sumFalseEvaluate= 0;
    probingProcess.conceptList = {}
    probingProcess.t_arr = [];
    probingProcess.f_arr = [];
    probingProcess.avgRunTime = 0
    
    probingProcess.folder = tempObj.folder
    probingProcess.algorithm = tempObj.algorithm
    probingProcess.expressionList = expressions
    probingProcess.conceptValueNum = tempObj.conceptValueNum
    expressions = null
    probingProcess.conceptValues = tempObj.probVal
    tempObj.probVal = null
    probingProcess.queryName = tempObj.queryName
    probingProcess.row = tempObj.folder.split('_')[1]
    probingProcess.index++;
   
    console.log( " " + probingProcess.index +". 1. ******************* <- index.js -> pre analyze -> startTCPH_EvaluationProcess -> *********************")
    await probingProcess.startTCPH_MultipleEvaluationProcess()
        
    console.log(probingProcess.conceptValueNum+ "  " + tempObj.algorithm +". LAST. ******************* <- index.js -> post analyze -> startTCPH_EvaluationProcess -> *********************")

    probingProcess.probing = {}   
    probingProcess.sequanceNum=0;
    probingProcess.sequance = [];
    probingProcess.startTime =0;
    probingProcess.endTime =0;
    probingProcess.round = 0;
    probingProcess.sumTerms =0;
    probingProcess.sumConcepts= 0;
    probingProcess.sumClauses= 0;
    probingProcess.sumTrueEvaluate= 0;
    probingProcess.sumFalseEvaluate= 0;
    probingProcess.conceptList = {}
    probingProcess.t_arr = [];
    probingProcess.f_arr = [];
    probingProcess.avgRunTime = 0
    
    probingProcess.folder = null
    probingProcess.algorithm = null
    probingProcess.expressionList =null
    probingProcess.conceptValueNum = null
    expressions = null
    probingProcess.conceptValues = null
    tempObj.probVal = null
    probingProcess.queryName = nulle
    probingProcess.row = null
    probingProcess.index++;

}

async function runMultipleExpression(query,valmethod,algorithm){

    let queryName = query.split('_')[0].replace('Q', 'query')
    
    ProbConceptValue.find({experimenteNum: valmethod, queryName: queryName})
    .exec()
    .then(docs => {
      
      let probVal = Object.assign({}, ...docs.map(({conceptName, value}) => ({[conceptName]: value})))
     
      let tempObj = {
        algorithm: algorithm,
        conceptValueNum: valmethod,
        queryName: queryName,
        probVal: probVal,
        folder: query
      }
      docs = null

          Expression.find({folderName:query})
          .select("closesNum conceptCount isReadOnce dicByConcept dnf cnf fileName")
          .exec()
          .then(docs => {
            
            console.log(docs.length + " - "+ query)
            
            runMultipleExpression1(docs,tempObj)
            
          })
          .catch(err => {
            console.log(err)            
          })
    })
    .catch(err => {
      console.log(err)      
    })
}

{
    let query = "QueryName" //the boolean provenance of the query you want to run
    let probVal = 1 //the values set for each concept
    let algorithm = "choosenAlgorithm"

    runMultipleExpression(query,probVal,algorithm)
}

// deshpande   random    algo1    greedy    huristicAllen

