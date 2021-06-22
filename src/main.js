var harvester = require('harvester')
var builder = require('builder')
var spawnManager = require('spawn.manager')
var repairer = require('repairer')
var repairManager = require('repair.manager')
var utils = require('util');


module.exports.loop = function() {

    //delete Memory.state

     // check for memory entries of died creeps by iterating over Memory.creeps
     for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }


    if(!Memory.state){
        utils.log("Create state")
        Memory.state = {
            roomTerrain: [],
            repairQueue: []
        }
    }


    if(Memory.state.roomTerrain.length == 0){
        console.log("Cache room terrain")
        Memory.state.roomTerrain = Game.map.getRoomTerrain('W48S51').getRawBuffer();
    }

    if(repairManager.shouldScan()){
       repairManager.scan()
    }

    spawnManager.handle()

    for(var name in Game.creeps){

        var creep = Game.creeps[name]

        switch(creep.memory.role){
            case 'harvester':
                harvester.run(creep)
                break;
            case 'builder':
                builder.run(creep)
                break;
            case 'repairer':
                repairer.run(creep);
                break;
        }
    }


}