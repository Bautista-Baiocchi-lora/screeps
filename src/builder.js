var harvester = require('harvester')
var utils = require('util')

module.exports = {
    run: function (creep){
        if(creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity('energy')){
            creep.memory.harvesting = false
            utils.creepLog(creep, `SWITCH TO BUILD`)
        }else if(!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.harvesting = true 
            utils.creepLog(creep, `SWITCH TO HARVEST ENERGY`)
        }

        if(creep.memory.harvesting){
            harvester.harvest(creep)
        }else{
            this.build(creep)
        }
    },
    build: function(creep){
        creep.say("build")
        var site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)

        if(site){
            if(creep.build(site) == ERR_NOT_IN_RANGE){
                creep.say("Go Build")
                creep.moveTo(site)
            }
        }else{
            harvester.harvest(creep)
        }
    }, 
    bodyParts: [WORK, CARRY, CARRY, CARRY, MOVE],
    spawn: function(spawnName){
        var name = `Builder@${Game.time.toString()}`
        utils.log(`Spawning ${name}`)
        Game.spawns[spawnName].spawnCreep(this.bodyParts, name, {memory: {role: 'builder', harvesting: true}})
    },
    canSpawn: function(spawnName){
        return Game.spawns[spawnName].store.getUsedCapacity("energy") >= utils.calculateCreepCost(this.bodyParts)
    }
}