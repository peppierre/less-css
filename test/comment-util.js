'use strict';

var
    CommentUtil;

CommentUtil = require('../lib/comment-util.js');

exports.commentProcessor = {
    setUp: function(done) {
        // setup here
        done();
    },
    'simple line comment': function (test) {
        test.expect(2);
        test.equal(
            CommentUtil.purgeCommentsFrom("div{margin:5px}// simple line comment"),
            "div{margin:5px}",
            "---purge simple line comment"
        );
        test.equal(
            CommentUtil.getCommentsFrom("div{margin:5px}// simple line comment").length,
            0,
            "---get simple line comment"
        );
        test.done();
    },
    'simple block comment': function (test) {
        test.expect(3);
        test.equal(
            CommentUtil.purgeCommentsFrom("div{margin:5px}/* simple block comment */"),
            "div{margin:5px}",
            "---purge simple block comment"
        );
        test.equal(
            CommentUtil.getCommentsFrom("div{margin:5px}/* simple block comment */").length,
            1,
            "---get simple block comment - length"
        );
        test.equal(
            CommentUtil.getCommentsFrom("div{margin:5px}/* simple block comment */")[0],
            "/* simple block comment */",
            "---get simple block comment - content"
        );
        test.done();
    },
    'multiline block comment': function (test) {
        test.expect(3);
        test.equal(
            CommentUtil.purgeCommentsFrom("div{margin:5px}/* multiline\nblock\ncomment */"),
            "div{margin:5px}",
            "---purge multiline block comment"
        );
        test.equal(
            CommentUtil.getCommentsFrom("div{margin:5px}/* multiline\nblock\ncomment */").length,
            1,
            "---get multiline block comment - length"
        );
        test.equal(
            CommentUtil.getCommentsFrom("div{margin:5px}/* multiline\nblock\ncomment */")[0],
            "/* multiline\nblock\ncomment */",
            "---get multiline block comment - content"
        );
        test.done();
    },
    'many block comments': function (test) {
        test.expect(5);
        test.equal(
            CommentUtil.purgeCommentsFrom("div{margin:5px}/* multiline\nblock\ncomment *//* simple comment *//*! important comment */"),
            "div{margin:5px}",
            "---purge many block commens"
        );
        test.equal(
            CommentUtil.getCommentsFrom("div{margin:5px}/* multiline\nblock\ncomment *//* simple comment *//*! important comment */").length,
            3,
            "---get many block comments - length"
        );
        test.equal(
            CommentUtil.getCommentsFrom("div{margin:5px}/* multiline\nblock\ncomment *//* simple comment *//*! important comment */")[0],
            "/* multiline\nblock\ncomment */",
            "---get many block comments - content"
        );
        test.equal(
            CommentUtil.getCommentsFrom("div{margin:5px}/* multiline\nblock\ncomment *//* simple comment *//*! important comment */")[1],
            "/* simple comment */",
            "---get many block comments - content"
        );
        test.equal(
            CommentUtil.getCommentsFrom("div{margin:5px}/* multiline\nblock\ncomment *//* simple comment *//*! important comment */")[2],
            "/*! important comment */",
            "---get many block comments - content"
        );
        test.done();
    }
};
