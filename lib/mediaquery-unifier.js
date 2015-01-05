/*
 * mediaquery-unifier
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
    unifyMediaQuerySelector,
    unifyMediaQueryRuleSet,
    unifyRule,
    unifyRuleSelector,
    unifyRuleProperties,
    sortSelectors,
    purgeDuplicatedSelectors;

StringUnifier = require("./string-unifier.js");

module.exports.unify = function (mediaQuery) {
    unifyMediaQuerySelector(mediaQuery);
    unifyMediaQueryRuleSet(mediaQuery);
};

unifyMediaQuerySelector = function (mediaQuery) {
    mediaQuery.selector = StringUnifier.trimTrailingWhitespaces(mediaQuery.selector);
    mediaQuery.selector = StringUnifier.trimWhitespacesAroundCommas(mediaQuery.selector);
    mediaQuery.selector = StringUnifier.trimWhitespacesAroundBrackets(mediaQuery.selector);
    mediaQuery.selector = StringUnifier.trimWhitespacesAroundColons(mediaQuery.selector);
    mediaQuery.selector = StringUnifier.reduceWhiteSpaces(mediaQuery.selector);
};

unifyMediaQueryRuleSet = function (mediaQuery) {
    mediaQuery.ruleSet.map(unifyRule);
};

unifyRule = function (rule) {
    unifyRuleSelector(rule);
    unifyRuleProperties(rule);
};

unifyRuleSelector = function (rule) {
    rule.selector = StringUnifier.trimTrailingWhitespaces(rule.selector);
    rule.selector = StringUnifier.trimWhitespacesAroundCommas(rule.selector);
    rule.selector = sortSelectors(rule.selector);
    rule.selector = purgeDuplicatedSelectors(rule.selector);
};

unifyRuleProperties = function (rule) {
    var idx, propertyCount;
    for (idx = 0, propertyCount = rule.properties.length; idx < propertyCount; idx += 1) {
        rule.properties[idx] = StringUnifier.trimTrailingWhitespaces(rule.properties[idx]);
        rule.properties[idx] = StringUnifier.trimWhitespacesAroundCommas(rule.properties[idx]);
        rule.properties[idx] = StringUnifier.trimWhitespacesAroundColons(rule.properties[idx]);
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
