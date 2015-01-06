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
    initializeFlags,
    appliedMergeFlags,
    mergeBySelector,
    mergeByProperties,
    cleanProperties,
    optimizeProperties,
    isRulesetsMergeable,
    parseProperty;

MediaQueryUnifier = require("./mediaquery-unifier.js");

module.exports.optimize = function (mediaQuery) {
    initializeFlags();
    while (appliedMergeFlags.bySelector || appliedMergeFlags.byProperties) {
        MediaQueryUnifier.unify(mediaQuery);
        mergeBySelector(mediaQuery);
        cleanProperties(mediaQuery);
        mergeByProperties(mediaQuery);
    }
};

initializeFlags = function () {
    appliedMergeFlags = {
        bySelector: true,
        byProperties: true
    };
};

mergeBySelector = function (mediaQuery) {
    var idx1, idx2, isRulesetsMergable, mergeRulesets;
    mergeRulesets = function (targetIndex, sourceIndex) {
        mediaQuery.ruleSet[targetIndex].properties = mediaQuery.ruleSet[targetIndex].properties.concat(mediaQuery.ruleSet[sourceIndex].properties);
        mediaQuery.ruleSet.splice(sourceIndex, 1);
        appliedMergeFlags.bySelector = true;
    };
    appliedMergeFlags.bySelector = false;
    for (idx1 = 0; idx1 < mediaQuery.ruleSet.length - 1; idx1 += 1) {
        idx2 = idx1 + 1;
        while (idx2 < mediaQuery.ruleSet.length) {
            isRulesetsMergable = (mediaQuery.ruleSet[idx1].selector === mediaQuery.ruleSet[idx2].selector);
            if (isRulesetsMergable) {
                mergeRulesets(idx1, idx2);
            } else {
                idx2 += 1;
            }
        }
    }
};
mergeByProperties = function (mediaQuery) {
    var ruleset, mergeIndices, initializeNextMergeCycle;
    ruleset = mediaQuery.ruleSet;
    appliedMergeFlags.byProperties = false;
    mergeIndices = {
        mergeInto : -1,
        examined : ruleset.length
    };

    initializeNextMergeCycle = function () {
        mergeIndices.examined += 1;
        if (mergeIndices.examined >= ruleset.length) {
            mergeIndices.mergeInto += 1;
            mergeIndices.examined = mergeIndices.mergeInto + 1;
        }
    };

    initializeNextMergeCycle();
    while (mergeIndices.mergeInto < ruleset.length - 1) {
        if (isRulesetsMergeable(ruleset[mergeIndices.mergeInto], ruleset[mergeIndices.examined])) {
            ruleset[mergeIndices.mergeInto].selector += "," + ruleset[mergeIndices.examined].selector;
            ruleset.splice(mergeIndices.examined, 1);
            appliedMergeFlags.byProperties = true;
        }
        initializeNextMergeCycle();
    }
};
cleanProperties = function (mediaQuery) {
    mediaQuery.ruleSet.map(optimizeProperties);
};
optimizeProperties = function (ruleset) {
    var splittedProperties, initializeOptimization, splitPropertyIntoChunks, removeDuplications,rejoinPropertyChunks;
    splittedProperties = {
        names : [],
        values : []
    };

    initializeOptimization = function () {
        ruleset.properties.forEach(splitPropertyIntoChunks);
    };
    splitPropertyIntoChunks = function (property) {
        var descriptor;
        descriptor = parseProperty(property);
        if (descriptor.length === 2) {
            descriptor[0] = descriptor[0].replace(/^\s*|\s*$/gi, "");
            descriptor[1] = descriptor[1].replace(/^\s*|\s*$/gi, "");
            splittedProperties.names.push(descriptor[0]);
            splittedProperties.values.push(descriptor[1]);
        }
    };
    removeDuplications = function () {
        var isMergeableProperty, idx, duplicatedIdx;
        isMergeableProperty = function (toCompareIndex, compareToIndex) {
            return (compareToIndex >= 0 && compareToIndex !== toCompareIndex);
        };
        for (idx = splittedProperties.names.length - 1; idx >= 0; idx -= 1) {
            duplicatedIdx = splittedProperties.names.indexOf(splittedProperties.names[idx]);
            if (isMergeableProperty(idx, duplicatedIdx)) {
                splittedProperties.names.splice(duplicatedIdx, 1);
                splittedProperties.values.splice(duplicatedIdx, 1);
            }
        }
    };
    rejoinPropertyChunks = function (propertyName, index) {
        return (propertyName + (propertyName.indexOf(":") < 0 ? ":" : "(") + splittedProperties.values[index]);
    };

    initializeOptimization();
    removeDuplications();
    ruleset.properties = splittedProperties.names.map(rejoinPropertyChunks);
};
isRulesetsMergeable = function (ruleset1, ruleset2) {
    var p1l, p2l, idx3;
    p1l = ruleset1.properties.length;
    p2l = ruleset2.properties.length;
    idx3 = 0;
    while (p1l === p2l && idx3 < p1l && ruleset1.properties.indexOf(ruleset2.properties[idx3]) >= 0) {
        idx3 += 1;
    }
    return (idx3 === p1l);
};
parseProperty = function (property) {
    var propertyName, propertyValue, colonPosition, bracketPosition, isSpecialProperty;
    colonPosition = property.indexOf(":");
    bracketPosition = property.indexOf("(");
    if (colonPosition < 0) {
        return [];
    }
    isSpecialProperty = (bracketPosition >= 0);
    propertyName = property.substring(0, (isSpecialProperty ? bracketPosition : colonPosition));
    propertyValue = property.substring((isSpecialProperty ? bracketPosition : colonPosition) + 1);
    return [propertyName, propertyValue];
};
