var bool = require('./boolean')

module.exports = {
    generalDic : {},
    dicByConcept: {},
    cnf : "",
    dnf : "",

    chooseNextConcept : async function(expList,raund){
        if(raund % 2 == 0){
            let concept = await this.algo0(expList)
            //console.log(" ************************* algo 0 concept: "+ concept + " ------- " +raund)
            return {choosen: concept, dicResult: JSON.stringify(this.generalDic)}
             
        }
        else{
            let concept = await this.algo1(expList)
            //console.log(" ************************* algo 1 concept: "+ concept + " ------- " +raund)
            return {choosen: concept, dicResult: JSON.stringify(this.generalDic)}
        }

    },

    algo0 : async function(expList){
        let index = 1
        this.generalDic = {}
        const calcEXP = async () => {            
            await asyncForEach(expList, async (exp) => { 
                
                if (exp.updateDic){
                    let dnf_arr = bool.buildArrExpression(exp.dnf, false)
                    await this.calcG(dnf_arr, exp.dicByConcept2);
                    exp.updateDic = false;
                    dnf_arr = null
                }
                Object.keys(exp.dicByConcept2).forEach(element => {
                    if(this.generalDic.hasOwnProperty(element))
                        this.generalDic[element] += exp.dicByConcept2[element]
                    else
                        this.generalDic[element] = exp.dicByConcept2[element]
                });
                index++;
                               
            });
            return this.sortDic(); 
        }
        return await calcEXP()

    },
    //sort the terms by their (cost) size and then choose concept one by one.
    algo1 : async function(expList){
        let index = 0
        let termSize = Number.MAX_VALUE;
        let expNum = 0;
        let term = ""
        this.generalDic = {}
        const getSmallestTerm = async () => {  

            await asyncForEach(expList, async (exp) => {

                Object.keys(exp.dicByConcept2).forEach(element => {
                    if(!this.generalDic.hasOwnProperty(element))
                        this.generalDic[element] = 0
                });

                index = 0
                let dnf_arr = bool.buildArrExpression(exp.dnf, false)
                dnf_arr.forEach(arr => {
                    if(index!= 0){
                        if(arr.length < termSize){                          

                            termSize = arr.length
                            expNum = exp.exp_num
                            term = arr
                        }
                    }
                    index++
                });
                dnf_arr = null               
            });
           
            return term[1]

        }
        return await getSmallestTerm()
    },

    calcG : function(dnf, dicByConcept){
    
        let li = this.calcLi(dnf)
   
        let keys = Object.keys(dicByConcept)
        keys.forEach(concept => {
         
          let dnfExp0 = bool.condensedDNF_0(dnf, concept)
          let dnfExp1 = bool.condensedDNF_1(dnf, concept,false)
          
          let temp_gi0 = this.calcLi(dnfExp0)
          let temp_gi1 = this.calcLi(dnfExp1)
       
          let gi1 = li -( 0.5*(temp_gi0 + 0.5* temp_gi1))
        
          dicByConcept[concept] = gi1  
        
        })      
    },

     //calc number of clauses (disjunctions)
     calcLi : function(exp){        
        if(exp == "")
            return 0
        var li = exp.length
        return li
    },

     //sort the dictionary by score
     sortDic : function(){         
        var sortable = [];
      
       let choosen = Object.keys(this.generalDic)[0]
        let maxNum = this.generalDic[choosen]

        for (var val in this.generalDic) {
            if (this.generalDic[val] > maxNum){
                maxNum = this.generalDic[val] 
                choosen = val
            }
            sortable.push([val, this.generalDic[val]]);
        }
      
        return choosen//concept
    }

}

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }