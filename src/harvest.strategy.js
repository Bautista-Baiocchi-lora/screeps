

function findAllSources(creep){ 
    return [...creep.room.find(FIND_SOURCES_ACTIVE), ...creep.room.find(FIND_DROPPED_RESOURCES)]
}

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
        //var sources = findAllSources(creep)
        var resource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)

        if(creep.harvest(resource) == ERR_NOT_IN_RANGE){
            creep.say("Go harvest")
            creep.moveTo(resource)
        }
    }
}