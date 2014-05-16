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
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        graph_runner: {
            default_options: {
                options: {
                },
                files: {
                    'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
                }
            },
            custom_options: {
                options: {
                    separator: ': ',
                    punctuation: ' !!!'
                },
                files: {
                    'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });





    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'graph_runner', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint']);

    console.log(grunt.graph);
    grunt.graph({
        a : {
            dependencies: ['b', 'bar'],
            action: function() {
                console.log('AAA');
            }
        },
        b: {
            dependencies: ['c', 'foo'],
            action: function() {
                console.log('BBB');
            }
        },
        c: {
            action: ['c_log']
        },
        c_log: {
            action: function() {
                console.log('CCC');
            }
        },
        foo: {
            action: function() {
                console.log('FOO');
            }
        },
        bar: {
            dependencies: ['foo'],
            action: function() {
                console.log('BAR');
            }
        }
    });



};
