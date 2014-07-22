/*
 * less-css
 * https://github.com/peppierre/less-css
 *
 * Copyright (c) 2014 Peter Abraham
 * Licensed under the MIT license.
 */

/*globals exports */
/*jslint node: true */
"use strict";

var CssProcessor;
exports.from = function (sourceCss) {
    var processor;
    processor = new CssProcessor();
    processor.parse(sourceCss);
    processor.optimize();
    processor.generate();
    return processor.toString();
};
CssProcessor = function () {
    var lessified, cssBreakdown, Public, isolateCommentsAndPlainCss, removeSingleLineComments, optimizeMediaQueriesAsMuchAsPossible, optimizeOneMediaQueryAsMuchAsPossible, getSourceChunks, getChunkParts, keepImportantComment, packTemporaryPlainCss, purgeUnnecessarySpacesFromMediaQueries, shortenRule, shortenRuleSelector, shortenRuleProperties, parsePlainIntoMediaQueries, generateRuleDescriptor, resetLessified, insertCommentsAtBeginningOfLessified, appendMediaQueriesToLessified, optimizeSelectors, optimizeProperties, sortSelectors, purgeDuplicatedSelectors, unifySelectorsInMediaQuery, mergeRulesWithEquivalentSelectors, mergeRulesWithEquivalentProperties, removeOverriddenProperties;
    cssBreakdown = {
        comments : [],
        mediaQueries : {
            "general" : []
        },
        plain : ""
    };
    Public = {
        parse : function (source) {
            isolateCommentsAndPlainCss(source);
            parsePlainIntoMediaQueries();
            purgeUnnecessarySpacesFromMediaQueries();
        },
        optimize : function () {
            if (!cssBreakdown.mediaQueries) {
                return;
            }
            optimizeMediaQueriesAsMuchAsPossible();
        },
        generate : function () {
            resetLessified();
            insertCommentsAtBeginningOfLessified();
            appendMediaQueriesToLessified();
        },
        toString : function () {
            return lessified.join("\n");
        }
    };
    isolateCommentsAndPlainCss = function (source) {
        var idx, plainCss, chunks, chunkCount, chunkParts;
        plainCss = [];
        source = removeSingleLineComments(source);
        // chunk: a part of source which contains 0 or 1 section of rules followed by 0 or 1 block comment
        chunks = getSourceChunks(source);
        for (idx = 0, chunkCount = chunks.length; idx < chunkCount; idx += 1) {
            chunkParts = getChunkParts(chunks[idx]);
            plainCss.push(chunkParts.plainCss);
            keepImportantComment(chunkParts.commentContent);
        }
        cssBreakdown.plain = packTemporaryPlainCss(plainCss);
    };
    parsePlainIntoMediaQueries = function () {
        var sourceWorkingCopy, nextRule, idxCloseCurlyBracket, idxOpenCurlyBracket, currentMediaQuery;
        currentMediaQuery = "general";
        sourceWorkingCopy = cssBreakdown.plain;
        idxCloseCurlyBracket = sourceWorkingCopy.indexOf("}");
        while (idxCloseCurlyBracket >= 0) {
            nextRule = sourceWorkingCopy.substring(0, idxCloseCurlyBracket + 1).replace(/^\s*/gi, "");
            sourceWorkingCopy = sourceWorkingCopy.substring(idxCloseCurlyBracket + 1, sourceWorkingCopy.length);
            if (nextRule.indexOf("@media") === 0) {
                idxOpenCurlyBracket = nextRule.indexOf("{");
                currentMediaQuery = nextRule.substring(0, idxOpenCurlyBracket).replace(/\s*$/gi, "");
                nextRule = nextRule.substring(idxOpenCurlyBracket + 1, nextRule.length);
            }
            if (nextRule !== "}") {
                cssBreakdown.mediaQueries[currentMediaQuery] = cssBreakdown.mediaQueries[currentMediaQuery] || [];
                cssBreakdown.mediaQueries[currentMediaQuery].push(generateRuleDescriptor(nextRule));
            } else {
                currentMediaQuery = "general";
            }
            idxCloseCurlyBracket = sourceWorkingCopy.indexOf("}");
        }
    };
    purgeUnnecessarySpacesFromMediaQueries = function () {
        var currentMediaQuery, idx, ruleLength;
        for (currentMediaQuery in cssBreakdown.mediaQueries) {
            if (cssBreakdown.mediaQueries.hasOwnProperty(currentMediaQuery)) {
                for (idx = 0, ruleLength = cssBreakdown.mediaQueries[currentMediaQuery].length; idx < ruleLength; idx += 1) {
                    shortenRule(cssBreakdown.mediaQueries[currentMediaQuery][idx]);
                }
            }
        }
    };
    optimizeMediaQueriesAsMuchAsPossible = function () {
        var mediaQuery, isAtLeastOneRuleMerged;
        isAtLeastOneRuleMerged = true;
        while (isAtLeastOneRuleMerged) {
            isAtLeastOneRuleMerged = false;
            for (mediaQuery in cssBreakdown.mediaQueries) {
                if (cssBreakdown.mediaQueries.hasOwnProperty(mediaQuery) && cssBreakdown.mediaQueries[mediaQuery].join) {
                    isAtLeastOneRuleMerged = optimizeOneMediaQueryAsMuchAsPossible(mediaQuery);
                }
            }
        }
    };
    resetLessified = function () {
        lessified = [];
    };
    insertCommentsAtBeginningOfLessified = function () {
        var temporaryCss;
        temporaryCss = [].concat(cssBreakdown.comments);
        lessified = temporaryCss.concat(lessified);
    };
    appendMediaQueriesToLessified = function () {
        var mediaQuerySelectors, currentMediaQuery, mediaQueryResult, idx, mql, idx2, rl;
        mediaQuerySelectors = [];
        for (currentMediaQuery in cssBreakdown.mediaQueries) {
            if (cssBreakdown.mediaQueries.hasOwnProperty(currentMediaQuery) && currentMediaQuery !== "general") {
                mediaQuerySelectors.push(currentMediaQuery);
            }
        }
        mediaQuerySelectors.sort();
        mediaQuerySelectors.splice(0, 0, "general");
        for (idx = 0, mql = mediaQuerySelectors.length; idx < mql; idx += 1) {
            mediaQueryResult = [
                (idx !== 0 ? mediaQuerySelectors[idx] + "{" : "")
            ];
            for (idx2 = 0, rl = cssBreakdown.mediaQueries[mediaQuerySelectors[idx]].length; idx2 < rl; idx2 += 1) {
                currentMediaQuery = cssBreakdown.mediaQueries[mediaQuerySelectors[idx]];
                mediaQueryResult.push(currentMediaQuery[idx2].selector + "{" + currentMediaQuery[idx2].properties.join(";") + "}");
            }
            mediaQueryResult.push(idx !== 0 ? "}" : "");
            lessified.push(mediaQueryResult.join(""));
        }
    };
    removeSingleLineComments = function (source) {
        return source.replace(new RegExp("\\/\\/.*", "gi"), "");
    };
    getSourceChunks = function (source) {
        return source.split("*/");
    };
    getChunkParts = function (chunk) {
        var parts;
        parts = chunk.split("/*");
        return {
            plainCss : parts[0],
            commentContent : parts[1] || undefined
        };
    };
    keepImportantComment = function (commentContent) {
        if (commentContent && commentContent.indexOf("!") === 0) {
            cssBreakdown.comments.push("/*" + commentContent + "*/");
        }
    };
    packTemporaryPlainCss = function (plainCss) {
        return plainCss.join("").replace(/[\r\n]/gi, "");
    };
    shortenRule = function (descriptor) {
        shortenRuleSelector(descriptor);
        shortenRuleProperties(descriptor);
        return descriptor;
    };
    shortenRuleSelector = function (descriptor) {
        descriptor.selector = descriptor.selector.replace(/^\s*|\s*$/gi, "");
        descriptor.selector = descriptor.selector.replace(/\s*,\s*/gi, ",");
    };
    shortenRuleProperties = function (descriptor) {
        var idx, propertiesLength;
        for (idx = 0, propertiesLength = descriptor.properties.length; idx < propertiesLength; idx += 1) {
            descriptor.properties[idx] = descriptor.properties[idx].replace(/^\s*|\s*$/gi, "");
            descriptor.properties[idx] = descriptor.properties[idx].replace(/\s*:\s*/gi, ":");
        }
    };
    generateRuleDescriptor = function (rule) {
        var openCurlyBracketIdx, descriptor, rl;
        openCurlyBracketIdx = rule.indexOf("{");
        descriptor = {
            selector : rule.substring(0, openCurlyBracketIdx)
        };
        rl = rule.length;
        rule = rule.substring(openCurlyBracketIdx + 1, rl - (rule[rl - 2] === ";" ? 1 : 0) - (rule[rl - 1] === "}" ? 1 : 0));
        descriptor.properties = rule.split(";");
        return descriptor;
    };
    optimizeSelectors = function (selectors) {
        selectors = sortSelectors(selectors);
        selectors = purgeDuplicatedSelectors(selectors);
        return selectors;
    };
    optimizeProperties = function (properties) {
        var innerProperties, propertyArray, valueArray, descriptor, idx, pl, duplicatedIdx;
        innerProperties = properties.slice(0);
        propertyArray = [];
        valueArray = [];
        /* split property descriptors to prepare for duplication removal step*/
        for (idx = 0, pl = innerProperties.length; idx < pl; idx += 1) {
            descriptor = innerProperties[idx].split(":");
            if (descriptor.length >= 2) {
                descriptor[0] = descriptor[0].replace(/^\s*|\s*$/gi, "");
                descriptor[1] = descriptor[1].replace(/^\s*|\s*$/gi, "");
                propertyArray.push(descriptor[0]);
                valueArray.push(descriptor[1]);
            }
        }
        /* removing duplications */
        for (idx = 0; idx < propertyArray.length; idx += 1) {
            duplicatedIdx = propertyArray.indexOf(propertyArray[idx]);
            if (duplicatedIdx >= 0 && duplicatedIdx !== idx) {
                propertyArray.splice(duplicatedIdx, 1);
                valueArray.splice(duplicatedIdx, 1);
            }
        }
        /* re-join properties and corresponding values for sorting */
        innerProperties = [];
        for (idx = 0, pl = propertyArray.length; idx < pl; idx += 1) {
            innerProperties.push(propertyArray[idx] + ":" + valueArray[idx]);
        }
        return innerProperties.slice(0);
    };
    sortSelectors = function (selectors) {
        var splittedSelectors;
        splittedSelectors = selectors.split(",");
        splittedSelectors.sort();
        return splittedSelectors.join(",");
    };
    purgeDuplicatedSelectors = function (selectors) {
        var splittedSelectors, idx;
        splittedSelectors = selectors.split(",");
        for (idx = splittedSelectors.length - 1; idx > 0; idx -= 1) {
            if (splittedSelectors[idx] === splittedSelectors[idx - 1]) {
                splittedSelectors.splice(idx, 1);
            }
        }
        return splittedSelectors.join(",");
    };
    optimizeOneMediaQueryAsMuchAsPossible = function (mediaQuery) {
        var isAtLeastTwoRulesMergedBySelectors, isAtLeastTwoRulesMergedByProperties;
        unifySelectorsInMediaQuery(mediaQuery);
        isAtLeastTwoRulesMergedBySelectors = mergeRulesWithEquivalentSelectors(mediaQuery);
        removeOverriddenProperties(mediaQuery);
        isAtLeastTwoRulesMergedByProperties = mergeRulesWithEquivalentProperties(mediaQuery);
        return (isAtLeastTwoRulesMergedBySelectors || isAtLeastTwoRulesMergedByProperties);
    };
    unifySelectorsInMediaQuery = function (mediaQuery) {
        var mqr, idx;
        mqr = cssBreakdown.mediaQueries[mediaQuery];
        for (idx = 0; idx < mqr.length; idx += 1) {
            mqr[idx].selector = optimizeSelectors(mqr[idx].selector);
        }
    };
    mergeRulesWithEquivalentSelectors = function (mediaQuery) {
        var mqr, idx1, idx2, isAtLeastOneRuleMerged;
        isAtLeastOneRuleMerged = false;
        mqr = cssBreakdown.mediaQueries[mediaQuery];
        for (idx1 = 0; idx1 < mqr.length - 1; idx1 += 1) {
            idx2 = idx1 + 1;
            while (idx2 < mqr.length) {
                if (mqr[idx1].selector === mqr[idx2].selector) {
                    mqr[idx1].properties = mqr[idx1].properties.concat(mqr[idx2].properties);
                    mqr.splice(idx2, 1);
                    isAtLeastOneRuleMerged = true;
                } else {
                    idx2 += 1;
                }
            }
        }
        return isAtLeastOneRuleMerged;
    };
    mergeRulesWithEquivalentProperties = function (mediaQuery) {
        var mqr, idx1, idx2, isAtLeastOneRuleMerged, p1l, p2l, idx3;
        isAtLeastOneRuleMerged = false;
        mqr = cssBreakdown.mediaQueries[mediaQuery];
        for (idx1 = 0; idx1 < mqr.length - 1; idx1 += 1) {
            idx2 = idx1 + 1;
            p1l = mqr[idx1].properties.length;
            while (idx2 < mqr.length) {
                p2l = mqr[idx2].properties.length;
                idx3 = 0;
                while (p1l === p2l && idx3 < p1l && mqr[idx2].properties.indexOf(mqr[idx1].properties[idx3]) >= 0) { idx3 += 1; }
                if (idx3 === p1l) {
                    mqr[idx1].selector += "," + mqr[idx2].selector;
                    mqr.splice(idx2, 1);
                    isAtLeastOneRuleMerged = true;
                } else {
                    idx2 += 1;
                }
            }
        }
        return isAtLeastOneRuleMerged;
    };
    removeOverriddenProperties = function (mediaQuery) {
        var mqr, idx;
        mqr = cssBreakdown.mediaQueries[mediaQuery];
        for (idx = 0; idx < mqr.length; idx += 1) {
            mqr[idx].properties = optimizeProperties(mqr[idx].properties);
        }
    };
    return Public;
};
