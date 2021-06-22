
var builder = require('builder')
var harvester = require('harvester')
var repairer = require('repairer')

var minHarvesterCount = 4
var minBuilderCount = 3;
var minRepairerCount = 2;

module.exports = {
    handle: function(){
        var spawnName = 'Spawn1'

        if(this.shouldSpawnRepairer()){
            if(repairer.canSpawn(spawnName)){
                repairer.spawn(spawnName)
            }
        }else if(this.shouldSpawnBuilder()){
            if(builder.canSpawn(spawnName)){
                builder.spawn(spawnName)
            }
        } else if(this.shouldSpawnHarvester()){
            if(harvester.canSpawn(spawnName)){
                harvester.spawn(spawnName)
            }
        }
    },
    getCreepCountByRole: function(role){
        return _.filter(Game.creeps, (c) => c.memory.role == role).length
    },
    shouldSpawnHarvester: function(){
        return this.getCreepCountByRole('harvester') < minHarvesterCount
    },
    shouldSpawnBuilder: function(){
        return this.getCreepCountByRole('builder') < minBuilderCount
    },
    shouldSpawnRepairer: function(){
        return this.getCreepCountByRole('repairer') < minRepairerCount
    }
}