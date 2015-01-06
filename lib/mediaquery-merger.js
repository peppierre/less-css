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
    var
        selectors,
        idx,
        duplicatedIdx,
        mergeIdenticalBySelector,
        purgeDuplication;

    purgeDuplication = function (duplicationIdx) {
        mediaQueries.splice(duplicationIdx, 1);
        selectors.splice(duplicationIdx, 1);
    };

    mergeIdenticalBySelector = function (currentIdx, duplicationIdx) {
        mediaQueries[currentIdx].ruleSet = mediaQueries[currentIdx].ruleSet.concat(mediaQueries[duplicationIdx].ruleSet);
        purgeDuplication(duplicationIdx);
    };

    selectors = mediaQueries.map(getSelector);
    for (idx = 0; idx < selectors.length; idx += 1) {
        duplicatedIdx = selectors.indexOf(selectors[idx], idx + 1);
        if (duplicatedIdx >= 0) {
            mergeIdenticalBySelector(idx, duplicatedIdx);
        }
    }
    return mediaQueries;
};

getSelector = function (mediaQuery) {
    return mediaQuery.selector;
};
