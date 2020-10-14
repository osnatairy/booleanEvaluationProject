module.exports = {
    index : 0,

    //get string expression and convert it to 2D array expression
    buildArrExpression: function(exp_str, isCNF){
        let exp_arr = []
        if(exp_str == "")
            return exp_arr
        if(isCNF){
            exp_arr.push(["&"])
            let terms = exp_str.split('&')        
            terms.forEach(term => {
                term = term.trim()
                if(term[0] == '!')
                    term = term.replace('!', '!| ')
                term = term.replace('(', '').replace(')', '').trim()
                let concepts = term.split('|')
                for (let i = 0; i < concepts.length; i++) {
                    concepts[i] = concepts[i].trim();
                    
                }
                concepts.unshift('|')
                exp_arr.push(concepts)
            });
        }
        else{
            exp_arr.push("|")
            let clauses = exp_str.split('|')        
            clauses.forEach(clause => {
                clause = clause.trim()   
                clause = clause.replace('(', '').replace(')', '').trim()
                let concepts = clause.split('&')
                for (let i = 0; i < concepts.length; i++) {
                    concepts[i] = concepts[i].trim();                    
                }
                concepts.unshift('&')
                exp_arr.push(concepts)
            });        
        }
        return exp_arr;
    },

    buildStrExpression : function(exp_arr){

        if(exp_arr.length == 0)
            return "";
        let exp_str = ""
        for (let i = 1; i < exp_arr.length; i++) {
            let innerSign = exp_arr[i][0]
            let temp_str = ""       
            for (let j = 1; j < exp_arr[i].length; j++) {
                
                temp_str += exp_arr[i][j].trim() + ' ' + innerSign +' ';                
            }             
            temp_str = temp_str.slice(0, -3)
            if(exp_arr[i].length > 2){
                temp_str = '(' + temp_str.trim() + ')'
            }            
            exp_str += temp_str + '\n' + ' '+ exp_arr[0] + ' '        
        }
        exp_str = exp_str.slice(0, -3)  
        
        return exp_str
    },

    //check if expression is CNF
    isExpCNF : function(exp_arr){
        if(exp_arr[0] == '|')
            return false
        for (let i = 1; i < exp_arr.length; i++) {
            if(exp_arr[i][0] == '&'){
                return false
            }
        }
        return true;
    },

    //check if expression is DNF
    isExpDNF : function(exp_arr){
        if(exp_arr[0] == '&')
            return false
        for (let i = 1; i < exp_arr.length; i++) {
            if(exp_arr[i][0] == '|'){
                return false
            }
        }
        return true;
    },

    //remove duplicate concepts from terms or clouses
    removeDuplicateConcept : function(exp_arr){
        for (let i = 1; i < exp_arr.length; i++) {
            for (let j = 0; j < exp_arr.length; j++) {
                exp_arr[j] = Array.from(new Set(exp_arr[j])) ;            
            }
        }
        return exp_arr
    },
  
    //remove duplicate terms or clouses from the expression
    multiDimensionalUnique : function (arr) {
        var uniques = [];
        var itemsFound = {};
        for(var i = 0, l = arr.length; i < l; i++) {
            var stringified = JSON.stringify(arr[i]);
            if(itemsFound[stringified]) { continue; }
            uniques.push(arr[i]);
            itemsFound[stringified] = true;
        }
        return uniques;
    },

    //condesed dnf with concept = 0
    condensedDNF_0 : function(exp, concept, simplify = true){
        
        if(exp.length == 0)
            return exp
        concept = concept.trim()
        let new_exp = []
        new_exp.push(exp[0])
        for (let i = 1; i < exp.length; i++) {
            let element = exp[i];
            isConceptInCNF = false
            for (let j = 1; j < element.length; j++) {
                let element2 = element[j].trim();
                
                if(concept == element2){
                    
                    isConceptInCNF = true
                }                
            }
            if (!isConceptInCNF) {
                new_exp.push(element)
               
            } 
        }
        if(simplify){
            if(new_exp.length > 1)
                new_exp = this.optimal(new_exp,false)
        }
        return new_exp        
    },

    //condesed dnf with concept = 1
    condensedDNF_1 : function(exp, concept, simplify = true){

        if(exp.length == 0)
            return exp

        let new_exp = []
        new_exp.push(exp[0])


        concept = concept.trim()
        for (let i = 1; i < exp.length; i++) {
            let element = exp[i].map((x) => x);
            element = element.remove(concept)
            if (element.length == 1){
                new_exp = []
                new_exp.push(exp[0])
                return new_exp
            }
            else
                new_exp.push(element)

        }
       if(simplify){
          
            if(new_exp.length > 1){                    
                    new_exp = this.optimal(new_exp, false)                   
                }
        }
        return new_exp        
        
    },

    //condesed cnf with concept = 1
    condensedCNF_1 : function(exp, concept, simplify = true){
        if(exp.length == 0)
            return exp
        concept = concept.trim()
        let new_exp = []
        new_exp.push(exp[0])
        for (let i = 1; i < exp.length; i++) {
            let element = exp[i];
            isConceptInDNF = false
            for (let j = 1; j < element.length; j++) {
                let element2 = element[j].trim();
               
                if(concept == element2){                    
                    isConceptInDNF = true
                }                
            }
            if (!isConceptInDNF) {
                new_exp.push(element)
            } 
        }
     
        if(simplify)
        {    if(new_exp.length > 1)
            new_exp = this.optimal(new_exp, true)}
        return new_exp 
    },

    //condesed Cnf with concept = 0
    condensedCNF_0 : function(exp, concept, simplify = true){
        if(exp.length == 0)
            return exp

        let new_exp = []
        new_exp.push(exp[0])


        concept = concept.trim()
        for (let i = 1; i < exp.length; i++) {
            let element = exp[i].map((x) => x);
            element = element.remove(concept)
            if (element.length == 1){
                new_exp = []
                new_exp.push(exp[0])
                return new_exp
            }
            else
                new_exp.push(element)
        }
      
        if(simplify){           
            if(new_exp.length > 1)    {               
                new_exp = this.optimal(new_exp, true)            
            }
        }
        return new_exp        
    },


    //remove variables which has finit value (true/false)
    simplifyExp: function(approvalProbs, cnf_str, dnf_str, num, alg = ""){
      
        let dnf = this.buildArrExpression(dnf_str, false)
        let cnf = this.buildArrExpression(cnf_str, true)
     
        let t = []
        let f = []
        let isEvaluateTrue = false
        let isEvaluateFalse = false
        let cnf_len = cnf.length
        let dnf_len = dnf.length
        if(approvalProbs.length > 0){
            let approvalProbsTrue = approvalProbs.filter(app => app.value == true)
            let approvalProbsFalse = approvalProbs.filter(app => app.value == false)
            approvalProbsTrue.forEach(apt => {
                cnf = this.condensedCNF_1(cnf, apt.conceptName)
                //update the dnf with true value of a concept
                dnf = this.condensedDNF_1(dnf, apt.conceptName)
            })

            if((cnf.length <= 1 &&  cnf_len != cnf.length) ||( dnf.length <= 1 && dnf_len != dnf.length)){              
                isEvaluateTrue = true
                t.push(num)             
            }           
            approvalProbsFalse.forEach(apf =>{                          
                cnf = this.condensedCNF_0(cnf, apf.conceptName)             
                //update the dnf with false value of a concept
                dnf = this.condensedDNF_0(dnf, apf.conceptName)
               
            })
          
            if((cnf.length <= 1 &&  cnf_len != cnf.length) ||( dnf.length <= 1 && dnf_len != dnf.length)){
                
                if (!isEvaluateTrue){                   
                    isEvaluateFalse = true
                    f.push(num)
                }
            }
        
            if(cnf.length > 0)
                cnf = this.checkForEmptyTermsClauses(cnf)
            if(dnf.length > 0)
                dnf = this.checkForEmptyTermsClauses(dnf)
            
        }
        let dictionary = {}
        if (alg == "greedy"){
            this.getConceptReturn(dnf,dictionary) 
            this.getConceptReturn(cnf, dictionary)
        }
        else
        {
            this.getConceptName(dnf, dictionary) 
            this.getConceptName(cnf, dictionary)
        }
        let result = {dic : dictionary ,dnf: dnf, cnf:cnf,isEvaluateTrue : isEvaluateTrue, isEvaluateFalse : isEvaluateFalse, t_arr : t, f_arr: f}
     
        return result
    },

    checkForEmptyTermsClauses : function(exp){
        let new_exp = []
        new_exp.push(exp[0])
        for (let i = 1; i < exp.length; i++) {
            if(exp[i].length > 1)
                new_exp.push(exp[i])            
        }
        if(new_exp.length == 1)
            return []
        return new_exp
    },

    count_terms : function(exp){
        if(exp == "")
            return 0
        let count = exp.split('&').length
        return count
    },

    count_clauses : function(exp){
        if(exp == "")
            return 0
        let count = exp.split('|').length
        return count
    },

    getConceptName : function(exp_arr,dic){
        
        for (let i = 1; i < exp_arr.length; i++) {
            for (let j = 1; j < exp_arr[i].length; j++) {
                dic[exp_arr[i][j]] = 0                
            }            
        }
    },
    getConceptReturn : function(exp_arr,dic){
        
        for (let i = 1; i < exp_arr.length; i++) {
            for (let j = 1; j < exp_arr[i].length; j++) {
                if (dic.hasOwnProperty(exp_arr[i][j]))
                    dic[exp_arr[i][j]] +=1
                else
                    dic[exp_arr[i][j]] = 1                
            }            
        }
    },

    optimal: function(exp_arr,isCNF){
        let allCombo = {}
        let maxLength = 0
        let minLength = Number.MAX_VALUE
        for (let i = 1; i < exp_arr.length; i++) {
            if(exp_arr[i].length > maxLength)
                maxLength = exp_arr[i].length
                if(exp_arr[i].length < minLength)
                minLength = exp_arr[i].length
            allCombo[exp_arr[i].slice(1, exp_arr[i].length)] = 0;            
        }
        if (maxLength == minLength){
            allCombo = {}
            return exp_arr
        }
        for (arr in allCombo){
           
            const currArr = arr.split(',');

            for (arr2 in allCombo){
                const currArr2 = arr2.split(',');
                
                if(currArr2.length > currArr.length ){
                  
                    if(currArr.every(item => currArr2.indexOf(item) !== -1)){                     
                        delete allCombo[currArr2]
                    }    
                }
            }
        }
        exp_arr = this.convert2Darray(allCombo,isCNF)
        allCombo = null
        return exp_arr
    },

    convert2Darray: function(arr,isCNF){
        arr = Object.keys(arr)
        let exp_arr = []

        if(isCNF){
            exp_arr.push(["&"])                  
            arr.forEach(term => {
                term = term.split(',')
                
                term.unshift('|')
                exp_arr.push(term)
            });
        }
        else{
            exp_arr.push("|")     
            arr.forEach(clause => {
                clause = clause.split(',')                
                clause.unshift('&')
                exp_arr.push(clause)
            });        
        }
        arr = null
        return exp_arr;
    },

}

function deleteRow(arr, row) {
    arr = arr.slice(0); // make copy
    arr.splice(row - 1, 1);
    return arr;
 }

 //check if two arrays have the same values
 function arraysEqual(_arr1, _arr2) {
    if (!Array.isArray(_arr1) || ! Array.isArray(_arr2) || _arr1.length !== _arr2.length)
      return false;

    var arr1 = _arr1.concat().sort();
    var arr2 = _arr2.concat().sort();

    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i])
            return false;
    }
    return true;
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};



