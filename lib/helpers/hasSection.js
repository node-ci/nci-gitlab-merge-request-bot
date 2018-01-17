'use strict';

var makeSectionRegExpPattern = require('./makeSectionRegExpPattern');

/**
 * Returns `true` if section with given name exists in text
 * @param {string} params.text
 * @param {string} params.name
 * @returns {boolean}
 */

var hasSection = function(params) {
	var sectionRegExp = new RegExp(makeSectionRegExpPattern(params.name));

	return sectionRegExp.test(params.text);
};

module.exports = hasSection;
