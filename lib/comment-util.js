/*
 * comment-util
 * https://github.com/peppierre/less-css
 *
 * Copyright (c) 2014 Peter Abraham
 * Licensed under the MIT license.
 */

/*globals module */
/*jslint node: true */
"use strict";

var
    blockCommentExpression,
    singleLineBlockExpression,
    removeSingleLineComments;

module.exports.getCommentsFrom = function (source) {
    return source.match(blockCommentExpression) || [];
};

module.exports.purgeCommentsFrom = function (source) {
    source = source.replace(blockCommentExpression, "");
    source = removeSingleLineComments(source);
    return source;
};

removeSingleLineComments = function (source) {
    return source.replace(singleLineBlockExpression, "");
};

/*jslint regexp:true */
blockCommentExpression = /\/\*[^*]*\*+([^\/][^*]*\*+)*\//gi;
singleLineBlockExpression = /\/\/.*(\n|$)/gi;
/*jslint regexp:false */
