/*
 * mediaquery-merger
 * https://github.com/peppierre/less-css
 *
 * Copyright (c) 2014 Peter Abraham
 * Licensed under the MIT license.
 */

/*globals module */
/*jslint node: true */
"use strict";

var
    getSelector;

module.exports.mergeIdentical = function (mediaQueries) {
    var selectors, idx, duplicatedIdx;
    selectors = mediaQueries.map(getSelector);
    for (idx = 0; idx < selectors.length; idx += 1) {
        duplicatedIdx = selectors.indexOf(selectors[idx], idx + 1);
        if (duplicatedIdx >= 0) {
            mediaQueries[idx].ruleSet = mediaQueries[idx].ruleSet.concat(mediaQueries[duplicatedIdx].ruleSet);
            mediaQueries.splice(duplicatedIdx, 1);
            selectors.splice(duplicatedIdx, 1);
        }
    }
    return mediaQueries;
};

getSelector = function (mediaQuery) {
    return mediaQuery.selector;
};
