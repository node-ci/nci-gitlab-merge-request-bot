'use strict';

var makeSectionRegExpPattern = require('./makeSectionRegExpPattern');
var stringifySection = require('./stringifySection');

/**
 * Replaces section in text
 * @param {string} params.text
 * @param {string} params.name
 * @param {string} params.newContent
 * @returns {string} text with replaced section
 */

var replaceSection = function(params) {
	var sectionRegExp = new RegExp(makeSectionRegExpPattern(params.name));
	var newSection = stringifySection({
		name: params.name,
		content: params.newContent
	});

	return params.text.replace(sectionRegExp, newSection);
};

module.exports = replaceSection;
