var express = require('express');
var router = express.Router();
var Boolean  = require('../models/boolean')
var Probe  = require('../models/probe')
var Results = require('../models/result')
var Expression = require('../models/expression')
var probresult = require('../models/probeResult')
var fs = require('fs')
var bool = require('../public/experiments/boolean')


var folderList = ["Q10_1000_row",//*
                //"Q10_100_row/",//*
               "Q10_500_row",//*
                "Q10_50_row",//*
                //"Q10_all_row/",
                //"Q1_1000_row/",
                //"Q1_100_row/",
                "Q1_50_row",//*
                //"Q1_all_row/",
                "Q3_1000_row",
                "Q3_50_row",
                "Q3_100_row",//*
                "Q3_500_row",//*
                //"Q3_all_row/",
                "Q5_50_row",//*
                "Q5_100_row",
                "Q1_all_row_dnf/",
                "Q3_all_row_dnf/",
               "Q5_all_row_dnf/",
                "Q10_all_row_dnf/"
                //"Q6_1000_row/",
                //"Q6_100_row/",
                //"Q6_500_row/",
                //"Q6_50_row/",
                //"Q6_all_row/",
            ]

/* GET data listing. */
router.get('/', function(req, res, next) {

  Boolean.find()
    .exec()
    .then(docs => {
      res.render('resultsTable', { success: true , active : 'bool', docs: docs});
    })
    .catch(err => {
      res.render('resultsTable', { success: false , active : 'bool'});
    })
    
  });


router.get('/probsdata', function(req, res, next) {
  console.log(req.query.id)
  Probe.find({evaluationid: req.query.id})
  . exec()
    .then(docs => {
      //console.log(docs)
      console.log("*****************************************************************************")
      let expressions = []
      for (let index = 0; index < req.query.sumExpressions; index++) {
        expressions[index] = docs.filter(app => app.exp_num == index+1)
        //expressions[index].sort((a,b) => (a.probRound > b.probRound) ? 1 : ((b.probRound > a.probRound) ? -1 : 0));         
      }

      
      //console.log(expressions) 

      res.render('probeExpression', { success: true , active : 'bool', docs: expressions});
    })
    .catch(err => {
      res.render('probeTable', { success: false , active : 'bool'});
    })
});

router.get('/graph', function(req, res, next) {
  console.log(req.query.id)
  Probe.find({evaluationid: req.query.id })    
        .exec()
        .then(docs => {
          rounds = {}
          probes = {}
          docs.forEach(doc => {
            //console.log(doc.round in rounds)
            console.log(' round ' + doc.probRound)
            if(!(doc.probRound in rounds)){
              console.log('insert round ' + doc.probRound)
              rounds[doc.probRound] = []
              probes[doc.probRound] = {expressions : 0,
                                    terms: 0,
                                    clauses: 0} 
                               
            }
            //console.log(rounds)
            rounds[doc.probRound].push(doc)
            probes[doc.probRound].expressions += 1
              //console.log(doc.sumTerms)
              //console.log(doc.sumClauses)
              probes[doc.probRound].terms += doc.termsNum
              probes[doc.probRound].clauses += doc.closesNum
          });
          //console.log(probes)
          /*for (const [key, value] of Object.entries(rounds)) {
            console.log(key)
            value.forEach(exp => {
              
              probes[key].expressions += 1
              console.log(exp.sumTerms)
              console.log(exp.sumClauses)
              probes[key].terms += exp.sumTerms
              probes[key].clauses += exp.sumClauses
            }); 
          }*/
          //console.log(probes)
            
          res.render('graph', { title: 'Express' , active : 'index', results: probes});
        })
        .catch(err => {
            console.log(err)
            res.redirect('/');
        }); 
  
});

router.get('/barchart', function(req, res, next){
  console.log(req.query.id)
  
  res.render('barchart', { title: 'Express' , active : 'bool', results: "probes"});
}),


router.get('/grapfresults', function(req, res, next){
  let query = "Q3"
  let final = {"50": [], }//"100":[], "500":[], "1000":[]}
  let rows =  ["50"]//, "100", "500", "1000"] 
  //let queries = ["Q1", "Q3", "Q5", "Q10"]
  let algo = ["random",
  "deshpande",
  "huristicAllen"]

  rows.forEach(row => {
    
      probes = {}
      probresult.find({query: query, row: row})
      .exec()
      .then(docs => {
        probes["expressions"] = {}
        probes["terms"] = {}
        probes["clauses"] = {}
        probes["concepts"] = {}
        algo.forEach(alg => {
          probes["expressions"][alg] = []
          probes["terms"][alg] = []
          probes["clauses"][alg] = []
          probes["concepts"][alg] = []

          console.log(" query " + query + " row: " +row + " algo " + alg + " docs.length: " + docs.length)
          let algoResults = docs.filter(app => app.probmethod == alg);
          let max = Math.max.apply(Math, algoResults.map(function(o) { return o.round; }))
          console.log(max)

          for (let index = 0; index < 50; index++) {
            let temp = algoResults.filter(app => app.round == index+1);
            console.log(temp.length)
            probes["expressions"][alg][index] = {y : temp.reduce((s, a) => s + a.expressions, 0)/temp.length}
            probes["terms"][alg][index] = {y : temp.reduce((s, a) => s + a.terms, 0)/temp.length}
            probes["clauses"][alg][index] = {y : temp.reduce((s, a) => s + a.clauses, 0)/temp.length} 
            probes["concepts"][alg][index] = {y :temp.reduce((s, a) => s + a.concepts, 0)/temp.length} 
            console.log("--------------------------------")
            //console.log(probes["concepts"][alg][0])
              
            
          }
        });
        setTimeout(function(){ 
          res.render('graphresults', { title: 'Express' , active : 'bool', results: probes});
         }, 3000);
        

      })
      .catch(err => {
        console.log(err)
        res.redirect('/');
    }); 
    //res.render('graphresults', { title: 'Express' , active : 'bool', results: probes});
      
  
  });
  

    

  
 
}),

router.get('/getGraph',async function(req, res, next) {
  //var folders = fs.readdirSync('./public/tcp-h expressions');
  let r_byRows = []
  let final = {"50": [], "100":[], /*"100_noReadOnce":[], "100_ReadOnce":[],*/ "500":[], "1000":[], "all":[]}
  let rows =  ["50", "100", "500", "1000", "all"] //["100"]//
  let queries = ["Q1", "Q3", "Q5", "Q6", "Q10"]
  let algo = ["random",
  "deshpande",
  "huristicAllen",
  "algo1",
  "greedy"]
  let textFile = " query , rows ,algotithm ,probs ,  expressions ,  terms ,  clauses ,  trueEvaluations ,  falseEvaluations \n"
  //"random_noReadOnce",
 // "deshpande_noReadOnce",
 // "huristicAllen_noReadOnce",
 // "random_ReadOnce",
 // "deshpande_ReadOnce",
  //"huristicAllen_ReadOnce",]
  //console.log(folders)
  Results.find()
  .exec()
  .then(docs => {
    //console.log(docs)
    //sort documents by query rows
    docs.forEach(row => {
      //console.log(row)
      textFile += row.query+ ","+ row.rows+ ","+row.algotithm+ ","+row.probs+ ","+
      row.expressions+ ","+
      row.terms+ ","+
      row.clauses+ ","+
      row.trueEvaluations+ ","+
      row.falseEvaluations+ ","+'\n'
    })
    rows.forEach(row => {
      
      let temp_row = (docs.filter(app => app.rows == row))  
      //console.log(temp_row)
      algo.forEach(algo1 => {
        let alg = temp_row.filter(app => app.algotithm == algo1)
        //let algName = algo1.split('_')[0]//
        //let rowName = algo1.split('_').length > 1 ? row + '_' +algo1.split('_')[1] : row//
        let tempAlg = {showInLegend: true, legendText: algo1/*algName*/} 
        let tempData = []
        alg.forEach(element => {
          tempData.push({y: element.probs, label: element.query})        
        });
        //console.log(tempData)
        tempAlg.dataPoints = tempData
        //console.log(rowName)
        final[row/*Name*/].push(tempAlg)    
      });
     
    });
    
      
    fs.appendFile("finalresult.txt", textFile, function (err) {
      if (err) throw err;
      console.log( '---' +'Saved!');
  });  
    console.log(final)
    res.render('getGraph' , { title: 'Results' , active : 'multi', finalResults :final}) 
  })
  .catch(err => {
    console.log(err)
    res.render('resultsTable', { success: false , active : 'bool'});
  })
  
   
});

router.get('/getGraphMedian',async function(req, res, next) {
  //var folders = fs.readdirSync('./public/tcp-h expressions');
  let r_byRows = []
  let final = {"50": [], "100":[], /*"100_noReadOnce":[], "100_ReadOnce":[],*/ "500":[], "1000":[]}
  let rows =  ["50", "100", "500", "1000"] //["100"]//
  let queries = ["Q1", "Q3", "Q5", "Q6", "Q10"]
  let algo = ["random",
  "deshpande",
  "huristicAllen",
  "algo1",
  "greedy"]
  //"random_noReadOnce",
 // "deshpande_noReadOnce",
 // "huristicAllen_noReadOnce",
 // "random_ReadOnce",
 // "deshpande_ReadOnce",
  //"huristicAllen_ReadOnce",]
  //console.log(folders)
  Results.find()
  .exec()
  .then(docs => {

    //console.log(docs)
    //sort documents by query rows
    rows.forEach(row => {
     // console.log(row)
      let temp_row = (docs.filter(app => app.rows == row))  
      //console.log(temp_row)
      algo.forEach(algo1 => {
        let alg = temp_row.filter(app => app.algotithm == algo1)
       // console.log(alg)
        //let algName = algo1.split('_')[0]//
        //let rowName = algo1.split('_').length > 1 ? row + '_' +algo1.split('_')[1] : row//
        let tempAlg = {type : "bar" ,showInLegend: true, legendText: algo1/*algName*/} 
        let tempData = []
        alg.forEach(element => {
          tempData.push({y: element.probsMedian, label: element.query})        
        });
       // console.log(tempData)
        tempAlg.dataPoints = tempData
        //console.log(rowName)
        final[row/*Name*/].push(tempAlg)    
      });
     
    });
    
      
    
    console.log(final)
    res.render('getGraph' , { title: 'Results' , active : 'multi', finalResults :final}) 
  })
  .catch(err => {
    console.log(err)
    res.render('resultsTable', { success: false , active : 'bool'});
  })
  
   
});

router.get('/conceptStatistic', function(req, res, next) {

  diCbyFolder = {}
    
  Expression.find()
    .exec()
    .then(allExpression => {
      folderList.forEach (folder => { 
        diCbyFolder[folder] = {}
        let docs = allExpression.filter(app => app.folderName == folder)
        console.log(folder + " - "+ docs.length)
        let dicByConcept = {}
        docs.forEach(expression => {
            
            let dnf = bool.buildArrExpression(expression.dnf, false)
            let tempDic =  {}
            bool.getConceptReturn(dnf,tempDic)
            for (var key in tempDic) {
        
                if(dicByConcept.hasOwnProperty(key))
                    dicByConcept[key] += tempDic[key]
                else
                    dicByConcept[key] = tempDic[key]
            };
        });
        
        diCbyFolder[folder] ={sum: Object.keys(dicByConcept).reduce((sum,key)=>sum+parseFloat(dicByConcept[key]||0),0), count: Object.keys(dicByConcept).length}
        
    })
    setTimeout(function(){ // console.log(diCbyFolder)
      res.render('conceptStatistic', { success: false , active : 'index',results: diCbyFolder}); }, 5000);
   
  })
    .catch(err => {
      console.log(err)
      res.render('/', { success: false , active : 'index'});            
    })   
   
});

router.get('/readonce', function(req, res, next) {

  diCbyFolder = {}
    
  Expression.find()
    .exec()
    .then(allExpression => {
      folderList.forEach (folder => { 
        diCbyFolder[folder] = {}
        let docs = allExpression.filter(app => app.folderName == folder)
        console.log(folder + " - "+ docs.length)
        let dicByConcept = {}
        let ReadOnceCount = 0
        let notReadOnceCount = 0
        docs.forEach(expression => {
            let isReadOnce = true
            let dnf = bool.buildArrExpression(expression.dnf, false)
            let tempDic = {}  
            bool.getConceptReturn(dnf,tempDic)
            for (var key in tempDic) {        
                if(tempDic[key] > 1)
                  isReadOnce = false
            };
            if (isReadOnce)
              ReadOnceCount+=1
            else
              notReadOnceCount+=1

        });
        
        diCbyFolder[folder] ={all: docs.length, yas:ReadOnceCount, no: notReadOnceCount}
        
    })
    setTimeout(function(){  //console.log(diCbyFolder)
      res.render('readOnce', { success: false , active : 'index',results: diCbyFolder}); }, 5000);
   
  })
    .catch(err => {
      console.log(err)
      res.render('/', { success: false , active : 'index'});            
    })   
   
});




module.exports = router;
