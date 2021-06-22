var harvester = require('harvester')
var builder = require('builder')
var utils = require('util')

//defaults to builder

module.exports = {
    run: function(creep){
         //go store
         if(creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity('energy')){
            creep.memory.harvesting = false
            utils.creepLog(creep, `SWITCH TO REPAIR`)
        }else if(!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.harvesting = true 
            utils.creepLog(creep, `SWITCH TO HARVEST ENERGY`)
        }

        if(creep.memory.harvesting){
            harvester.harvest(creep)
        }else{
            this.repair(creep)
        }
    },
    repair: function(creep){
        creep.say("repair")

        var structure = this.getStructure(creep)

        
        if(structure){
            if(structure.hits > structure.hitsMax * 0.9){
                utils.creepLog(creep, "Finished repairing.")
                creep.memory.repairTarget = undefined
            }else if(creep.repair(structure) == ERR_NOT_IN_RANGE){
                creep.say("Go Repair")
                creep.moveTo(structure)
            }
        }else{
            builder.run(creep)
        }
    },
    getStructure: function(creep){
        if(!creep.memory.repairTarget){
            creep.memory.repairTarget = Memory.state.repairQueue.pop()
        }

        return creep.memory.repairTarget ? Game.getObjectById(creep.memory.repairTarget) : undefined;
    },
    bodyParts: [WORK, CARRY, CARRY, MOVE, MOVE],
    spawn: function(spawnName){
        var name = `Repairer@${Game.time.toString()}`
        utils.log(`Spawning ${name}`)
        Game.spawns[spawnName].spawnCreep(this.bodyParts, name, {memory: {role: 'repairer', harvesting: true}})
    },
    canSpawn: function(spawnName){
        return Game.spawns[spawnName].store.getUsedCapacity("energy") >= utils.calculateCreepCost(this.bodyParts)
    }
}