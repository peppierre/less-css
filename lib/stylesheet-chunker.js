/*
 * stylesheet-chunker
 * https://github.com/peppierre/less-css
 *
 * Copyright (c) 2014 Peter Abraham
 * Licensed under the MIT license.
 */

/*globals module */
/*jslint node: true */
"use strict";

var
    currentSource,
    getNextChunk,
    getNextChunkSeparator,
    getChunkEndingPosition,
    getSubstringPositionInSource;

module.exports.from = function (source) {
    var chunks;
    currentSource = source;
    chunks = [];
    while (currentSource !== "") {
        chunks.push(getNextChunk());
    }
    return chunks;
};

getNextChunk = function () {
    var separator, nextChunk, chunkEndingPosition;
    separator = getNextChunkSeparator();
    chunkEndingPosition = getChunkEndingPosition(separator);
    nextChunk = currentSource.substring(0, chunkEndingPosition);
    currentSource = currentSource.substring(chunkEndingPosition);
    return nextChunk;
};
getNextChunkSeparator = function () {
    return (currentSource.indexOf("@media") > 0 ? "@media" : "}}");
};
getChunkEndingPosition = function (separator) {
    var separatorPosition;
    separatorPosition = getSubstringPositionInSource(separator);
    if (separator === "@media") {
        return separatorPosition;
    }
    if (separatorPosition >= 0) {
        return currentSource.indexOf(separator) + separator.length;
    }
    return currentSource.length;
};
getSubstringPositionInSource = function (sub) {
    return currentSource.indexOf(sub);
};
