/*
 * less-css
 * https://github.com/peppierre/less-css
 *
 * Copyright (c) 2014 Peter Abraham
 * Licensed under the MIT license.
 */

/*globals module */
/*jslint node: true */
"use strict";

var
    CssProcessor;

CssProcessor = require('./css-processor.js');

module.exports.from = function(source) {
    var cssProcessor;

    cssProcessor = new CssProcessor();
    return cssProcessor.from(source);
};
