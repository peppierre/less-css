/*
 * mediaquery-comparator
 * https://github.com/peppierre/less-css
 *
 * Copyright (c) 2014 Peter Abraham
 * Licensed under the MIT license.
 */

/*globals module */
/*jslint node: true */
"use strict";

var
    areRulesIdentical,
    arePropertiesIdentical;

module.exports.areListOfMediaQueriesIdentical = function (source, compareTo) {
    var i, mql, isStillIdentical;
    isStillIdentical = (source.length === compareTo.length);
    i = 0;
    mql = source.length;
    while (isStillIdentical && i < mql) {
        isStillIdentical = isStillIdentical && module.exports.areMediaQueriesIdentical(source[i], compareTo[i]);
        i += 1;
    }
    return isStillIdentical;
};

module.exports.areMediaQueriesIdentical = function (source, compareTo) {
    var isStillIdentical;
    isStillIdentical = (source.selector === compareTo.selector);
    isStillIdentical = isStillIdentical && areRulesIdentical(source.ruleSet, compareTo.ruleSet);
    return isStillIdentical;
};

areRulesIdentical = function (source, compareTo) {
    var i, rl, isStillIdentical;
    isStillIdentical = (source.length === compareTo.length);
    i = 0;
    rl = source.length;
    while (isStillIdentical && i < rl) {
        isStillIdentical = isStillIdentical && (source[i].selector === compareTo[i].selector);
        isStillIdentical = isStillIdentical && arePropertiesIdentical(source[i].properties, compareTo[i].properties);
        i += 1;
    }
    return isStillIdentical;
};

arePropertiesIdentical = function (source, compareTo) {
    var i, pl, isStillIdentical;
    isStillIdentical = (source.length === compareTo.length);
    i = 0;
    pl = source.length;
    while (isStillIdentical && i < pl) {
        isStillIdentical = isStillIdentical && (source[i] === compareTo[i]);
        i += 1;
    }
    return isStillIdentical;
};
