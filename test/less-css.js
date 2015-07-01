'use strict';

var LessCss = require('../lib/less-css.js');

exports.lesscss = {
    setUp: function(done) {
        // setup here
        done();
    },
    'nothing to work with' : function (test) {
        test.expect(5);
        test.equal(
            LessCss.from(""),
            "",
            "empty css"
        );
        test.equal(
            LessCss.from("          "),
            "",
            "spaces only"
        );
        test.equal(
            LessCss.from("\n\n\r\n\r\n"),
            "",
            "new lines only"
        );
        test.equal(
            LessCss.from("\t\t\t\t\t"),
            "",
            "tabs only"
        );
        test.equal(
            LessCss.from(" \r\n \r\n\t\n\t \t"),
            "",
            "whitespaces mixed"
        );
        test.done();
    },
    'comments': function (test) {
        test.expect(8);
        test.equal(
            LessCss.from("// simple line comment"),
            "",
            "---simple line comment"
        );
        test.equal(
            LessCss.from("/* simple block comment*/"),
            "",
            "---simple block comment"
        );
        test.equal(
            LessCss.from("/* multiline \n   block comment */"),
            "",
            "---multiline block comment"
        );
        test.equal(
            LessCss.from("/*! important comment */"),
            "/*! important comment */",
            "---important note"
        );
        test.equal(
            LessCss.from("div{margin:2px}// single line comment span{margin:2px}"),
            "div{margin:2px}",
            "---unterminated single line comment with rules"
        );
        test.equal(
            LessCss.from("div{margin:2px}// single line comment\n//second line comment\nspan{margin:2px}"),
            "div,span{margin:2px}",
            "---two single line comments with rules"
        );
        test.equal(
            LessCss.from("div{margin:2px}/* single block comment\nmultiline*/span{margin:2px}"),
            "div,span{margin:2px}",
            "---single multiline block comment with rules"
        );
        test.equal(
            LessCss.from("div{margin:2px}/*! important comment */span{margin:2px}"),
            "/*! important comment */\ndiv,span{margin:2px}",
            "---important comment with rules"
        );
        test.done();
    },
    "no more optimization" : function (test) {
        test.expect(3);
        test.equal(
            LessCss.from("div{margin:10px;padding:5px}"),
            "div{margin:10px;padding:5px}",
            "---unoptimizable simple selector"
        );
        test.equal(
            LessCss.from("div,span{margin:10px;padding:5px}"),
            "div,span{margin:10px;padding:5px}",
            "--unoptimizable complex selector"
        );
        test.equal(
            LessCss.from("div{margin:10px;padding:5px}\n@media screen only and (min-width:480px){div{padding:15px}}"),
            "div{margin:10px;padding:5px}\n@media screen only and (min-width:480px){div{padding:15px}}",
            "---unoptimizable with media query"
        );
        test.done();
    },
    "same selector" : function (test) {
        test.expect(5);
        test.equal(
            LessCss.from("div{margin:5px}div{border:solid 1px red}"),
            "div{margin:5px;border:solid 1px red}",
            "---more rules with same element selector"
        );
        test.equal(
            LessCss.from(".class1{margin:5px}.class1{border:solid 1px red}"),
            ".class1{margin:5px;border:solid 1px red}",
            "---more rules with same class selector"
        );
        test.equal(
            LessCss.from("#id1{margin:5px}#id1{border:solid 1px red}"),
            "#id1{margin:5px;border:solid 1px red}",
            "---more rules with same id selector"
        );
        test.equal(
            LessCss.from("a:hover{margin:5px}a:hover{border:solid 1px red}"),
            "a:hover{margin:5px;border:solid 1px red}",
            "---more rules with same pseudo-selector"
        );
        test.equal(
            LessCss.from("div{margin:5px}div{margin:10px}"),
            "div{margin:10px}",
            "---more rules with simple element selector and matching properties"
        );
        test.done();
    },
    "unnecessary spaces everywhere" : function (test) {
        test.expect(2);
        test.equal(
            LessCss.from("div { margin : 10px }   div  { margin  :  5px;  }"),
            "div{margin:5px}",
            "---unnecessary space in simple rules"
        );
        test.equal(
            LessCss.from("div { margin : 10px }   @media screen only and (min-width : 480px)  {  div  { margin  :  5px;  }}"),
            "div{margin:10px}\n@media screen only and (min-width:480px){div{margin:5px}}",
            "---unnecessary spaces in media query"
        );
        test.done();
    },
    "same properties" : function (test) {
        test.expect(2);
        test.equal(
            LessCss.from("div{margin:5px}span{margin:5px}"),
            "div,span{margin:5px}",
            "---more rules with same properties and simple selectors"
        );
        test.equal(
            LessCss.from("span,div{margin:5px}p{margin:5px}"),
            "div,p,span{margin:5px}",
            "---more rules with same properties and complex selectors"
        );
        test.done();
    },
    "same special properties" : function (test) {
        var blueToBlueGradient, redToWhiteGradient;
        blueToBlueGradient = "background:#1e5799;background:-moz-linear-gradient(-45deg,#1e5799 0%,#7db9e8 100%);background:-webkit-gradient(linear,left top,right bottom,color-stop(0%,#1e5799),color-stop(100%,#7db9e8));background:-webkit-linear-gradient(-45deg,#1e5799 0%,#7db9e8 100%);background:-o-linear-gradient(-45deg,#1e5799 0%,#7db9e8 100%);background:-ms-linear-gradient(-45deg,#1e5799 0%,#7db9e8 100%);background:linear-gradient(135deg,#1e5799 0%,#7db9e8 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#1e5799',endColorstr='#7db9e8',GradientType=1)";
        redToWhiteGradient = "background:#f94231;background:-moz-linear-gradient(-45deg,#f94231 0%,#ffffff 100%);background:-webkit-gradient(linear,left top,right bottom,color-stop(0%,#f94231),color-stop(100%,#ffffff));background:-webkit-linear-gradient(-45deg,#f94231 0%,#ffffff 100%);background:-o-linear-gradient(-45deg,#f94231 0%,#ffffff 100%);background:-ms-linear-gradient(-45deg,#f94231 0%,#ffffff 100%);background:linear-gradient(135deg,#f94231 0%,#ffffff 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#f94231',endColorstr='#ffffff',GradientType=1)";
        test.expect(1);
        test.equal(
            LessCss.from("div{" + blueToBlueGradient + ";" + redToWhiteGradient + "}"),
            "div{" + redToWhiteGradient + "}",
            "---more rules with same gradient background properties and simple selectors"
        );
        test.done();
    },
    "same selectors and same properties" : function (test) {
        test.expect(1);
        test.equal(
            LessCss.from("div{margin:5px}span{padding:3px}p{padding:3px;margin:5px}span{margin:5px}div{padding:3px}p,span,div{border:solid 1px red}"),
            "div,p,span{margin:5px;padding:3px;border:solid 1px red}",
            "---same selectors and same properties splitted in (too many) rules"
        );
        test.done();
    }
};
