var utils = require('util')
var harvestStrategy = require('harvest.strategy')
var transferStrategy = require('transfer.strategy')

module.exports = {
    run: function run(creep) {
        //go store
        if (creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity('energy')) {
            creep.memory.harvesting = false
            utils.creepDebug(creep, `SWITCH TO TRANSFER ENERGY`)
        } else if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true
            utils.creepDebug(creep, `SWITCH TO HARVEST ENERGY`)
        }

        if (creep.memory.harvesting) {
            harvestStrategy.harvest(creep)
        } else {
            transferStrategy.transfer(creep)
        }
    },
    bodyParts: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    spawn: function (spawnName) {
        var name = `Harvester@${Game.time.toString()}`
        utils.log(`Spawning ${name} (${utils.calculateCreepCost(this.bodyParts)})`)
        Game.spawns[spawnName].spawnCreep(this.bodyParts, name, { memory: { role: 'harvester', harvesting: true, harvestStrategy: 'active_source', transferStrategy: 'extension', debug: false  } })
    },
    canSpawn: function (spawnName) {
        return Game.spawns[spawnName].room.energyAvailable >= utils.calculateCreepCost(this.bodyParts)
    }
}