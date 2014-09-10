/*
 * string-unifier
 * https://github.com/peppierre/less-css
 *
 * Copyright (c) 2014 Peter Abraham
 * Licensed under the MIT license.
 */

/*globals module */
/*jslint node: true */
"use strict";

module.exports.trimTrailingWhitespaces = function (text) {
    return text.replace(/^\s*|\s*$/gi, "");
};

module.exports.trimWhitespacesAroundCommas = function (text) {
    return text.replace(/\s*,\s*/gi, ",");
};

module.exports.trimWhitespacesAroundColons = function (text) {
    return text.replace(/\s*:\s*/gi, ":");
};

module.exports.trimWhitespacesAroundBrackets = function (text) {
    return text.replace(/\s*[\(]\s*/gi, " (").replace(/\s*[\)]\s*/gi, ") ").replace(/\)\s*$/gi, ")");
};
