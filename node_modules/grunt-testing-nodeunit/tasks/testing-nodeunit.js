/*
* grunt-testing-nodeunit
* http://gruntjs.com/
*
* Copyright (c) 2014 Florian Rüberg
* Licensed under the MIT license.
*/

'use strict';

var nodeunit = require('nodeunit');
var path 	 = require('path');
var mkdirp   = require('mkdirp');
var istanbul = require('istanbul');
var coverage = require('jsdoc-at-examples')(istanbul.Instrumenter);

module.exports = function(grunt) {

	grunt.registerMultiTask('testing-nodeunit', function() {
		
		// TODO support --force!==false
		// TODO error handling

		var resolve = function(files){
			return files.filter(function(filepath) {
				return grunt.file.exists(filepath);
			}).map(function(filepath){
				return path.resolve(filepath);
			});
		}

		var paths = resolve(this.filesSrc);

		var options = this.options({
			coverage: './report',
			instrument: ['{src,lib,libs}/**.*js']
		});

		var match = function (file) { 
			var instrument = grunt.file.expand(options.instrument);
			return resolve(instrument).indexOf(file) !== -1;
		};
		var transform = function (code, file) {
			var result = coverage.instrumentSync(code, file);
			// TODO add examples to code
			return result; 
		};
		
		istanbul.hook.hookRequire(match, transform);
		
		var async = this.async();
		var done = function(assertions){
			if(global.__coverage__){
				var out = path.resolve(options.coverage);
				mkdirp(path.dirname(out), function (err) {
					var collector = new istanbul.Collector();
					collector.add(global.__coverage__);
					var opt = { dir: out };
					istanbul.Report.create('html', opt).writeReport(collector, true);
					istanbul.Report.create('lcovonly', opt).writeReport(collector, true);
					async();
				});
			}else{
				async();
			}
		};
		
		nodeunit.reporters.default.run(paths, null, done);

		// options.browser is true or './defaultharness.html'
		// browser mode will use src-dest mapping
		// see. http://gruntjs.com/api/inside-tasks this.files.forEach
	});
};