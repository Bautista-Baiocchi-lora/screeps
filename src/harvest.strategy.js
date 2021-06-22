
module.exports = {
    harvest: function(creep){
        creep.say("harvest")

        switch(creep.memory.harvestStrategy){
            case "active_source":
            default: 
                this.fromActiveSource(creep)
                break;
        }
    },
    fromActiveSource: function(creep){
        var resource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)

        if(creep.harvest(resource) == ERR_NOT_IN_RANGE){
            creep.say("Go harvest")
            creep.moveTo(resource)
        }
    },
}