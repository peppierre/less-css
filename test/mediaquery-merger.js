'use strict';

var
    MediaQueryMerger,
    MediaQueryComparator;

MediaQueryMerger = require('../lib/mediaquery-merger.js');
MediaQueryComparator = require('../lib/mediaquery-comparator.js');

exports.mediaQueryMerger = {
    setUp : function(done) {
        // setup here
        done();
    },
    'nothing to work with' : function(test) {
        test.expect(2);
        test.throws(
            function() {
                MediaQueryMerger.mergeIdentical();
            },
            TypeError,
            "---no css");
        test.equal(
            MediaQueryMerger.mergeIdentical([]).length,
            0,
            "---empty css"
        );
        test.done();
    },
    'only one media query' : function(test) {
        var originalMediaQueries, resultMediaQueries, expectedMediaQueries;
        originalMediaQueries = [
            {
                selector : "@media screen only and (min-with:480px)",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:3px",
                            "padding:5px"
                        ]
                    }
                ]
            }
        ];
        expectedMediaQueries = [
            {
                selector : "@media screen only and (min-with:480px)",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:3px",
                            "padding:5px"
                        ]
                    }
                ]
            }
        ];
        test.expect(1);
        resultMediaQueries = MediaQueryMerger.mergeIdentical(originalMediaQueries);
        test.ok(
            MediaQueryComparator.areListOfMediaQueriesIdentical(resultMediaQueries, expectedMediaQueries),
            "---only one media query"
        );
        test.done();
    },
    'no mergable media queries' : function(test) {
        var originalMediaQueries, resultMediaQueries, expectedMediaQueries;
        originalMediaQueries = [
            {
                selector : "@media screen only and (min-with:480px)",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:3px",
                            "padding:5px"
                        ]
                    }
                ]
            },
            {
                selector : "@media screen only and (min-width:750px)",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:3px",
                            "padding:5px"
                        ]
                    }
                ]
            }
        ];
        expectedMediaQueries = [
            {
                selector : "@media screen only and (min-with:480px)",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:3px",
                            "padding:5px"
                        ]
                    }
                ]
            },
            {
                selector : "@media screen only and (min-width:750px)",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:3px",
                            "padding:5px"
                        ]
                    }
                ]
            }
        ];
        test.expect(1);
        resultMediaQueries = MediaQueryMerger.mergeIdentical(originalMediaQueries);
        test.ok(
            MediaQueryComparator.areListOfMediaQueriesIdentical(resultMediaQueries, expectedMediaQueries),
            "---no mergable media queries"
        );
        test.done();
    },
    'mergable mediaqueries' : function(test) {
        var originalMediaQueries, resultMediaQueries, expectedMediaQueries;
        originalMediaQueries = [
            {
                selector : "@media screen only and (min-width:480px)",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:5px"
                        ]
                    },
                    {
                        selector : "span",
                        properties : [
                            "padding:5px"
                        ]
                    }
                ]
            },
            {
                selector : "@media screen only and (min-width:480px)",
                ruleSet : [
                    {
                        selector : "p",
                        properties : [
                            "margin:5px"
                        ]
                    },
                    {
                        selector : "ul",
                        properties : [
                            "padding:5px"
                        ]
                    }
                ]
            }
        ];
        expectedMediaQueries = [
            {
                selector : "@media screen only and (min-width:480px)",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:5px"
                        ]
                    },
                    {
                        selector : "span",
                        properties : [
                            "padding:5px"
                        ]
                    },
                    {
                        selector : "p",
                        properties : [
                            "margin:5px"
                        ]
                    },
                    {
                        selector : "ul",
                        properties : [
                            "padding:5px"
                        ]
                    }
                ]
            }
        ];
        test.expect(1);
        resultMediaQueries = MediaQueryMerger.mergeIdentical(originalMediaQueries);
        test.ok(
            MediaQueryComparator.areListOfMediaQueriesIdentical(resultMediaQueries, expectedMediaQueries),
            "---mergable mediaqueries"
        );
        test.done();
    }
};
