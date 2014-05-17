/*
 * grunt-graph-runner
 * https://github.com/antiBaconMachine/grunt-graph-runner
 *
 * Copyright (c) 2014 Ollie Edwards
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var Digraph = require("graphlib").Digraph;
    var alg  = require("graphlib").alg;
    var filter = require("graphlib").filter;

    var _ = require('lodash');

    var taskGraph = new Digraph();

    grunt.registerTask('run-graph', function() {
        var tasksToRun = _.toArray(arguments);
        prepareTaskGraph();

//        console.log("tasks to run ", tasksToRun);

        var dij = alg.dijkstraAll(taskGraph);
//        console.log('dig', dij);
        var allTasks = [];
        _.each(dij, function(v, k) {
//            console.log(_.contains(tasksToRun, k), k);
            if (_.contains(tasksToRun, k)) {
                allTasks.push(k);
                _.each(v, function(val, key) {
                    if (val.predecessor) {
                        allTasks.push(key);
                    }
                });
            }
        });

//        console.log("all tasks ", allTasks);
        var computedTasks = alg.topsort(taskGraph.filterNodes(filter.nodesFromList(allTasks))).reverse();
        console.log('computed tasks ', computedTasks);
        grunt.task.run(computedTasks);
    });

    grunt.graph = function(graph) {
        _(graph || {}).each(function(node, name) {
            taskGraph.addNode(name, node);
        });
    };

    var prepareTaskGraph = function() {
        taskGraph.eachNode(function(name, node) {
            _(node.dependencies || []).each( function(dep) {
                if (taskGraph.hasNode(dep)) {
                    taskGraph.addEdge(null, name, dep);
                } else {
                    console.error('no task %s was found whilst resolving dependencies of %s', dep, name);
                }
            });

            grunt.registerTask(name, node.action);
        });
    };

};