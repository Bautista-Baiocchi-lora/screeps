var utils = require('util')
var lastRun = Game.time
var rate = 50
var repairThreshold = 0.75
var repairGoal = 0.90

var wallRepairGoal =  500000

var repairHierarchy = [STRUCTURE_EXTENSION,STRUCTURE_CONTAINER,STRUCTURE_ROAD,STRUCTURE_RAMPART,STRUCTURE_WALL]

function sortByStructureHierarchy(a, b){
    return repairHierarchy.indexOf(a.type) - repairHierarchy.indexOf(b.type)
}

function sortByHits(a, b){
    return (a.repairGoal - a.hits)/a.repairGoal - (b.repairGoal - b.hits)/b.repairGoal
}

function getWallsToRepair(roomName){ 
    return Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: (s) => s.hits < wallRepairGoal && (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART)
    })
    .map(s => {
        return {id: s.id, repairGoal: wallRepairGoal, type: s.structureType}
    })
}

function getStructuresToRepair(roomName){ 
    return Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax * repairThreshold && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
    })
    .map(s => {
        return {id: s.id, repairGoal: s.hitsMax * repairGoal, type: s.structureType}
    })
}


module.exports = {
    shouldScan: function(){
        return lastRun+rate < Game.time
    },
    scan: function(roomName){
    utils.log('Scanning for repair targets')
    var now = Game.time

    var notWalls = getStructuresToRepair(roomName)
    var walls = getWallsToRepair(roomName)
    var structures = [...notWalls, ...walls, ...Memory.state.repairQueue]
    .filter(s => !Memory.state.activeRepairQueue.includes(s))
    .sort(sortByHits)// most damaged first
    .sort(sortByStructureHierarchy) //order by hierarchy

    Memory.state.repairQueue = _.uniq([...structures], 'id')
    
    utils.log(`Repair queue size: ${Memory.state.repairQueue.length}`)

    lastRun = now
    }
}