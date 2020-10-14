var bool = require('./boolean')

module.exports = {
    //sort the terms by their (cost) size and then choose concept one by one.
    chooseNextConcept : async function(expList){        

        let index = 0
        let termSize = Number.MAX_VALUE;
        let expNum = 0;
        let term = ""
        const getSmallestTerm = async () => {  

            await asyncForEach(expList, async (exp) => {
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
                
            });
            dnf_arr = null
            return {choosen: term[1], dicResult: JSON.stringify({})}
        }
        return await getSmallestTerm()
    },
}

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }