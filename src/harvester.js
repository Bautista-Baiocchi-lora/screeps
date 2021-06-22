var utils = require('util')
var harvestStrategy = require('harvest.strategy')
var transferStrategy = require('transfer.strategy')

module.exports = {
    run: function run(creep) {
        //go store
        if(creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity('energy')){
            creep.memory.harvesting = false
            utils.creepLog(creep, `SWITCH TO TRANSFER ENERGY`)
        }else if(!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.harvesting = true 
            utils.creepLog(creep, `SWITCH TO HARVEST ENERGY`)
        }

        if(creep.memory.harvesting){
            harvestStrategy.harvest(creep)
        }else{
            transferStrategy.transfer(creep)
        }
    },
    bodyParts: [WORK, WORK, CARRY, MOVE],
    spawn: function(spawnName){
        var name = `Harvester@${Game.time.toString()}`
        utils.log(`Spawning ${name}`)
        Game.spawns[spawnName].spawnCreep(this.bodyParts, name, {memory: {role: 'harvester', harvesting: true, harvestStrategy: 'active_source', transferStrategy: 'controller'}})
    },
    canSpawn: function(spawnName){
        return Game.spawns[spawnName].store.getUsedCapacity("energy") >= utils.calculateCreepCost(this.bodyParts)
    }
}