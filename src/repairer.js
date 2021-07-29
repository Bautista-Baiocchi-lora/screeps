
var harvestStrategy = require('harvest.strategy')
var builder = require('builder')
var utils = require('util')


function getStructure(creep) {
    if (!creep.memory.repairTarget) {
        var target = Memory.state.repairQueue.shift()
        creep.memory.repairTarget = target
        if(target){
            Memory.state.activeRepairQueue.push(target)
        }
    }
    return creep.memory.repairTarget ? Game.getObjectById(creep.memory.repairTarget.id) : undefined;
}

module.exports = {
    run: function (creep) {
        if (creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity('energy')) {
            creep.memory.harvesting = false
            utils.creepDebug(creep, `SWITCH TO REPAIR`)
        } else if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true
            utils.creepDebug(creep, `SWITCH TO HARVEST ENERGY`)
        }

        if (creep.memory.harvesting) {
            harvestStrategy.harvest(creep)
        } else {
            this.repair(creep)
        }
    },
    repair: function (creep) {
        creep.say("repair")

        var structure = getStructure(creep)

        if (structure) {
            if (structure.hits > creep.memory.repairTarget.repairGoal) {
                utils.creepDebug(creep, "Finished repairing.")
                Memory.state.activeRepairQueue = _.reject(Memory.state.activeRepairQueue, s => s.id === creep.memory.repairTarget.id);
                creep.memory.repairTarget = undefined
            } else if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                creep.say("Go Repair")
                creep.moveTo(structure)
            }
        } else {
            builder.run(creep)
        }
    },
    bodyParts: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    spawn: function (spawnName) {
        var name = `Repairer@${Game.time.toString()}`
        utils.log(`Spawning ${name} (${utils.calculateCreepCost(this.bodyParts)})`)
        Game.spawns[spawnName].spawnCreep(this.bodyParts, name, { memory: { role: 'repairer', harvesting: true, harvestStrategy: 'active_source', transferStrategy: 'extension' , debug: false  } })
    },
    canSpawn: function (spawnName) {
        return Game.spawns[spawnName].room.energyAvailable >= utils.calculateCreepCost(this.bodyParts)
    }
}