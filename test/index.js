const Luna = require('../lib/')
const lunaInstance = new Luna('src') 

console.log(lunaInstance.dir)
lunaInstance.getResult().then(res => {
    console.log(res)
})