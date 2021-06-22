
module.exports = {
    transfer: function(creep){
        creep.say("transfer")

        switch(creep.memory.transferStrategy){
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

    }
}