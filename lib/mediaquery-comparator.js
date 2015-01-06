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
    var idx, mql, areIdenticals;
    areIdenticals = (source.length === compareTo.length);
    idx = 0;
    mql = source.length;
    while (areIdenticals && idx < mql) {
        areIdenticals = areIdenticals && module.exports.areMediaQueriesIdentical(source[idx], compareTo[idx]);
        idx += 1;
    }
    return areIdenticals;
};

module.exports.areMediaQueriesIdentical = function (source, compareTo) {
    var areIdenticals;
    areIdenticals = (source.selector === compareTo.selector);
    areIdenticals = areIdenticals && areRulesIdentical(source.ruleSet, compareTo.ruleSet);
    return areIdenticals;
};

areRulesIdentical = function (source, compareTo) {
    var idx, rl, areIdenticals;
    areIdenticals = (source.length === compareTo.length);
    idx = 0;
    rl = source.length;
    while (areIdenticals && idx < rl) {
        areIdenticals = areIdenticals && (source[idx].selector === compareTo[idx].selector);
        areIdenticals = areIdenticals && arePropertiesIdentical(source[idx].properties, compareTo[idx].properties);
        idx += 1;
    }
    return areIdenticals;
};

arePropertiesIdentical = function (source, compareTo) {
    var idx, pl, areIdenticals;
    areIdenticals = (source.length === compareTo.length);
    idx = 0;
    pl = source.length;
    while (areIdenticals && idx < pl) {
        areIdenticals = areIdenticals && (source[idx] === compareTo[idx]);
        idx += 1;
    }
    return areIdenticals;
};
