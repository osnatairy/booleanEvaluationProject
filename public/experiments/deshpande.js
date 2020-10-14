var bool = require('./boolean')

module.exports = {

    chooseNextConcept : async function(expList){
       
        let index = 1
        let generalDic = {}
        const calcEXP = async () => {            
          
            expList.forEach(exp => {
                console.log(exp.exp_num)
                let cnf_arr = bool.buildArrExpression(exp.cnf, true)
                let dnf_arr = bool.buildArrExpression(exp.dnf, false)
               
                if (exp.updateDic){
                    this.calcG(cnf_arr,dnf_arr,exp.dicByConcept2);
                    exp.updateDic = false;
                }
                
                //console.log(" 15. ********************* deshpande -> finish calcG  ******************************")
                Object.keys(exp.dicByConcept2).forEach(element => {
                    if(generalDic.hasOwnProperty(element))
                        generalDic[element] += exp.dicByConcept2[element]
                    else
                        generalDic[element] = exp.dicByConcept2[element]
                });
                index++;
            });
            cnf_arr = null
            dnf_arr = null
            return this.sortDic(generalDic); 
        }
        return await calcEXP()   
    
    },
   
    calcG : function(cnf, dnf, dicByConcept){
    
        let mi = this.calcMi(cnf)
        let li = this.calcLi(dnf)
     
        let keys = Object.keys(dicByConcept)
        keys.forEach(concept => {
       
          let dnfExp = bool.condensedDNF_0(dnf, concept)
          let cnfExp = bool.condensedCNF_0(cnf, concept,false)

      
          let temp_gi0 = this.calcLi(dnfExp)
          let temp_gi1 = this.calcMi(cnfExp)
         
          let gi0 = ( temp_gi0)*( temp_gi1)
          
          cnfExp = bool.condensedCNF_1(cnf, concept)
          dnfExp = bool.condensedDNF_1(dnf, concept,false)

          temp_gi0 = this.calcLi(dnfExp)
          temp_gi1 = this.calcMi(cnfExp)
          
          let gi1 = (temp_gi0) * (temp_gi1)          

          let gi = (mi * li) - (0.5 * (gi0) + 0.5 * (gi1))
          dicByConcept[concept] = gi  
            
        })
       
    },
    
    //calc number of terms (conjunctions)
    calcMi : function(exp){
       
        if(exp == "")
            return 0
        var mi = exp.length-1
        return mi
    },
     //calc number of clauses (disjunctions)
    calcLi : function(exp){
       
        if(exp == "")
            return 0
        var li = exp.length-1
        return li
    },

    //sort the dictionary by score
    sortDic : function(generalDic){  
        
        var sortable = [];        
        let choosen = Object.keys(generalDic)[0]
        let maxNum = generalDic[choosen]

        for (var val in generalDic) {
            if (generalDic[val] > maxNum){
                maxNum = generalDic[val] 
                choosen = val
            }
            sortable.push([val, generalDic[val]]);
        }
        return {choosen: choosen, dicResult: JSON.stringify(generalDic)}
    }
}
//console.log("********** chooseNextConcept exp length = "+expList.length+ " **********")
const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }