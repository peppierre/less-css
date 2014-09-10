'use strict';

var
    StyleSheetChunker;

StyleSheetChunker = require('../lib/stylesheet-chunker.js');

exports.stylesheetChunker = {
    setUp: function(done) {
        // setup here
        done();
    },
    'general only': function (test) {
        var originalSource, result, expected;
        originalSource = "div { margin : 5px; } span {padding : 10px; }";
        result = StyleSheetChunker.from(originalSource);
        expected = [originalSource];
        test.expect(2);
        test.equal(
            result.length,
            expected.length,
            "---general only - length-check"
        );
        test.equal(
            result[0],
            expected[0],
            "---general only - value-check"
        );
        test.done();
    },
    'one mediaquery only': function (test) {
        var originalSource, result, expected;
        originalSource = "@media screen only (min-width : 480px) {div { margin:5px; } span {padding:10px; }}";
        result = StyleSheetChunker.from(originalSource);
        expected = [originalSource];
        test.expect(2);
        test.equal(
            result.length,
            expected.length,
            "---one mediaquery only - length-check"
        );
        test.equal(
            result[0],
            expected[0],
            "---one mediaquery only - value-check"
        );
        test.done();
    },
    'some mediaqueries only': function (test) {
        var mediaQuery1, mediaQuery2, originalSource, result, expected;
        mediaQuery1 = "@media screen only (min-width : 480px) {div { margin:5px; } span {padding:10px; }}";
        mediaQuery2 = "@media screen only (min-width : 750px) {div { margin:5px; } span {padding:10px; }}";
        originalSource = mediaQuery1 + mediaQuery2;
        result = StyleSheetChunker.from(originalSource);
        expected = [
            mediaQuery1,
            mediaQuery2
        ];
        test.expect(3);
        test.equal(
            result.length,
            expected.length,
            "---some mediaqueries only - length-check"
        );
        test.equal(
            result[0],
            expected[0],
            "---some mediaqueries only - value-check - first"
        );
        test.equal(
            result[1],
            expected[1],
            "---some mediaqueries only - value-check - second"
        );
        test.done();
    },
    'mixed content': function (test) {
        var general1, mediaQuery1, mediaQuery2, originalSource, result, expected;
        general1 = "div { margin : 5px; } span {padding : 10px; }";
        mediaQuery1 = "@media screen only (min-width : 480px) {div { margin:5px; } span {padding:10px; }}";
        mediaQuery2 = "@media screen only (min-width : 750px) {div { margin:5px; } span {padding:10px; }}";
        originalSource = mediaQuery1 + general1 + mediaQuery2;
        result = StyleSheetChunker.from(originalSource);
        expected = [
            mediaQuery1,
            general1,
            mediaQuery2
        ];
        test.expect(4);
        test.equal(
            result.length,
            expected.length,
            "---mixed content - length-check"
        );
        test.equal(
            result[0],
            expected[0],
            "---mixed content - value-check - first"
        );
        test.equal(
            result[1],
            expected[1],
            "---mixed content - value-check - second"
        );
        test.equal(
            result[2],
            expected[2],
            "---mixed content - value-check - third"
        );
        test.done();
    }
};
