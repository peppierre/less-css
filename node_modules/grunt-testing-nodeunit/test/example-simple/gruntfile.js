module.exports = function(grunt) {

	grunt.file.expand('../../node_modules/grunt-*/tasks').forEach(grunt.loadTasks);
	grunt.file.expand('../../tasks').forEach(grunt.loadTasks);

	grunt.initConfig({
		'testing-nodeunit': {
			options: {},
			src: ['test/**/*.js']
		}
	});
	
	grunt.registerTask('test', ['testing-nodeunit']);
};