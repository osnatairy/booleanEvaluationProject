var express = require('express');
var fs = require('fs');
var router = express.Router();
//var Boolean  = require('../models/boolean')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , active : 'index'});
});

router.get('/test', function(req, res, next) {
  res.render('testExpression', { title: 'Express' , active : 'test'});
});

router.get('/tcph', async function(req, res, next) { 

  var files = fs.readdirSync('./public/tcp-h expression');
  console.log(files)
  res.render('tcph', { title: 'Express' , active : 'tcph', queries: files});
});

router.get('/multiEvaluation',async function(req, res, next) {
  var folder = fs.readdirSync('./public/tcp-h expressions');
  console.log(folder)
  res.render('multiEvaluation-tcph' , { title: 'Multiple Evaluation' , active : 'multi', queries: folder})  
});






module.exports = router;


const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
