module.exports = {

    chooseNextConcept : async function(expList){
        let dicByConcept = {}
        const calcEXP = async () => {   
            
			await asyncForEach(expList, async (exp) => { 
				Object.keys(exp.dicByConcept2).forEach(element => {
						dicByConcept[element] = 0
				});				   
			}); 

            dicByConcept = Object.keys(dicByConcept)
            let dicLength = dicByConcept.length
            let random = Math.floor(Math.random() * dicLength);
            
            return {choosen: dicByConcept[random], dicResult: JSON.stringify(dicByConcept)};
        }
        return await calcEXP()
        
        
    },
}


const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }