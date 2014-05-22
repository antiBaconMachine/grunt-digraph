/*
 * grunt-graph-runner
 * https://github.com/antiBaconMachine/grunt-graph-runner
 *
 * Copyright (c) 2014 Ollie Edwards
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    var NAME = 'graph';
    var PREFIX = NAME + ':';

    var Digraph = require("graphlib").Digraph;
    var alg = require("graphlib").alg;
    var filter = require("graphlib").filter;

    var _ = require('lodash');

    //Entry point for running a graph of tasks
    grunt.registerTask('run-graph', function () {
        var tasksToRun = getTasksToRun.apply(this, arguments);
        var taskGraph = prepareTaskGraph();

        console.log("Root tasks to run ", tasksToRun);
        var allTasks = [];
        _.each(tasksToRun, function (task) {
            allTasks.push(task);
            _.each(alg.dijkstra(taskGraph, task), function (val, key) {
                if (val.predecessor) {
                    allTasks.push(key);
                }
            });
        });

        var computedTasks = alg.topsort(taskGraph.filterNodes(filter.nodesFromList(allTasks))).reverse();
        console.log('computed tasks ', computedTasks);
        grunt.task.run(computedTasks);
    });

    //Actual function run when a graph task is called
    grunt.registerMultiTask(NAME, 'Tasks with interdependencies', function () {
        var task = this.data.task;
        if (task) {
            if (typeof task === 'function') {
                task.apply(this, arguments);
            } else {
                grunt.task.run(task);
            }
        }
    });

    //Build the directed graph based on the graph config block
    var prepareTaskGraph = function () {
        var taskGraph = new Digraph();
        _.each(grunt.config('graph'), function (task, key) {
            var qualifiedName = 'graph:' + key;
            registerNode(taskGraph, qualifiedName);
            _.each((task.dependencies || []), function (dep) {
                //If there is a dependency on a task outside the graph then we need to add it to the directed graph
                registerNode(taskGraph, dep);
                taskGraph.addEdge(null, qualifiedName, dep);
            });
        });
        return taskGraph;
    };

    //Check if a node exists in the digraph, and if not add it
    var registerNode = function (graph, key, node) {
        if (!graph.hasNode(key)) {
            graph.addNode(key, node);
        }
    };

    /**
     * Build initial list of root tasks, appending the prefix to any tasks which are missing it
     * @returns {Array}
     */
    var getTasksToRun = function () {
        return _.toArray(arguments).map(function (t) {
            if (t.indexOf(PREFIX) !== 0) {
                t = PREFIX + t;
            }
            return t;
        });
    };
};