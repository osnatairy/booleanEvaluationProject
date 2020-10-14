module.exports = {
    generalDic : {},

    //sort the terms by their (cost) size and then choose concept one by one.
    chooseNextConcept : async function(expList){

        this.generalDic = {}
        const getSmallestTerm = async () => {  

            await asyncForEach(expList, async (exp) => {
              
                Object.keys(exp.dicByConcept2).forEach(element => {
                    if(!this.generalDic.hasOwnProperty(element))
                        this.generalDic[element] = exp.dicByConcept2[element]
                    else
                        this.generalDic[element] +=exp.dicByConcept2[element]
                });               
            });           
            return this.sortDic()
        }
        return await getSmallestTerm()    
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
        return  {choosen: choosen, dicResult: JSON.stringify(this.generalDic)}
    }
}

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }