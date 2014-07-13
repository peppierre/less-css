/*
 * css-compactor
 * https://github.com/peppierre@gmail.com/css-compactor
 *
 * Copyright (c) 2014 Peter Abraham
 * Licensed under the MIT license.
 */
"use strict";

var clearComments, sortSelectors, generateRuleDescriptor, optimizeProperties, optimizeCssTree, generateCSSTree;
clearComments = function (css) {
    var idxCommentStart, idxCommentEnd, innerCss, returnValue, idx;
    innerCss = css;
    returnValue = {
        css : [],
        comments : []
    };

    while (innerCss.length > 0) {
        idxCommentStart = innerCss.indexOf("/*");
        if (idxCommentStart >= 0) {
            returnValue.css.push(innerCss.substring(0, idxCommentStart));
            innerCss = innerCss.substring(idxCommentStart);
            idxCommentEnd = innerCss.indexOf("*/");
            returnValue.comments.push(innerCss.substring(0, idxCommentEnd + 2));
            innerCss = innerCss.substring(idxCommentEnd + 2);
        } else {
            returnValue.css.push(innerCss);
            innerCss = "";
        }
    }
    for (idx = returnValue.comments.length - 1; idx >= 0; idx -= 1) {
        if (returnValue.comments[idx].indexOf("/*!") !== 0) {
            returnValue.comments.splice(idx, 1);
        }
    }
    returnValue.css = returnValue.css.join("");
    return returnValue;
};
sortSelectors = function (selectors) {
    var innerSelectors, selectorArray, idx;
    innerSelectors = selectors;
    innerSelectors = innerSelectors.replace(/^\s*|\s*$/gi, "");
    innerSelectors = innerSelectors.replace(/\s*,\s*/gi, ",");
    selectorArray = innerSelectors.split(",");
    selectorArray.sort();
    for (idx = selectorArray.length - 1; idx > 0; idx -= 1) {
        if (selectorArray[idx] === selectorArray[idx - 1]) {
            selectorArray.splice(idx, 1);
        }
    }
    return selectorArray.join(",");
};
generateRuleDescriptor = function (rule) {
    var openCurlyBracketIdx, descriptor, rl;
    openCurlyBracketIdx = rule.indexOf("{");
    descriptor = {
        selector : rule.substring(0, openCurlyBracketIdx)
    };
	rl = rule.length;
    rule = rule.substring(openCurlyBracketIdx + 1, rl - (rule[rl - 2] === ";" ? 1 : 0) - (rule[rl - 1] === "}" ? 1 : 0));
    descriptor.properties = rule.split(";");
    return descriptor;
};
optimizeProperties = function (properties) {
    var innerProperties, propertyArray, valueArray, descriptor, idx, pl, duplicatedIdx;
    innerProperties = properties.slice(0);
    propertyArray = [];
    valueArray = [];
    /* split property descriptors to prepare for duplication removal step*/
    for (idx = 0, pl = innerProperties.length; idx < pl; idx += 1) {
        descriptor = innerProperties[idx].split(":");
        descriptor[0] = descriptor[0].replace(/^\s*|\s*$/gi, "");
        descriptor[1] = descriptor[1].replace(/^\s*|\s*$/gi, "");
        propertyArray.push(descriptor[0]);
        valueArray.push(descriptor[1]);
    }
    /* removing duplications */
    for (idx = 0; idx < propertyArray.length; idx += 1) {
        duplicatedIdx = propertyArray.indexOf(propertyArray[idx]);
        if (duplicatedIdx >= 0 && duplicatedIdx !== idx) {
            propertyArray.splice(duplicatedIdx, 1);
            valueArray.splice(duplicatedIdx, 1);
        }
    }
    /* re-join properties and corresponding values for sorting */
    innerProperties = [];
    for (idx = 0, pl = propertyArray.length; idx < pl; idx += 1) {
        innerProperties.push(propertyArray[idx] + ":" + valueArray[idx]);
    }

    return innerProperties.slice(0);
};
optimizeCssTree = function (cssTree) {
    var mediaQuery, idx1, idx2, mqr, isRulesMerged, p1l, p2l, idx3;
    if (!cssTree.mediaQueries) {
        return cssTree;
    }
    isRulesMerged = true;
    while (isRulesMerged) {
        isRulesMerged = false;
        for (mediaQuery in cssTree.mediaQueries) {
            if (cssTree.mediaQueries.hasOwnProperty(mediaQuery) && cssTree.mediaQueries[mediaQuery].join) {
                mqr = cssTree.mediaQueries[mediaQuery];
                /* unify selectors */
                for (idx1 = 0; idx1 < mqr.length; idx1 += 1) {
                    mqr[idx1].selector = sortSelectors(mqr[idx1].selector);
                }
                /* merge rules with equivalent selector */
                for (idx1 = 0; idx1 < mqr.length - 1; idx1 += 1) {
                    idx2 = idx1 + 1;
                    while (idx2 < mqr.length) {
                        if (mqr[idx1].selector === mqr[idx2].selector) {
                            mqr[idx1].properties = mqr[idx1].properties.concat(mqr[idx2].properties);
                            mqr.splice(idx2, 1);
                            isRulesMerged = true;
                        } else {
                            idx2 += 1;
                        }
                    }
                }
                /* remove overridden properties (later properties are effective) */
                for (idx1 = 0; idx1 < mqr.length; idx1 += 1) {
                    mqr[idx1].properties = optimizeProperties(mqr[idx1].properties);
                }
                /* merge rules by equivalent properties */
                for (idx1 = 0; idx1 < mqr.length - 1; idx1 += 1) {
                    idx2 = idx1 + 1;
                    p1l = mqr[idx1].properties.length;
                    while (idx2 < mqr.length) {
                        p2l = mqr[idx2].properties.length;
                        idx3 = 0;
                        while (p1l === p2l && idx3 < p1l && mqr[idx2].properties.indexOf(mqr[idx1].properties[idx3]) >= 0) { idx3 += 1; }
                        if (idx3 === p1l) {
                            mqr[idx1].selector += "," + mqr[idx2].selector;
                            mqr.splice(idx2, 1);
                            isRulesMerged = true;
                        } else {
                            idx2 += 1;
                        }
                    }
                }
            }
        }
    }
    return cssTree;
};
generateCSSTree = function (css) {
    var rst, innerCss, nextRule, resultTree, idxCloseCurlyBracket, idxOpenCurlyBracket, currentMediaQuery;
    rst = clearComments(css);
    innerCss = rst.css.replace(/[\r\n]/gi, "");
    resultTree = {
        comments : rst.comments,
        mediaQueries : {
            "general" : []
        }
    };
    currentMediaQuery = "general";
    while (innerCss.length > 0) {
        idxCloseCurlyBracket = innerCss.indexOf("}");
        nextRule = innerCss.substring(0, idxCloseCurlyBracket + 1);
        innerCss = innerCss.substring(idxCloseCurlyBracket + 1, innerCss.length);
        if (nextRule.indexOf("@media") === 0) {
            idxOpenCurlyBracket = nextRule.indexOf("{");
            currentMediaQuery = nextRule.substring(0, idxOpenCurlyBracket);
            nextRule = nextRule.substring(idxOpenCurlyBracket + 1, nextRule.length);
        }
        if (nextRule !== "}") {
            resultTree.mediaQueries[currentMediaQuery] = resultTree.mediaQueries[currentMediaQuery] || [];
            resultTree.mediaQueries[currentMediaQuery].push(generateRuleDescriptor(nextRule));
        } else {
            currentMediaQuery = "general";
        }
    }
    return optimizeCssTree(resultTree);
};
exports.toLessCss = function (css) {
    var cssTree, result, mediaQuerySelectors, currentMediaQuery, mediaQueryResult, idx, mql, idx2, rl;
    cssTree = generateCSSTree(css);
    result = [].concat(cssTree.comments);

    mediaQuerySelectors = [];
    for (currentMediaQuery in cssTree.mediaQueries) {
        if (cssTree.mediaQueries.hasOwnProperty(currentMediaQuery) && currentMediaQuery !== "general") {
            mediaQuerySelectors.push(currentMediaQuery);
        }
    }
    mediaQuerySelectors.sort();
    mediaQuerySelectors.splice(0, 0, "general");

    for (idx = 0, mql = mediaQuerySelectors.length; idx < mql; idx += 1) {
        mediaQueryResult = [
            (idx !== 0 ? mediaQuerySelectors[idx] + "{" : "")
        ];
        for (idx2 = 0, rl = cssTree.mediaQueries[mediaQuerySelectors[idx]].length; idx2 < rl; idx2 += 1) {
            currentMediaQuery = cssTree.mediaQueries[mediaQuerySelectors[idx]];
            mediaQueryResult.push(currentMediaQuery[idx2].selector + "{" + currentMediaQuery[idx2].properties.join(";") + "}");
        }
        mediaQueryResult.push(idx !== 0 ? "}" : "");
        result.push(mediaQueryResult.join(""));
    }
    return result.join("\n");
};
