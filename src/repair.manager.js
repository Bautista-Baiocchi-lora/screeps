var utils = require('util')
var lastRun = Game.time
var rate = 40 //change back
var repairThreshold = 0.75


module.exports = {
    shouldScan: function(){
        return lastRun+rate < Game.time
    },
    scan: function(){
    utils.log('Scanning for repair targets')
    var now = Game.time
    if(lastRun+rate >= now){
        return
    }

    var structures = Game.rooms['W48S51'].find(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax * repairThreshold && s.structureType != STRUCTURE_WALL
    }).map(s => s.id)


    Memory.state.repairQueue = _.uniq([...Memory.state.repairQueue, ...structures])

    utils.log(`Repair queue size: ${Memory.state.repairQueue.length}`)

    lastRun = now
    }
}