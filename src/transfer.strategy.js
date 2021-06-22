
module.exports = {
    transfer: function(creep){
        creep.say("transfer")

        switch(creep.memory.transferStrategy){
            case 'extension':
                this.toExtension(creep)
                break;
            case "controller":
            default:
                this.toController(creep)
                break
        }
    },
    toController: function(creep){
        creep.say("upgrade")
        var controller = creep.room.controller

        if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE){
            creep.say("Go upgrade")
            creep.moveTo(controller)
        }
    },
    toExtension: function(creep){
        creep.say("transfer")
        var extension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_EXTENSION && s.store.getFreeCapacity('energy') > 0
        })

        if(creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.say("Go to ext.")
            creep.moveTo(extension)
        }
    }
}