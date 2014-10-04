/*
 * mediaquery-optimizer
 * https://github.com/peppierre/less-css
 *
 * Copyright (c) 2014 Peter Abraham
 * Licensed under the MIT license.
 */

/*globals module */
/*jslint node: true */
"use strict";

var
    MediaQueryUnifier,
    mergeRulesWithEquivalentSelectors,
    mergeRulesWithEquivalentProperties,
    removeOverriddenProperties,
    optimizeProperties;

MediaQueryUnifier = require("./mediaquery-unifier.js");

module.exports.optimize = function (mediaQuery) {
    var isAtLeastTwoRulesMergedBySelectors, isAtLeastTwoRulesMergedByProperties;
    isAtLeastTwoRulesMergedBySelectors = true;
    isAtLeastTwoRulesMergedByProperties = true;
    while (isAtLeastTwoRulesMergedBySelectors || isAtLeastTwoRulesMergedByProperties) {
        MediaQueryUnifier.unify(mediaQuery);
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
    idx1 = 0;
    idx2 = idx1 + 1;
    while (idx1 < ruleset.length - 1) {
        p1l = ruleset[idx1].properties.length;
        p2l = ruleset[idx2].properties.length;
        idx3 = 0;
        while (p1l === p2l && idx3 < p1l && ruleset[idx1].properties.indexOf(ruleset[idx2].properties[idx3]) >= 0) {
            idx3 += 1;
        }
        if (idx3 === p1l) {
            ruleset[idx1].selector += "," + ruleset[idx2].selector;
            ruleset.splice(idx2, 1);
            isAtLeastOneRuleMerged = true;
        }
        idx2 += 1;
        if (idx2 >= ruleset.length) {
            idx1 += 1;
            idx2 = idx1 + 1;
        }
    }
    return isAtLeastOneRuleMerged;
};
removeOverriddenProperties = function (mediaQuery) {
    mediaQuery.ruleSet.map(optimizeProperties);
};
optimizeProperties = function (ruleset) {
    var parseProperty, isMergableProperty, propertyArray, valueArray, idx, pl, descriptor, duplicatedIdx;
    propertyArray = [];
    valueArray = [];

    parseProperty = function (property) {
        var propertyName, propertyValue, colonPosition, bracketPosition, isSpecialProperty;
        colonPosition = property.indexOf(":");
        bracketPosition = property.indexOf("(");
        if (colonPosition < 0) {
            return [];
        }
        isSpecialProperty = (bracketPosition >= 0);
        if (isSpecialProperty) {
            propertyName = property.substring(0, bracketPosition);
            propertyValue = property.substring(bracketPosition + 1);
        } else {
            propertyName = property.substring(0, colonPosition);
            propertyValue = property.substring(colonPosition + 1);
        }
        return [propertyName, propertyValue];
    };
    isMergableProperty = function (toCompareIndex, compareToIndex) {
        return (compareToIndex >= 0 && compareToIndex !== toCompareIndex);
    };

    /* split property descriptors to prepare for duplication removal step*/
    for (idx = 0, pl = ruleset.properties.length; idx < pl; idx += 1) {
        descriptor = parseProperty(ruleset.properties[idx]);
        if (descriptor.length === 2) {
            descriptor[0] = descriptor[0].replace(/^\s*|\s*$/gi, "");
            descriptor[1] = descriptor[1].replace(/^\s*|\s*$/gi, "");
            propertyArray.push(descriptor[0]);
            valueArray.push(descriptor[1]);
        }
    }
    /* removing duplications */
    for (idx = propertyArray.length - 1; idx >= 0; idx -= 1) {
        duplicatedIdx = propertyArray.indexOf(propertyArray[idx]);
        if (isMergableProperty(idx, duplicatedIdx)) {
            propertyArray.splice(duplicatedIdx, 1);
            valueArray.splice(duplicatedIdx, 1);
        }
    }
    /* re-join properties and corresponding values for sorting */
    ruleset.properties = [];
    for (idx = 0, pl = propertyArray.length; idx < pl; idx += 1) {
        ruleset.properties.push(propertyArray[idx] + (propertyArray[idx].indexOf(":") < 0 ? ":" : "(") + valueArray[idx]);
    }
};
