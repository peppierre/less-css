/*
 * css-processor
 * https://github.com/peppierre/less-css
 *
 * Copyright (c) 2014 Peter Abraham
 * Licensed under the MIT license.
 */

/*globals module */
/*jslint node: true */
"use strict";

var
    CommentParser,
    StyleSheetOptimizer;

CommentParser = require('./comment-parser.js');
StyleSheetOptimizer = require('./stylesheet-optimizer.js');

module.exports = function () {
    var
        parsed,
        processComments,
        processPureCss,
        processResult,
        isEmpty,
        toString;
    this.from = function (source) {
        processComments(source);
        processPureCss(source);
        return toString();
    };

    parsed = [];

    processComments = function(source) {
        processResult(CommentParser.parse(source));
    };

    processPureCss = function(source) {
        var processor;
        processor = new StyleSheetOptimizer();
        processResult(processor.from(source));
    };

    processResult = function(plain) {
        if (isEmpty(plain)) {
            return;
        }
        parsed = parsed.concat(plain);
    };

    isEmpty = function(value) {
        return (value === "");
    };

    toString = function() {
        return parsed.join("\n");
    };
};
