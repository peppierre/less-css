var path = require('path');
var exec = require('child_process').exec;

function rungrunt(relative, tasks, done){
	var target = path.join(__dirname, relative);
	var cwd = process.cwd();
	var cb = function (error, stdout, stderr) {
		if(stderr === '' && error === null && /OK/.test(stdout)){
			console.log('Grunt success');
			done();
		}else{
			done(stderr + '\n' + stdout);
		}
	};
	exec('grunt --gruntfile=test\\example-simple\\gruntfile.js test',cb);
}

exports.simple = function(test){
	test.expect(1);
	rungrunt('test\example-simple', 'test', function(err){
		if(err)console.error(err);
		test.ok(!err, 'Grunt should succeed');
		test.done();
	});
};

