'use strict';

var
    CommentParser;

CommentParser = require('../lib/comment-parser.js');

exports.commentProcessor = {
    setUp: function(done) {
        // setup here
        done();
    },
    'nothing to work with' : function (test) {
        test.expect(5);
        test.equal(
            CommentParser.parse(""),
            "",
            "---empty css"
        );
        test.equal(
            CommentParser.parse("          "),
            "",
            "---spaces only"
        );
        test.equal(
            CommentParser.parse("\n\n\r\n\r\n"),
            "",
            "---new lines only"
        );
        test.equal(
            CommentParser.parse("\t\t\t\t\t"),
            "",
            "---tabs only"
        );
        test.equal(
            CommentParser.parse(" \r\n \r\n\t\n\t \t"),
            "",
            "---whitespaces mixed"
        );
        test.done();
    },
    'comments': function (test) {
        test.expect(8);
        test.equal(
            CommentParser.parse("// simple line comment"),
            "",
            "---simple line comment"
        );
        test.equal(
            CommentParser.parse("/* simple block comment*/"),
            "",
            "---simple block comment"
        );
        test.equal(
            CommentParser.parse("/* multiline \n   block comment */"),
            "",
            "---multiline block comment"
        );
        test.equal(
            CommentParser.parse("/*! important comment */"),
            "/*! important comment */",
            "---important note"
        );
        test.equal(
            CommentParser.parse("div{margin:2px}// single line comment span{margin:2px}"),
            "",
            "---unterminated single line comment with rules"
        );
        test.equal(
            CommentParser.parse("div{margin:2px}// single line comment\n//second line comment\nspan{margin:2px}"),
            "",
            "---two single line comments with rules"
        );
        test.equal(
            CommentParser.parse("div{margin:2px}/* single block comment\nmultiline*/span{margin:2px}"),
            "",
            "---single multiline block comment with rules"
        );
        test.equal(
            CommentParser.parse("div{margin:2px}/*! important comment */span{margin:2px}"),
            "/*! important comment */",
            "---important comment with rules"
        );
        test.done();
    }
};
