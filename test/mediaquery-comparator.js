'use strict';

var
    MediaQueryComparator;

MediaQueryComparator = require('../lib/mediaquery-comparator.js');

exports.mediaqueryComparator = {
    setUp: function(done) {
        // setup here
        done();
    },
    'length are not equal': function (test) {
        var source, compareToMoreMediaQueries, compareToMoreRules, compareToMoreProperties;
        source = [
            {
                selector : "general",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:5px",
                            "padding:3px"
                        ]
                    },
                    {
                        selector : "span",
                        properties : [
                            "color:red"
                        ]
                    }
                ]
            }
        ];
        compareToMoreMediaQueries = [
            {
                selector : "general",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:5px",
                            "padding:3px"
                        ]
                    },
                    {
                        selector : "span",
                        properties : [
                            "color:red"
                        ]
                    }
                ]
            },
            {
                selector : "@media screen only and (min-width:500px)",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:5px",
                            "padding:3px"
                        ]
                    },
                    {
                        selector : "span",
                        properties : [
                            "color:red"
                        ]
                    }
                ]
            }
        ];
        compareToMoreRules = [
            {
                selector : "general",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:5px",
                            "padding:3px"
                        ]
                    },
                    {
                        selector : "p",
                        properties : [
                            "margin:5px",
                            "padding:3px"
                        ]
                    },
                    {
                        selector : "span",
                        properties : [
                            "color:red"
                        ]
                    }
                ]
            }
        ];
        compareToMoreProperties = [
            {
                selector : "general",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:5px",
                            "padding:3px",
                            "border:solid 1px red"
                        ]
                    },
                    {
                        selector : "span",
                        properties : [
                            "color:red"
                        ]
                    }
                ]
            }
        ];
        test.expect(3);
        test.ok(
            !MediaQueryComparator.areListOfMediaQueriesIdentical(source, compareToMoreMediaQueries),
            "---media query length issue"
        );
        test.ok(
            !MediaQueryComparator.areListOfMediaQueriesIdentical(source, compareToMoreRules),
            "---rule length issue"
        );
        test.ok(
            !MediaQueryComparator.areListOfMediaQueriesIdentical(source, compareToMoreProperties),
            "---property length issue"
        );
        test.done();
    },
    'values are not equal': function (test) {
        var source, compareToDifferentMediaQueriesSelector, compareToDifferentRuleSelector, compareToDifferentPropertySelector;
        source = [
            {
                selector : "general",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:5px",
                            "padding:3px"
                        ]
                    },
                    {
                        selector : "span",
                        properties : [
                            "color:red"
                        ]
                    }
                ]
            }
        ];
        compareToDifferentMediaQueriesSelector = [
            {
                selector : "@media screen only and (min-width:480px)",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:5px",
                            "padding:3px"
                        ]
                    },
                    {
                        selector : "span",
                        properties : [
                            "color:red"
                        ]
                    }
                ]
            }
        ];
        compareToDifferentRuleSelector = [
            {
                selector : "general",
                ruleSet : [
                    {
                        selector : "ul",
                        properties : [
                            "margin:5px",
                            "padding:3px"
                        ]
                    },
                    {
                        selector : "span",
                        properties : [
                            "color:red"
                        ]
                    }
                ]
            }
        ];
        compareToDifferentPropertySelector = [
            {
                selector : "general",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:100px",
                            "padding:3px"
                        ]
                    },
                    {
                        selector : "span",
                        properties : [
                            "color:red"
                        ]
                    }
                ]
            }
        ];
        test.expect(3);
        test.ok(
            !MediaQueryComparator.areListOfMediaQueriesIdentical(source, compareToDifferentMediaQueriesSelector),
            "---media query selector issue"
        );
        test.ok(
            !MediaQueryComparator.areListOfMediaQueriesIdentical(source, compareToDifferentRuleSelector),
            "---rule selector issue"
        );
        test.ok(
            !MediaQueryComparator.areListOfMediaQueriesIdentical(source, compareToDifferentPropertySelector),
            "---property selector issue"
        );
        test.done();
    },
    'all green': function (test) {
        var source, compareTo;
        source = [
            {
                selector : "general",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:5px",
                            "padding:3px"
                        ]
                    },
                    {
                        selector : "span",
                        properties : [
                            "color:red"
                        ]
                    }
                ]
            }
        ];
        compareTo = [
            {
                selector : "general",
                ruleSet : [
                    {
                        selector : "div",
                        properties : [
                            "margin:5px",
                            "padding:3px"
                        ]
                    },
                    {
                        selector : "span",
                        properties : [
                            "color:red"
                        ]
                    }
                ]
            }
        ];
        test.expect(1);
        test.ok(
            MediaQueryComparator.areListOfMediaQueriesIdentical(source, compareTo),
            "---all green"
        );
        test.done();
    }
};
