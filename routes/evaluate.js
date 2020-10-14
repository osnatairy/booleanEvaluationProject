var express = require('express');
var router = express.Router();
var fs = require('fs');

const mongoose = require('mongoose')
var ProbConceptValue = require('../models/probconceptvalue')
var Expression = require('../models/expression')


var singleprobingProcess = require('../public/experiments/singleEvaluationProcess');
var probingProcess = require('../public/experiments/MultipleEvaluationProcess');
probingProcess.index = 0

router.get('/analyze_tcph1', async function(req,res){

    console.log(req.session.tempObj)
    let queryfile = req.session.tempObj.query
    let algorithm = req.session.tempObj.algorithm;
    let conceptValueNum = req.session.tempObj.conceptValueNum;
    let queryName = queryfile.split('_')[1]
    
      let probVal = req.session.tempObj.probVal
      
  
          console.log(probVal)
          console.log( " " + probingProcess.index +".  1. ******************* <- index.js -> pre analyze -> startTCPH_EvaluationProcess -> *********************")
          ///let process = new probingProcess()
          //process.startTCPH_EvaluationProcess(queryfile,algorithm,conceptValueNum)
          probingProcess.allProbingProcess = [];
  
          probingProcess.probing = {}   
          probingProcess.expressionList=[];
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

         probingProcess.index++;
         folder = "./public/tcp-h expression"
         await probingProcess.startTCPH_MultipleEvaluationProcess(folder,[queryfile],algorithm,probVal,conceptValueNum,queryName,false)
        //wait(5000)
        console.log(" " + probingProcess.index +". ******************* <- index.js -> post analyze -> startTCPH_EvaluationProcess -> *********************")
        //console.dir(probingProcess.allProbingProcess)

        res.render('resultsTable', { title: 'resultsTable' , active : 'data'});
        
  

  });
router.post('/analyze_tcph',  function(req,res){
  console.log(req.body.query)
  let queryfile = req.body.query  
  let conceptValueNum = req.body.conceptValueNum;
  let queryName = queryfile.split('_')[1]
  ProbConceptValue.find({experimenteNum: conceptValueNum, queryName: queryName})
  .exec()
  .then(docs => {
    console.log("docs")
    let probVal = Object.assign({}, ...docs.map(({conceptName, value}) => ({[conceptName]: value})))
    console.log(probVal)
    //req.body.probVal = probVal
      let tempObj = {
        query: req.body.query,
        algorithm: req.body.algorithm,
        conceptValueNum:req.body.conceptValueNum,
        queryName: queryfile.split('_')[1],
        probVal: probVal,
      }
      //req.session = {}
      req.session.tempObj = tempObj
        console.log(req.session.tempObj)
        res.redirect('/evaluate/analyze_tcph1');
    
  })
  .catch(err => {
    console.log(err)
    res.redirect('/');
  })
  
})



router.get('/multiEvaluation1',async function(req, res, next) {
   //console.log(req.session.tempObj)
    let algorithm = req.session.tempObj.algorithm;//"deshpande";

    let queryName = req.session.tempObj.queryName
    var files = fs.readdirSync("./public/tcp-h expressions/"+req.session.tempObj.folder+"/");
    probingProcess.allProbingProcess = [];
  
    console.log(req.session.expressions.length + " - ")
    probingProcess.probing = {}   
    probingProcess.expressionList=[];
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
    
    probingProcess.folder = req.session.tempObj.folder
    probingProcess.algorithm = req.session.tempObj.algorithm
    probingProcess.expressionList = req.session.expressions
    probingProcess.conceptValueNum = req.session.tempObj.conceptValueNum
    req.session.expressions = null
    probingProcess.conceptValues = req.session.tempObj.probVal
    req.session.tempObj.probVal = null
    probingProcess.queryName = queryName
    probingProcess.row = req.session.tempObj.folder.split('_')[1]
    probingProcess.index++;
   
    console.log( " " + probingProcess.index +". 1. ******************* <- index.js -> pre analyze -> startTCPH_EvaluationProcess -> *********************")
    await probingProcess.startTCPH_MultipleEvaluationProcess()
        
    console.log(" " + probingProcess.index +". LAST. ******************* <- index.js -> post analyze -> startTCPH_EvaluationProcess -> *********************")
    console.log(probingProcess.t_arr)
    console.log(probingProcess.f_arr)
    res.render('finishProbe', { title: 'resultsTable' , active : 'data' ,queryName:req.session.tempObj.queryName,algorithm:req.session.tempObj.algorithm,conceptValueNum:req.session.tempObj.conceptValueNum});
   
    
    
  });
  router.post('/multiEvaluation',async function(req, res, next) {

    let queryName = req.body.query.split('_')[0].replace('Q', 'query')
    
    ProbConceptValue.find({experimenteNum: req.body.valmethod, queryName: queryName})
    .exec()
    .then(docs => {
      console.log("docs")
      let probVal = Object.assign({}, ...docs.map(({conceptName, value}) => ({[conceptName]: value})))
     
      let tempObj = {
        algorithm: req.body.algorithm,
        conceptValueNum:req.body.valmethod,
        queryName: queryName,
        probVal: probVal,
        folder: req.body.query
      }
      docs = null
        //req.session = {}
        req.session.tempObj = tempObj
          //console.log(req.session.tempObj)
          Expression.find({folderName:req.body.query})
          .select("closesNum conceptCount isReadOnce dicByConcept dnf cnf fileName")
          .exec()
          .then(docs => {
            req.session.expressions = docs
            docs = null
            console.log(req.session.expressions.length + " - "+ req.body.query)
            
            res.redirect('/evaluate/multiEvaluation1');
          })
          .catch(err => {
            console.log(err)
            res.redirect('/');
          })
       
      
    })
    .catch(err => {
      console.log(err)
      res.redirect('/');
    })
    
  });



  router.get('/test_loop', async function(req, res, next) {

    var files = fs.readdirSync('./public/tcp-h expressions/100-rows');
    console.log(files)
  
    let algorithm = "deshpande";
    let conceptValueNum ="random";
    
  
    let i = 1;
    const start = async () => {
      await asyncForEach(files, async (queryfile) => {
        probingProcess.allProbingProcess = [];
  
         probingProcess.startTime = 0;
         probingProcess.endTime  = 0;
     
         probingProcess.probing = {}
         probingProcess.index++;
         console.log( " " + probingProcess.index +". 1. ******************* <- index.js -> pre analyze -> startTCPH_EvaluationProcess -> *********************")
         await probingProcess.startTCPH_EvaluationProcess("100-rows/"+queryfile,algorithm,valmethod)
         console.log(" " + probingProcess.index +". LAST. ******************* <- index.js -> post analyze -> startTCPH_EvaluationProcess -> *********************")
         
        });
      console.log('Done');
    }
    start();
    
  
    res.render('resultsTable', { title: 'resultsTable' , active : 'data'});
  });

router.post('/analyze', function(req,res){
    console.log(req.body.exp)
    let expression = req.body.exp;
    let algorithm = req.body.algorithm;
    let conceptValueNum = req.body.conceptValueNum;
    probingProcess.startEvaluationProcess(expression,algorithm,conceptValueNum)

    res.render('results', {results: probingProcess.allProbingProcess})
})

  module.exports = router;
  