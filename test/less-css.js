'use strict';

var LessCss = require('../lib/less-css.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.lesscss = {
  setUp: function(done) {
    // setup here
    done();
  },
  'comments': function (test) {
    test.expect(3);
    test.equal(LessCss.toLessCss("/* simple block comment*/"), "");
    test.equal(LessCss.toLessCss("/* multiline \n   block comment */"), "");
    test.equal(LessCss.toLessCss("/*! important comment */"), "/*! important comment */\n");
    test.done();
  },
  "same selector" : function (test) {
  	test.expect(5);
  	test.equal(LessCss.toLessCss("div{margin:5px}div{border:solid 1px red}"), "div{margin:5px;border:solid 1px red}");
  	test.equal(LessCss.toLessCss(".class1{margin:5px}.class1{border:solid 1px red}"), ".class1{margin:5px;border:solid 1px red}");
  	test.equal(LessCss.toLessCss("#id1{margin:5px}#id1{border:solid 1px red}"), "#id1{margin:5px;border:solid 1px red}");
  	test.equal(LessCss.toLessCss("a:hover{margin:5px}a:hover{border:solid 1px red}"), "a:hover{margin:5px;border:solid 1px red}");
  	test.equal(LessCss.toLessCss("div{margin:5px}div{margin:10px}"), "div{margin:10px}");
  	test.done();
  },
  "same properties" : function (test) {
  	test.expect(2);
  	test.equal(LessCss.toLessCss("div{margin:5px}span{margin:5px}"), "div,span{margin:5px}");
  	test.equal(LessCss.toLessCss("span,div{margin:5px}p{margin:5px}"), "div,p,span{margin:5px}");
  	test.done();
  },
  "same selectors and same properties" : function (test) {
  	test.expect(1);
  	test.equal(LessCss.toLessCss("div{margin:5px}span{padding:3px}p{padding:3px;margin:5px}span{margin:5px}div{padding:3px}p,span,div{border:solid 1px red}"), "div,p,span{margin:5px;padding:3px;border:solid 1px red}");
  	test.done();
  },
  "same selector and same properties and media queries" : function (test) {
  	test.expect(1);
  	test.equal(LessCss.toLessCss("div{margin:3px}@media screen only and (min-width:480px){div{margin:5px}}@media screen only and (min-width:480px){div{margin:10px}}"), "div{margin:3px}\n@media screen only and (min-width:480px){div{margin:10px}}");
  	test.done();
  }
};
