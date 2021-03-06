
var version = '1.0.1'

module.exports = {
    creepLog: function(creep, message) {
        console.log(`[v${version}] [${creep.name}] [${creep.memory.role}] - ${message}`)
    },
    creepDebug: function(creep, message) {
        if(creep.memory.debug && creep.memory.debug == true){this.creepLog(creep, message)}
    },
    log: function(message) {
        console.log(`[v${version}] - ${message}`)
    },
    calculateCreepCost: function (parts){
        return _.sum(parts, b => BODYPART_COST[b])
    }
}