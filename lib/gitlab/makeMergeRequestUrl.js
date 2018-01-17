'use strict';

var urlJoin = require('url-join');

var apiVersion = 'v4';

var makeMergeRequestUrl = function(params) {
	return urlJoin(
		params.baseUrl,
		'api',
		apiVersion,
		'projects',
		params.projectId,
		'merge_requests',
		params.id
	);
};

module.exports = makeMergeRequestUrl;
