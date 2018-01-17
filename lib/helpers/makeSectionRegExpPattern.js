'use strict';

/**
 * Returns RegExp to match section with given name
 * @param {string} name - section name
 * @returns {RegExp}
 */

var makeSectionRegExpPattern = function(name) {
	return '<!--' + name + '-start-->([\\s\\S]*?)<!--' + name + '-end-->';
};

module.exports = makeSectionRegExpPattern;
