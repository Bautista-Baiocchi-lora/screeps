module.exports = function(grunt) {

    var config = require('./config.json')

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: config.email,
                token: config.token,
                branch: config.branch,
                //server: 'season'
            },
            dist: {
                src: ['src/*.js']
            }
        }
    });
}