'use strict';

var
    MediaQueryParser,
    MediaQueryComparator;

MediaQueryParser = require('../lib/mediaquery-parser.js');
MediaQueryComparator = require('../lib/mediaquery-comparator.js');

exports.mediaqueryParser = {
    setUp: function(done) {
        // setup here
        done();
    },
    'common rules': function (test) {
        var originalChunk, resultMediaQuery, expectedMediaQuery;
        test.expect(2);
        originalChunk = "div { color  : red ; }";
        resultMediaQuery = MediaQueryParser.parse(originalChunk);
        expectedMediaQuery = {
            selector : "general",
            ruleSet : [
                {
                    selector : "div ",
                    properties : [
                        " color  : red ",
                        " "
                    ]
                }
            ]
        };
        test.ok(
            MediaQueryComparator.areMediaQueriesIdentical(resultMediaQuery, expectedMediaQuery),
            "---common rules with additional semi-colon"
        );
        originalChunk = "div { color  : red }";
        resultMediaQuery = MediaQueryParser.parse(originalChunk);
        expectedMediaQuery = {
            selector : "general",
            ruleSet : [
                {
                    selector : "div ",
                    properties : [
                        " color  : red "
                    ]
                }
            ]
        };
        test.ok(
            MediaQueryComparator.areMediaQueriesIdentical(resultMediaQuery, expectedMediaQuery),
            "---common rules (standard variant)"
        );
        test.done();
    },
    'media query rules': function (test) {
        var originalChunk, resultMediaQuery, expectedMediaQuery;
        test.expect(2);
        originalChunk = "@media screen only and ( min-width : 480px ) { div { color : red ; }}";
        resultMediaQuery = MediaQueryParser.parse(originalChunk);
        expectedMediaQuery = {
            selector : "@media screen only and ( min-width : 480px ) ",
            ruleSet : [
                {
                    selector : " div ",
                    properties : [
                        " color : red ",
                         " "
                    ]
                }
            ]
        };
        test.ok(
            MediaQueryComparator.areMediaQueriesIdentical(resultMediaQuery, expectedMediaQuery),
            "---media query rules with additional semi-colon"
        );
        originalChunk = "@media screen only and ( min-width : 480px ) { div { color : red }}";
        resultMediaQuery = MediaQueryParser.parse(originalChunk);
        expectedMediaQuery = {
            selector : "@media screen only and ( min-width : 480px ) ",
            ruleSet : [
                {
                    selector : " div ",
                    properties : [
                        " color : red "
                    ]
                }
            ]
        };
        test.ok(
            MediaQueryComparator.areMediaQueriesIdentical(resultMediaQuery, expectedMediaQuery),
            "---media query rules (standard variant)"
        );
        test.done();
    }
};
