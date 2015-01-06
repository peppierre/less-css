/*
 * stylesheet-optimizer
 * https://github.com/peppierre/less-css
 *
 * Copyright (c) 2014 Peter Abraham
 * Licensed under the MIT license.
 */

/*globals module */
/*jslint node: true */
"use strict";

var
    CommentUtil,
    StyleSheetChunker,
    MediaQueryParser,
    MediaQueryMerger,
    MediaQueryOptimizer;

CommentUtil = require("./comment-util.js");
StyleSheetChunker = require("./stylesheet-chunker.js");
MediaQueryParser = require("./mediaquery-parser.js");
MediaQueryMerger = require("./mediaquery-merger.js");
MediaQueryOptimizer = require("./mediaquery-optimizer.js");

module.exports = function () {
    var
        OPENING_CURLY,
        CLOSING_CURLY,
        parse,
        optimize,
        stringify,
        stringifyMediaQuery,
        stringifyMediaQueryHeader,
        stringifyMediaQueryFooter,
        stringifyRuleset,
        stringifyProperty,
        isMediaQuerySpecific;

    OPENING_CURLY = "{";
    CLOSING_CURLY = "}";

    this.from = function (source) {
        var plainSource, mediaQueries;
        plainSource = CommentUtil.purgeCommentsFrom(source);
        mediaQueries = optimize(parse(plainSource));
        return stringify(mediaQueries);
    };

    parse = function (source) {
        var chunks, idx, cl, parsedMediaQueries;
        parsedMediaQueries = [];
        chunks = StyleSheetChunker.from(source);
        for (idx = 0, cl = chunks.length; idx < cl; idx += 1) {
            try {
                parsedMediaQueries.push(MediaQueryParser.parse(chunks[idx]));
            } catch (ignore) {
            }
        }
        return parsedMediaQueries;
    };
    optimize = function (mediaQueries) {
        var currentMediaQueryCount;
        currentMediaQueryCount = -1;
        while (currentMediaQueryCount !== mediaQueries.length) {
            currentMediaQueryCount = mediaQueries.length;
            mediaQueries = MediaQueryMerger.mergeIdentical(mediaQueries);
        }
        mediaQueries.map(MediaQueryOptimizer.optimize);
        return mediaQueries;
    };
    stringify = function (mediaQueries) {
        return mediaQueries.map(stringifyMediaQuery).join("\n");
    };
    stringifyMediaQuery = function (mediaQuery) {
        var generatedResult;
        generatedResult = [];
        generatedResult.push(stringifyMediaQueryHeader(mediaQuery));
        generatedResult.push(mediaQuery.ruleSet.map(stringifyRuleset));
        generatedResult.push(stringifyMediaQueryFooter(mediaQuery));
        return generatedResult.join("");
    };
    stringifyMediaQueryHeader = function (mediaQuery) {
        return (isMediaQuerySpecific(mediaQuery) ? mediaQuery.selector + OPENING_CURLY : "");
    };
    stringifyMediaQueryFooter = function (mediaQuery) {
        return (isMediaQuerySpecific(mediaQuery) ? CLOSING_CURLY : "");
    };
    isMediaQuerySpecific = function (mediaQuery) {
        return (mediaQuery.selector !== "general");
    };
    stringifyRuleset = function (ruleset) {
        var result;
        result = [];
        result.push(ruleset.selector + OPENING_CURLY);
        result.push(ruleset.properties.map(stringifyProperty).join(""));
        result.push(CLOSING_CURLY);
        return result.join("");
    };
    stringifyProperty = function (property, idx, properties) {
        return property + (idx < properties.length - 1 ? ";" : "");
    };
};
