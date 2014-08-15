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

exports.from = function (source) {
    var processor;
    processor = new CssProcessor(source);
    processor.parse();
    processor.optimize();
    return processor.toString();
};

CssProcessor = function (css) {
    var Public, structure, source,
        cutOutComments,
        removeSingleLineComments,
        parseMediaQueries,
        getChunks,
        getNextChunk,
        getNextChunkSeparator,
        getChunkEndingPosition,
        getSubstringPositionInSource,
        parseChunks,
        parseChunk,
        correctChunk,
        getMediaQuerySelectorFrom,
        getMediaQueryRuleSetFrom,
        getRules,
        getRulesFrom,
        getRuleFrom,
        getRuleSelectorFrom,
        getRulePropertiesFrom,
        getProperties,
        prepareMediaQueries,
        prepareMediaQuery,
        prepareMediaQuerySelector,
        prepareMediaQueryRuleSet,
        prepareRule,
        prepareRuleSelector,
        sortSelectors,
        purgeDuplicatedSelectors,
        prepareRuleProperties,
        keepImportantComments,
        mergeIdenticalMediaQueries,
        optimizeMediaQueries,
        optimizeMediaQuery,
        mergeRulesWithEquivalentSelectors,
        mergeRulesWithEquivalentProperties,
        removeOverriddenProperties,
        optimizeProperties,
        generateComments,
        generateMediaQueries,
        generateMediaQuery,
        toCompleteString,
        isAdditionalNewLineRequirred,
        trimTrailingWhitespaces,
        trimWhitespacesAroundCommas,
        trimWhitespacesAroundColons,
        trimWhitespacesAroundBrackets;
    Public = {
        parse : function () {
            cutOutComments();
            parseMediaQueries();
            prepareMediaQueries();
        },
        optimize : function () {
            keepImportantComments();
            mergeIdenticalMediaQueries();
            optimizeMediaQueries();
        },
        toString : function () {
            var plainComments, plainRules;
            plainComments = generateComments();
            plainRules = generateMediaQueries();
            return toCompleteString(plainComments, plainRules);
        }
    };
    source = css;
    structure = {
        comments : [],
        mediaQueries : []
    };
    cutOutComments = function () {
        var regExpForComments;
        source = removeSingleLineComments();
        /*jslint regexp:true */
        regExpForComments = /\/\*[^*]*\*+([^\/][^*]*\*+)*\//gi;
        /*jslint regexp:false */
        structure.comments = source.match(regExpForComments) || [];
        source = source.replace(regExpForComments, "");
    };
    removeSingleLineComments = function () {
        return source.replace(new RegExp("\\/\\/.*(\n|$)", "gi"), "");
    };
    parseMediaQueries = function () {
        var chunks;
        chunks = getChunks();
        parseChunks(chunks);
    };
    getChunks = function () {
        var chunks;
        chunks = [];
        while (source !== "") {
            chunks.push(getNextChunk());
        }
        return chunks;
    };
    getNextChunk = function () {
        var separator, nextChunk, chunkEndingPosition;
        separator = getNextChunkSeparator();
        chunkEndingPosition = getChunkEndingPosition(separator);
        nextChunk = source.substring(0, chunkEndingPosition);
        source = source.substring(chunkEndingPosition);
        return nextChunk;
    };
    getNextChunkSeparator = function () {
        return (source.indexOf("@media") > 0 ? "@media" : "}}");
    };
    getChunkEndingPosition = function (separator) {
        var separatorPosition;
        separatorPosition = getSubstringPositionInSource(separator);
        if (separator === "@media") {
            return separatorPosition;
        }
        if (separatorPosition >= 0) {
            return source.indexOf(separator) + separator.length;
        }
        return source.length;
    };
    getSubstringPositionInSource = function (sub) {
        return source.indexOf(sub);
    };
    parseChunks = function (chunks) {
        var idx, chunkCount;
        for (idx = 0, chunkCount = chunks.length; idx < chunkCount; idx += 1) {
            parseChunk(chunks[idx]);
        }
    };
    parseChunk = function (chunk) {
        var mediaQuery;
        try {
            chunk = correctChunk(chunk);
            mediaQuery = {
                selector : getMediaQuerySelectorFrom(chunk),
                ruleSet : getMediaQueryRuleSetFrom(chunk)
            };
            structure.mediaQueries.push(mediaQuery);
        } catch (ignore) {

        }
    };
    correctChunk = function (chunk) {
        if (trimTrailingWhitespaces(chunk) === "") {
            throw new Error("No chunk to parse");
        }
        if (chunk.indexOf("@media") !== 0) {
            chunk = "general{" + chunk + "}";
        }
        return chunk;
    };
    getMediaQuerySelectorFrom = function (chunk) {
        return chunk.substring(0, chunk.indexOf("{"));
    };
    getMediaQueryRuleSetFrom = function (chunk) {
        var plainRuleSet, plainRules;
        plainRuleSet = chunk.substring(chunk.indexOf("{") + 1, chunk.length - 1);
        plainRules = getRules(plainRuleSet);
        return getRulesFrom(plainRules);
    };
    getRules = function (ruleSet) {
        var separator;
        separator = "-=*=-";
        ruleSet = ruleSet.replace(/\}/gi, "}" + separator);
        return ruleSet.split(separator);
    };
    getRulesFrom = function (plainRules) {
        var idx, ruleCount, rules;
        for (idx = 0, ruleCount = plainRules.length, rules = []; idx < ruleCount; idx += 1) {
            try {
                rules.push(getRuleFrom(plainRules[idx]));
            } catch (ignore) {

            }
        }
        return rules;
    };
    getRuleFrom = function (plainRule) {
        if (trimTrailingWhitespaces(plainRule) === "") {
            throw new Error("No rule to parse");
        }
        return {
            "selector" : getRuleSelectorFrom(plainRule),
            "properties" : getRulePropertiesFrom(plainRule)
        };
    };
    getRuleSelectorFrom = function (plainRule) {
        return plainRule.substring(0, plainRule.indexOf("{"));
    };
    getRulePropertiesFrom = function (plainRule) {
        var plainPropertySet, plainProperties;
        plainPropertySet = plainRule.substring(plainRule.indexOf("{") + 1, plainRule.length - 1);
        plainProperties = getProperties(plainPropertySet);
        return plainProperties;
    };
    getProperties = function (plainProperties) {
        return plainProperties.split(";");
    };
    prepareMediaQueries = function () {
        structure.mediaQueries.map(prepareMediaQuery);
    };
    prepareMediaQuery = function (mediaQuery) {
        prepareMediaQuerySelector(mediaQuery);
        prepareMediaQueryRuleSet(mediaQuery);
    };
    prepareMediaQuerySelector = function (mediaQuery) {
        mediaQuery.selector = trimTrailingWhitespaces(mediaQuery.selector);
        mediaQuery.selector = trimWhitespacesAroundCommas(mediaQuery.selector);
        mediaQuery.selector = trimWhitespacesAroundBrackets(mediaQuery.selector);
        mediaQuery.selector = trimWhitespacesAroundColons(mediaQuery.selector);
    };
    prepareMediaQueryRuleSet = function (mediaQuery) {
        mediaQuery.ruleSet.map(prepareRule);
    };
    prepareRule = function (rule) {
        prepareRuleSelector(rule);
        prepareRuleProperties(rule);
    };
    prepareRuleSelector = function (rule) {
        rule.selector = trimTrailingWhitespaces(rule.selector);
        rule.selector = trimWhitespacesAroundCommas(rule.selector);
        rule.selector = sortSelectors(rule.selector);
        rule.selector = purgeDuplicatedSelectors(rule.selector);
    };
    prepareRuleProperties = function (rule) {
        var idx, propertyCount;
        for (idx = 0, propertyCount = rule.properties.length; idx < propertyCount; idx += 1) {
            rule.properties[idx] = trimTrailingWhitespaces(rule.properties[idx]);
            rule.properties[idx] = trimWhitespacesAroundCommas(rule.properties[idx]);
            rule.properties[idx] = trimWhitespacesAroundColons(rule.properties[idx]);
        }
    };
    sortSelectors = function (selectors) {
        var sorted;
        sorted = selectors.split(",");
        sorted.sort();
        return sorted.join(",");
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
    keepImportantComments = function () {
        var idx, importantComments;
        for (idx = structure.comments.length - 1, importantComments = []; idx >= 0; idx -= 1) {
            if (structure.comments[idx].indexOf("/*!") === 0) {
                importantComments.push(structure.comments[idx]);
            }
        }
        structure.comments = importantComments;
    };
    mergeIdenticalMediaQueries = function () {
        var selectors, idx, duplicatedIdx;
        selectors = structure.mediaQueries.map(
            function (mediaQuery) {
                return mediaQuery.selector;
            }
        );
        for (idx = 0; idx < selectors.length; idx += 1) {
            duplicatedIdx = selectors.indexOf(selectors[idx], idx + 1);
            if (duplicatedIdx >= 0) {
                structure.mediaQueries[idx].ruleSet = structure.mediaQueries[idx].ruleSet.concat(structure.mediaQueries[duplicatedIdx].ruleSet);
                structure.mediaQueries.splice(duplicatedIdx, 1);
                selectors.splice(duplicatedIdx, 1);
            }
        }
    };
    optimizeMediaQueries = function () {
        structure.mediaQueries.map(optimizeMediaQuery);
    };
    optimizeMediaQuery = function (mediaQuery) {
        var isAtLeastTwoRulesMergedBySelectors, isAtLeastTwoRulesMergedByProperties;
        isAtLeastTwoRulesMergedBySelectors = true;
        isAtLeastTwoRulesMergedByProperties = true;
        while (isAtLeastTwoRulesMergedBySelectors || isAtLeastTwoRulesMergedByProperties) {
            prepareMediaQueryRuleSet(mediaQuery);
            isAtLeastTwoRulesMergedBySelectors = mergeRulesWithEquivalentSelectors(mediaQuery);
            removeOverriddenProperties(mediaQuery);
            isAtLeastTwoRulesMergedByProperties = mergeRulesWithEquivalentProperties(mediaQuery);
        }
    };
    mergeRulesWithEquivalentSelectors = function (mediaQuery) {
        var idx1, idx2, isAtLeastOneRuleMerged;
        isAtLeastOneRuleMerged = false;
        for (idx1 = 0; idx1 < mediaQuery.ruleSet.length - 1; idx1 += 1) {
            idx2 = idx1 + 1;
            while (idx2 < mediaQuery.ruleSet.length) {
                if (mediaQuery.ruleSet[idx1].selector === mediaQuery.ruleSet[idx2].selector) {
                    mediaQuery.ruleSet[idx1].properties = mediaQuery.ruleSet[idx1].properties.concat(mediaQuery.ruleSet[idx2].properties);
                    mediaQuery.ruleSet.splice(idx2, 1);
                    isAtLeastOneRuleMerged = true;
                } else {
                    idx2 += 1;
                }
            }
        }
        return isAtLeastOneRuleMerged;
    };
    mergeRulesWithEquivalentProperties = function (mediaQuery) {
        var ruleset, idx1, idx2, isAtLeastOneRuleMerged, p1l, p2l, idx3;
        ruleset = mediaQuery.ruleSet;
        isAtLeastOneRuleMerged = false;
        for (idx1 = 0; idx1 < ruleset.length - 1; idx1 += 1) {
            idx2 = idx1 + 1;
            p1l = ruleset[idx1].properties.length;
            while (idx2 < ruleset.length) {
                p2l = ruleset[idx2].properties.length;
                idx3 = 0;
                while (p1l === p2l && idx3 < p1l && ruleset[idx1].properties.indexOf(ruleset[idx1].properties[idx3]) >= 0) { idx3 += 1; }
                if (idx3 === p1l) {
                    ruleset[idx1].selector += "," + ruleset[idx2].selector;
                    ruleset.splice(idx2, 1);
                    isAtLeastOneRuleMerged = true;
                } else {
                    idx2 += 1;
                }
            }
        }
        return isAtLeastOneRuleMerged;
    };
    removeOverriddenProperties = function (mediaQuery) {
        mediaQuery.ruleSet.map(optimizeProperties);
    };
    optimizeProperties = function (ruleset) {
        var propertyArray, valueArray, idx, pl, descriptor, duplicatedIdx;
        propertyArray = [];
        valueArray = [];
        /* split property descriptors to prepare for duplication removal step*/
        for (idx = 0, pl = ruleset.properties.length; idx < pl; idx += 1) {
            descriptor = ruleset.properties[idx].split(":");
            if (descriptor.length >= 2) {
                descriptor[0] = descriptor[0].replace(/^\s*|\s*$/gi, "");
                descriptor[1] = descriptor[1].replace(/^\s*|\s*$/gi, "");
                propertyArray.push(descriptor[0]);
                valueArray.push(descriptor[1]);
            }
        }
        /* removing duplications */
        for (idx = propertyArray.length - 1; idx >= 0; idx -= 1) {
            duplicatedIdx = propertyArray.indexOf(propertyArray[idx]);
            if (duplicatedIdx >= 0 && duplicatedIdx !== idx) {
                propertyArray.splice(duplicatedIdx, 1);
                valueArray.splice(duplicatedIdx, 1);
            }
        }
        /* re-join properties and corresponding values for sorting */
        ruleset.properties = [];
        for (idx = 0, pl = propertyArray.length; idx < pl; idx += 1) {
            ruleset.properties.push(propertyArray[idx] + ":" + valueArray[idx]);
        }
    };
    generateComments = function () {
        return structure.comments.join("\n");
    };
    generateMediaQueries = function () {
        var idx, mqc, generatedResult;
        generatedResult = [];
        for (idx = 0, mqc = structure.mediaQueries.length; idx < mqc; idx += 1) {
            generatedResult.push(generateMediaQuery(idx));
        }
        return generatedResult.join("\n");
    };
    generateMediaQuery = function (idx) {
        var mediaQuery, idx1, rsc, idx2, pc, currentRuleset, generatedResult;
        mediaQuery = structure.mediaQueries[idx];
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
    toCompleteString = function (comments, rules) {
        return comments + (isAdditionalNewLineRequirred(comments) ? "\n" : "") + (rules || "");
    };
    isAdditionalNewLineRequirred = function (comments) {
        return (comments !== "");
    };
    trimTrailingWhitespaces = function (text) {
        return text.replace(/^\s*|\s*$/gi, "");
    };
    trimWhitespacesAroundCommas = function (text) {
        return text.replace(/\s*,\s*/gi, ",");
    };
    trimWhitespacesAroundColons = function (text) {
        return text.replace(/\s*:\s*/gi, ":");
    };
    trimWhitespacesAroundBrackets = function (text) {
        return text.replace(/\s*[\(]\s*/gi, " (").replace(/\s*[\)]\s*/gi, ") ").replace(/\)\s*$/gi, ")");
    };
    return Public;
};

