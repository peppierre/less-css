'use strict';
module.exports = function (grunt) {
  grunt.initConfig({
    qunit: {
      options: {
        coverage: {
          disposeCollector: true,
          src: ['first.js'],
          instrumentedFiles: 'temp/',
          htmlReport: 'report/'
        },
        addJSDocExamples: 'qunit.html'
      },
      all: ['qunit.html']
    }
  });

  grunt.loadNpmTasks('grunt-qunit-istanbul');
  grunt.registerTask('default', ['qunit']);
};