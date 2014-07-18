/*
 * less-css
 * https://github.com/peppierre/less-css
 *
 * Copyright (c) 2014 Peter Abraham
 * Licensed under the MIT license.
 */

/*globals exports */
/*jslint node: true */
"use strict";

var CssProcessor;
exports.from = function (sourceCss) {
    var processor;
    processor = new CssProcessor();
    processor.parse(sourceCss);
    processor.optimize();
    processor.generate();
    return processor.toString();
};
CssProcessor = function () {
	var lessified, cssBreakdown, Public, isolateCommentsAndPlainCss, purgeUnnecessarySpacesFromMediaQueries, shortenRule, shortenRuleSelector, shortenRuleProperties, parsePlainIntoMediaQueries, generateRuleDescriptor, purgeSpaceFromRule, resetLessified, insertCommentsAtBeginningOfLessified, appendMediaQueriesToLessified, optimizeSelectors, optimizeProperties, sortSelectors, purgeDuplicatedSelectors;
    cssBreakdown = {
        comments : [],
        mediaQueries : {
            "general" : []
        },
        plain : ""
    };
	Public = {
		parse : function (source) {
		    isolateCommentsAndPlainCss(source);
		    parsePlainIntoMediaQueries();
		    purgeUnnecessarySpacesFromMediaQueries();
		},
		optimize : function () {
		    var mediaQuery, idx1, idx2, mqr, isRulesMerged, p1l, p2l, idx3;
		    if (!cssBreakdown.mediaQueries) {
		        return;
		    }
		    isRulesMerged = true;
		    while (isRulesMerged) {
		        isRulesMerged = false;
		        for (mediaQuery in cssBreakdown.mediaQueries) {
		            if (cssBreakdown.mediaQueries.hasOwnProperty(mediaQuery) && cssBreakdown.mediaQueries[mediaQuery].join) {
		                mqr = cssBreakdown.mediaQueries[mediaQuery];
		                /* unify selectors */
		                for (idx1 = 0; idx1 < mqr.length; idx1 += 1) {
		                    mqr[idx1].selector = optimizeSelectors(mqr[idx1].selector);
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
		},
		generate : function () {
			resetLessified();
			insertCommentsAtBeginningOfLessified();
			appendMediaQueriesToLessified();
		},
		toString : function () {
			return lessified.join("\n");
		}
	};
	isolateCommentsAndPlainCss = function (source) {
	    var idxCommentStart, idxCommentEnd, sourceWorkingCopy, idx, plainCss;
	    plainCss = [];
	    sourceWorkingCopy = source;
	    sourceWorkingCopy = sourceWorkingCopy.replace(new RegExp("\\/\\/.*", "gi"), "");
	    while (sourceWorkingCopy.length > 0) {
	        idxCommentStart = sourceWorkingCopy.indexOf("/*");
	        if (idxCommentStart >= 0) {
	            plainCss.push(sourceWorkingCopy.substring(0, idxCommentStart));
	            sourceWorkingCopy = sourceWorkingCopy.substring(idxCommentStart);
	            idxCommentEnd = sourceWorkingCopy.indexOf("*/");
	            cssBreakdown.comments.push(sourceWorkingCopy.substring(0, idxCommentEnd + 2));
	            sourceWorkingCopy = sourceWorkingCopy.substring(idxCommentEnd + 2);
	        } else {
	            plainCss.push(sourceWorkingCopy);
	            sourceWorkingCopy = "";
	        }
	    }
	    for (idx = cssBreakdown.comments.length - 1; idx >= 0; idx -= 1) {
	        if (cssBreakdown.comments[idx].indexOf("/*!") !== 0) {
	            cssBreakdown.comments.splice(idx, 1);
	        }
	    }
	    cssBreakdown.plain = plainCss.join("").replace(/[\r\n]/gi, "");
	};
	parsePlainIntoMediaQueries = function () {
	    var sourceWorkingCopy, nextRule, idxCloseCurlyBracket, idxOpenCurlyBracket, currentMediaQuery;
	    currentMediaQuery = "general";
	    sourceWorkingCopy = cssBreakdown.plain;
	    idxCloseCurlyBracket = sourceWorkingCopy.indexOf("}");
	    while (idxCloseCurlyBracket >= 0) {
	        nextRule = sourceWorkingCopy.substring(0, idxCloseCurlyBracket + 1).replace(/^\s*/gi, "");
	        sourceWorkingCopy = sourceWorkingCopy.substring(idxCloseCurlyBracket + 1, sourceWorkingCopy.length);
	        if (nextRule.indexOf("@media") === 0) {
	            idxOpenCurlyBracket = nextRule.indexOf("{");
	            currentMediaQuery = nextRule.substring(0, idxOpenCurlyBracket).replace(/\s*$/gi, "");
	            nextRule = nextRule.substring(idxOpenCurlyBracket + 1, nextRule.length);
	        }
	        if (nextRule !== "}") {
	            cssBreakdown.mediaQueries[currentMediaQuery] = cssBreakdown.mediaQueries[currentMediaQuery] || [];
	            cssBreakdown.mediaQueries[currentMediaQuery].push(generateRuleDescriptor(nextRule));
	        } else {
	            currentMediaQuery = "general";
	        }
	        idxCloseCurlyBracket = sourceWorkingCopy.indexOf("}");
	    }
	};
	purgeUnnecessarySpacesFromMediaQueries = function () {
	    var currentMediaQuery, idx, ruleLength;
	    for (currentMediaQuery in cssBreakdown.mediaQueries) {
	        if (cssBreakdown.mediaQueries.hasOwnProperty(currentMediaQuery)) {
		        for (idx = 0, ruleLength = cssBreakdown.mediaQueries[currentMediaQuery].length; idx < ruleLength; idx += 1) {
		        	shortenRule(cssBreakdown.mediaQueries[currentMediaQuery][idx]);
		        }
	        }
	    }
	};
	shortenRule = function (descriptor) {
	    shortenRuleSelector(descriptor);
	    shortenRuleProperties(descriptor);
	    return descriptor;
	};
	shortenRuleSelector = function (descriptor) {
	    descriptor.selector = descriptor.selector.replace(/^\s*|\s*$/gi, "");
	    descriptor.selector = descriptor.selector.replace(/\s*,\s*/gi, ",");
	};
	shortenRuleProperties = function (descriptor) {
	    var idx, propertiesLength;
	    for (idx = 0, propertiesLength = descriptor.properties.length; idx < propertiesLength; idx += 1) {
	        descriptor.properties[idx] = descriptor.properties[idx].replace(/^\s*|\s*$/gi, "");
	        descriptor.properties[idx] = descriptor.properties[idx].replace(/\s*:\s*/gi, ":");
	    }
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
	resetLessified = function () {
		lessified = [];
	};
	insertCommentsAtBeginningOfLessified = function () {
		var temporaryCss;
		temporaryCss = [].concat(cssBreakdown.comments);
		lessified = temporaryCss.concat(lessified);
	};
	appendMediaQueriesToLessified = function () {
		var mediaQuerySelectors, currentMediaQuery, mediaQueryResult, idx, mql, idx2, rl;
	    mediaQuerySelectors = [];
	    for (currentMediaQuery in cssBreakdown.mediaQueries) {
	        if (cssBreakdown.mediaQueries.hasOwnProperty(currentMediaQuery) && currentMediaQuery !== "general") {
	            mediaQuerySelectors.push(currentMediaQuery);
	        }
	    }
	    mediaQuerySelectors.sort();
	    mediaQuerySelectors.splice(0, 0, "general");
	
	    for (idx = 0, mql = mediaQuerySelectors.length; idx < mql; idx += 1) {
	        mediaQueryResult = [
	            (idx !== 0 ? mediaQuerySelectors[idx] + "{" : "")
	        ];
	        for (idx2 = 0, rl = cssBreakdown.mediaQueries[mediaQuerySelectors[idx]].length; idx2 < rl; idx2 += 1) {
	            currentMediaQuery = cssBreakdown.mediaQueries[mediaQuerySelectors[idx]];
	            mediaQueryResult.push(currentMediaQuery[idx2].selector + "{" + currentMediaQuery[idx2].properties.join(";") + "}");
	        }
	        mediaQueryResult.push(idx !== 0 ? "}" : "");
	        lessified.push(mediaQueryResult.join(""));
	    }
	};
	optimizeSelectors = function (selectors) {
		selectors = sortSelectors(selectors);
		selectors = purgeDuplicatedSelectors(selectors);
		return selectors;
	};
	optimizeProperties = function (properties) {
	    var innerProperties, propertyArray, valueArray, descriptor, idx, pl, duplicatedIdx;
	    innerProperties = properties.slice(0);
	    propertyArray = [];
	    valueArray = [];
	    /* split property descriptors to prepare for duplication removal step*/
	    for (idx = 0, pl = innerProperties.length; idx < pl; idx += 1) {
	        descriptor = innerProperties[idx].split(":");
	        if (descriptor.length >= 2) {
	            descriptor[0] = descriptor[0].replace(/^\s*|\s*$/gi, "");
	            descriptor[1] = descriptor[1].replace(/^\s*|\s*$/gi, "");
	            propertyArray.push(descriptor[0]);
	            valueArray.push(descriptor[1]);
	        }
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
	sortSelectors = function (selectors) {
	    var splittedSelectors, idx;
	    splittedSelectors = selectors.split(",");
	    splittedSelectors.sort();
	    return splittedSelectors.join(",");
	};
	purgeDuplicatedSelectors = function (selectors) {
	    var splittedSelectors, idx;
	    splittedSelectors = selectors.split(",");
	    for (idx = splittedSelectors.length - 1; idx > 0; idx -= 1) {
	        if (splittedSelectors[idx] === splittedSelectors[idx - 1]) {
	            splittedSelectors.splice(idx, 1);
	        }
	    }
	    return splittedSelectors.join(",");
	};
	return Public;
};
