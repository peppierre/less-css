'use strict';

var
    StringUnifier;

StringUnifier = require('../lib/string-unifier.js');

exports.stringUnifier = {
    setUp: function(done) {
        // setup here
        done();
    },
    'trailing white spaces': function (test) {
        test.expect(1);
        test.equal(
            StringUnifier.trimTrailingWhitespaces("  \t\t\n\n\r\rdiv { margin : 5px; }\r\n \t"),
            "div { margin : 5px; }",
            "---trim trailing white spaces"
        );
        test.done();
    },
    'white spaces around comma': function (test) {
        test.expect(1);
        test.equal(
            StringUnifier.trimWhitespacesAroundCommas("div, span , p { margin : 5px; }"),
            "div,span,p { margin : 5px; }",
            "---trim white spaces around comma"
        );
        test.done();
    },
    'white spaces around colon': function (test) {
        test.expect(1);
        test.equal(
            StringUnifier.trimWhitespacesAroundColons("div, span , p { margin : 5px; }"),
            "div, span , p { margin:5px; }",
            "---trim white spaces around colon"
        );
        test.done();
    },
    'white spaces around brackets': function (test) {
        test.expect(1);
        test.equal(
            StringUnifier.trimWhitespacesAroundBrackets("@media only screen and ( min-width:0px  )    and   (max-width:320px) "),
            "@media only screen and (min-width:0px) and (max-width:320px)",
            "---trim white spaces around brackets"
        );
        test.done();
    }
};
