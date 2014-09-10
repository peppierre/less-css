/*
 * mediaquery-parser
 * https://github.com/peppierre/less-css
 *
 * Copyright (c) 2014 Peter Abraham
 * Licensed under the MIT license.
 */

/*globals module */
/*jslint node: true */
"use strict";

var
    StringUnifier,
    correctChunk,
    getMediaQuerySelectorFrom,
    getMediaQueryRuleSetFrom,
    getRules,
    getRulesFrom,
    getRuleFrom,
    getRuleSelectorFrom,
    getRulePropertiesFrom,
    getProperties;

StringUnifier = require("./string-unifier.js");

module.exports.parse = function (chunk) {
    var mediaQuery;
    chunk = correctChunk(chunk);
    mediaQuery = {
        selector : getMediaQuerySelectorFrom(chunk),
        ruleSet : getMediaQueryRuleSetFrom(chunk)
    };
    return mediaQuery;
};
module.exports.stringify = function (mediaQuery) {
    return mediaQuery.toString();
};

correctChunk = function (chunk) {
    if (StringUnifier.trimTrailingWhitespaces(chunk) === "") {
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
        } catch (ignore) {}
    }
    return rules;
};

getRuleFrom = function (plainRule) {
    if (StringUnifier.trimTrailingWhitespaces(plainRule) === "") {
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
