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
    unifyProperty,
    purgeDuplicatedSelectors,
    filterSelector;

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
    rule.selector = purgeDuplicatedSelectors(rule.selector);
};

unifyRuleProperties = function (rule) {
    rule.properties = rule.properties.map(unifyProperty);
};

unifyProperty = function (property) {
    property = StringUnifier.trimTrailingWhitespaces(property);
    property = StringUnifier.trimWhitespacesAroundCommas(property);
    property = StringUnifier.trimWhitespacesAroundColons(property);
    return property;
};

purgeDuplicatedSelectors = function (selectors) {
    return selectors.split(",").filter(filterSelector).sort().join(",");
};

filterSelector = function (item, index, selectors) {
    return (selectors.indexOf(item) === index);
};
