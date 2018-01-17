'use strict';

/**
 * Returns section content marked with section start and end comments
 * @param {string} params.content
 * @param {string} params.name
 * @returns {string}
 */

var stringifySection = function(params) {
	return [
		'<!--' + params.name + '-start-->',
		params.content,
		'<!--' + params.name + '-end-->'
	].join('\n');
};

module.exports = stringifySection;
