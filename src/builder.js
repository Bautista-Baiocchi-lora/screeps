var harvestStrategy = require('harvest.strategy')
var utils = require('util')

module.exports = {
    run: function (creep) {
        if (creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity('energy')) {
            creep.memory.harvesting = false
            utils.creepDebug(creep, `SWITCH TO BUILD`)
        } else if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true
            utils.creepDebug(creep, `SWITCH TO HARVEST ENERGY`)
        }

        if (creep.memory.harvesting) {
            harvestStrategy.harvest(creep)
        } else {
            this.build(creep)
        }
    },
    build: function (creep) {
        creep.say("build")
        var site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)

        if (site) {
            if (creep.build(site) == ERR_NOT_IN_RANGE) {
                creep.say("Go Build")
                creep.moveTo(site)
            }
        } else {
            harvestStrategy.harvest(creep)
        }
    },
    bodyParts: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    spawn: function (spawnName) {
        var name = `Builder@${Game.time.toString()}`
        utils.log(`Spawning ${name} (${utils.calculateCreepCost(this.bodyParts)})`)
        Game.spawns[spawnName].spawnCreep(this.bodyParts, name, { memory: { role: 'builder', harvesting: true, harvestStrategy: 'active_source', transferStrategy: 'extension', debug: false } })
    },
    canSpawn: function (spawnName) {
        return Game.spawns[spawnName].room.energyAvailable >= utils.calculateCreepCost(this.bodyParts)
    }
}