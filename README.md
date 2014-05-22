# grunt-digraph

> Add acyclic directed task graph to Grunt

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-digraph --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-digraph');
```

## The "digraph" task

### Overview
In your project's Gruntfile, add a section named `graph` to the data object passed into `grunt.initConfig()`.

Objects you add to the graph should ave task field which has the same validity as a standard grunt task, 
i.e. can be a function, array of strings or a string. 

You may additionally specify an array of dependencies which will be run before the task in question. 
When running multiple tasks with a common dependency the common task will be run once.

```js
grunt.initConfig({
  graph: {
      c : {
          dependencies: ['graph:b',],
          task: function() {
              console.log('C');
          }
      },
      b: {
         dependencies: [ 'graph:a'],
         task: function() {
             console.log('B');
         }
      },
      a: {
          task: 'graph:a_inner'
      },
      a_inner: {
          task: function() {
              console.log('A');
          }
      }
  }
});
```

### Usage Examples

The task `run-graph` can be called to excute tasks ordered with their dependencies. The syntax is

```bash
grunt run-graph:task1:task2:taskN
```

For example, using the example graph above

```bash
$ grunt run-graph:c
Running "run-graph:c" (run-graph) task

Running "graph:a" (graph) task

Running "graph:a_inner" (graph) task
A

Running "graph:b" (graph) task
B

Running "graph:c" (graph) task
C
```

### More info

See [blog post](http://www.abm.io/adding-a-task-graph-to-grunt/ for the reasons this plugin came about).

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.3.1 Initial npm release