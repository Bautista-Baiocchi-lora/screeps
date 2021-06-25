var utils = require('util')
var builder = require('builder')
var harvester = require('harvester')
var repairer = require('repairer')


var lastRun = Game.time
var rate = 25 

var spawnConfig = {
    'harvester': {
        min: 3,
        max: 5
    },
    'builder': {
        min: 0,
        max: 1
    },
    'repairer': {
        min: 1,
        max: 3
    }
}

 
function getCreepCountByRole (role) {
    return _.filter(Game.creeps, (c) => c.memory.role == role).length
}

function nextSpawn(){
    var urgent = Object.keys(spawnConfig).filter(role => {
        return getCreepCountByRole(role) < spawnConfig[role].min
    })

    if(urgent.length > 0){
        return urgent.pop()
    }

    var notMaxedOut = Object.keys(spawnConfig).filter(role => {
        return getCreepCountByRole(role) < spawnConfig[role].max
    })    

    if(notMaxedOut.length > 0){
        return notMaxedOut.pop()
    }

    return undefined;
}

module.exports = {
    shouldRun: function(){
        return lastRun+rate < Game.time
    },
    run: function (spawnName) {
        utils.log('Running spawn check')
        var now = Game.time

        switch(nextSpawn()) {
            case 'harvester':
                if (harvester.canSpawn(spawnName)) {
                    harvester.spawn(spawnName)
                }
            break;
            case 'builder':
                if (builder.canSpawn(spawnName)) {
                    builder.spawn(spawnName)
                }
            break;
            case 'repairer':
                if (repairer.canSpawn(spawnName)) {
                    repairer.spawn(spawnName)
                }
            break;
            default:
                utils.log("No new spawns needed.")
                break;
        }

        lastRun = now
    },
}