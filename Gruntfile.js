/*
 * grunt-graph-runner
 * https://github.com/antiBaconMachine/grunt-graph-runner
 *
 * Copyright (c) 2014 Ollie Edwards
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // Project configuration.
    grunt.initConfig({

        bump: {
            options: {
                pushTo: 'origin'
            }
        },

        graph: {
            a : {
                dependencies: ['graph:c', 'graph:bar'],
                task: function() {
                    console.log('AAA');
                }
            },
            b: {
                dependencies: [ 'foo'],
                task: function() {
                    console.log('BBB');
                }
            },
            c: {
                dependencies: ['graph:b'],
                task: ['graph:c_log']
            },
            c_log: {
                task: function() {
                    console.log('CCC');
                }
            },
            bar: {
                dependencies: ['foo'],
                task: function() {
                    console.log('BAR');
                }
            },
            spam: {
                dependencies: ['graph:a'],
                task: function() {
                    console.log('spam');
                }
            },
            eggs: {
                dependencies: ['graph:c'],
                task: function() {
                    console.log('eggs');
                }
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        }

    });

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint']);

    grunt.registerTask('foo', function() {
        console.log('FOO');
    });

};