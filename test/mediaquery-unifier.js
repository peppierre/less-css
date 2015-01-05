'use strict';

var
    MediaQueryComparator,
    MediaQueryUnifier;

MediaQueryUnifier = require('../lib/mediaquery-unifier.js');
MediaQueryComparator = require('../lib/mediaquery-comparator.js');

exports.mediaqueryUnifier = {
    setUp: function (done) {
        // setup here
        done();
    },
    'completely idiot media query': function (test) {
        var source, result;
        source = {
            selector: "@media    screen    only    and    (   min-width  : 480px   )    ",
            ruleSet: [
                {
                    selector: "   div   ,    span,  div    ",
                    properties: [
                        " margin :   5px  ",
                        "    padding:  3px "
                    ]
                }
            ]
        };
        result = {
            selector: "@media screen only and (min-width:480px)",
            ruleSet: [
                {
                    selector: "div,span",
                    properties: [
                        "margin:5px",
                        "padding:3px"
                    ]
                }
            ]
        };
        test.expect(1);
        MediaQueryUnifier.unify(source);
        test.ok(
            MediaQueryComparator.areMediaQueriesIdentical(source, result),
            "---media query is too idiot"
        );
        test.done();
    }
};
