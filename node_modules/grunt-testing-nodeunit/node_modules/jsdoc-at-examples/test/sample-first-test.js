var esprima   = require('esprima');
var escodegen = require('escodegen');
var assert    = require('chai').assert;
var index     = require('../index.js')();
var fs        = require('fs');
var path      = require('path');


function cleanup(code){
  //return code;
  return escodegen.generate(esprima.parse(code));
}

function write(string){
  fs.writeFile(path.join(__dirname, "out.js"), string, function(err) {});
}

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(done){
      var file = path.resolve(__dirname, '../sample/first.js');
      fs.readFile(file, 'utf8', function (err,data) {
        data = index.instrument(data);
        write(data);  
        //write(cleanup(index.build('qunit')));

        assert.equal(-1, [1,2,3].indexOf(5));
        done();
      });
    });
  });
});