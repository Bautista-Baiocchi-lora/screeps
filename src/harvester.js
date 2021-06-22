var utils = require('util')

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
            this.harvest(creep)
        }else{
            this.transfer(creep)
        }
    },
    transfer: function transfer(creep) {
        creep.say("upgrade")
        var controller = creep.room.controller

        if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE){
            creep.say("Go upgrade")
            creep.moveTo(controller)
        }
    },
    harvest: function harvest(creep){
        creep.say("harvest")
        var resource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)

        if(creep.harvest(resource) == ERR_NOT_IN_RANGE){
            creep.say("Go harvest")
            creep.moveTo(resource)
        }
    },
    bodyParts: [WORK, WORK, CARRY, MOVE],
    spawn: function(spawnName){
        var name = `Harvester@${Game.time.toString()}`
        utils.log(`Spawning ${name}`)
        Game.spawns[spawnName].spawnCreep(this.bodyParts, name, {memory: {role: 'harvester', harvesting: true}})
    },
    canSpawn: function(spawnName){
        return Game.spawns[spawnName].store.getUsedCapacity("energy") >= utils.calculateCreepCost(this.bodyParts)
    }
}