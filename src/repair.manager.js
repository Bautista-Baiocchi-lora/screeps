var utils = require('util')
var lastRun = Game.time
var rate = 50
var repairThreshold = 0.75
var repairGoal = 0.90

var wallRepairThreshold = 0.90
var wallRepairGoal =  700000

var repairHierarchy = [STRUCTURE_EXTENSION,STRUCTURE_CONTAINER,STRUCTURE_ROAD,STRUCTURE_RAMPART,STRUCTURE_WALL]

function sortByStructureHierarchy(a, b){
    return repairHierarchy.indexOf(a.type) - repairHierarchy.indexOf(b.type)
}

function sortByHits(a, b){
    return (a.repairGoal - a.hits)/a.repairGoal - (b.repairGoal - b.hits)/b.repairGoal
}

function getWallsToRepair(structures){ 
    return structures.filter((s) => s.hits < wallRepairGoal * wallRepairThreshold  && (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART))
    .map(s => {
        return {id: s.id, repairGoal: wallRepairGoal, type: s.structureType}
    })
}

function getStructuresToRepair(structures){ 
    return structures.filter((s) => s.hits < s.hitsMax * repairThreshold && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)
    .map(s => {
        return {id: s.id, repairGoal: s.hitsMax * repairGoal, type: s.structureType}
    })
}

function getStructures(roomName){
    return Game.rooms[roomName].find(FIND_STRUCTURES)
}


module.exports = {
    shouldScan: function(){
        return lastRun+rate < Game.time
    },
    scan: function(roomName){
    utils.log('Scanning for repair targets')
    var now = Game.time

    var allStructures = getStructures(roomName)
    var walls = getWallsToRepair(allStructures)
    var others = getStructuresToRepair(allStructures)

    var structures = [...walls, ...others, ...Memory.state.repairQueue]
    .filter(s => !Memory.state.activeRepairQueue.includes(s))
    .sort(sortByHits)// most damaged first
    .sort(sortByStructureHierarchy) //order by hierarchy

    Memory.state.repairQueue = _.uniq([...structures], 'id')
    
    utils.log(`Repair queue size: ${Memory.state.repairQueue.length}`)

    lastRun = now
    }
}