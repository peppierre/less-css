module.exports = function(grunt) {

	grunt.file.expand('./tasks').forEach(grunt.loadTasks);

	grunt.initConfig({
		'testing-nodeunit': {
			options: {},
			src: ['test/*-test.js']
		}
	});
	
	grunt.registerTask('test', ['testing-nodeunit']);
};