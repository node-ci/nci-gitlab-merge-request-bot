'use strict';

var _ = require('underscore');

/**
 * Returns comment with build info in JSON format
 * @param {object} buildInfo
 * @returns {string}
 */

var makeBuildInfoComment = function(buildInfo) {
	var comment = [
		'<!--ci-build-info>',
		JSON.stringify({ciBuildInfo: buildInfo}),
		'</ci-build-info-->'
	].join('');

	return comment;
};

module.exports = makeBuildInfoComment;
