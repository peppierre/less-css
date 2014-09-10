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
        mediaQueries,
        parse,
        optimize,
        generatePlain,
        parseChunk,
        generateMediaQuery;

    this.from = function (source) {
        var currentSource;
        currentSource = CommentUtil.purgeCommentsFrom(source);
        parse(currentSource);
        optimize();
        return generatePlain();
    };

    mediaQueries = [];

    parse = function (source) {
        var chunks;
        chunks = StyleSheetChunker.from(source);
        chunks.map(parseChunk);
    };
    parseChunk = function (chunk) {
        var mediaQuery;
        try {
            mediaQuery = MediaQueryParser.parse(chunk);
            mediaQueries.push(mediaQuery);
        } catch (ignore) { }
    };
    optimize = function () {
        mediaQueries = MediaQueryMerger.mergeIdentical(mediaQueries);
        mediaQueries.map(MediaQueryOptimizer.optimize);
    };
    generatePlain = function () {
        var idx, mqc, generatedResult;
        generatedResult = [];
        for (idx = 0, mqc = mediaQueries.length; idx < mqc; idx += 1) {
            generatedResult.push(generateMediaQuery(idx));
        }
        return generatedResult.join("\n");
    };
    generateMediaQuery = function (idx) {
        var mediaQuery, idx1, rsc, idx2, pc, currentRuleset, generatedResult;
        mediaQuery = mediaQueries[idx];
        generatedResult = [];
        if (mediaQuery.selector !== "general") {
            generatedResult.push(mediaQuery.selector + "{");
        }
        for (idx1 = 0, rsc = mediaQuery.ruleSet.length; idx1 < rsc; idx1 += 1) {
            currentRuleset = mediaQuery.ruleSet[idx1];
            generatedResult.push(currentRuleset.selector + "{");
            for (idx2 = 0, pc = currentRuleset.properties.length; idx2 < pc; idx2 += 1) {
                generatedResult.push(currentRuleset.properties[idx2] + (idx2 < pc - 1 ? ";" : ""));
            }
            generatedResult.push("}");
        }
        if (mediaQuery.selector !== "general") {
            generatedResult.push("}");
        }
        return generatedResult.join("");
    };
};

