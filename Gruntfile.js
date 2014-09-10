'use strict';

module.exports = function(grunt) {
    // Show elapsed time at the end
    require('time-grunt')(grunt);
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.file.expand('./node_modules/grunt-testing-nodeunit/tasks').forEach(grunt.loadTasks);

    // Project configuration.
    grunt.initConfig({
        'testing-nodeunit': {
            options: {},
            src: ['test/**/*.js']
        },
        nodeunit : {
            files : ['test/**/*.js']
        },
        jshint : {
            options : {
                jshintrc : '.jshintrc',
                reporter : require('jshint-stylish')
            },
            gruntfile : {
                src : 'Gruntfile.js'
            },
            lib : {
                src : ['lib/**/*.js']
            },
            test : {
                src : ['test/**/*.js']
            }
        },
        watch : {
            gruntfile : {
                files : '<%= jshint.gruntfile.src %>',
                tasks : ['jshint:gruntfile']
            },
            lib : {
                files : '<%= jshint.lib.src %>',
                tasks : ['jshint:lib', 'nodeunit']
            },
            test : {
                files : '<%= jshint.test.src %>',
                tasks : ['jshint:test', 'nodeunit']
            }
        }
    });

    // Default task.
    grunt.registerTask('test', ['testing-nodeunit']);
    grunt.registerTask('default', ['jshint', 'test']);
};
