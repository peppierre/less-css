/*
 * comment-parser
 * https://github.com/peppierre/less-css
 *
 * Copyright (c) 2014 Peter Abraham
 * Licensed under the MIT license.
 */

/*globals module */
/*jslint node: true */
"use strict";

var
    CommentUtil,
    keepImportantComments,
    isImportantComment;

CommentUtil = require("./comment-util.js");

module.exports.parse = function (source) {
    var comments, purgedComments;
    comments = CommentUtil.getCommentsFrom(source);
    purgedComments = keepImportantComments(comments);
    return purgedComments;
};

keepImportantComments = function (comments) {
    var importantComments;
    importantComments = comments.filter(isImportantComment);
    return importantComments;
};

isImportantComment = function (comment) {
    return (comment.indexOf("/*!") === 0);
};
