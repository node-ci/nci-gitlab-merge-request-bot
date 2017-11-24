'use strict';

var _ = require('underscore'),
	got = require('got'),
	urlJoin = require('url-join');

var request = function(url, params, callback) {
	var requestParams = _(params).clone();

	requestParams.headers = requestParams.headers || {};

	if (requestParams.privateToken) {
		requestParams.headers['PRIVATE-TOKEN'] = requestParams.privateToken;
		delete requestParams.privateToken;
	}

	got(
		url,
		requestParams,
		callback
	);
};

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

var makeMergeRequestNotesUrl = function(params) {
	return urlJoin(
		makeMergeRequestUrl(params),
		'notes'
	);
};

exports.request = request;
exports.makeMergeRequestUrl = makeMergeRequestUrl;
exports.makeMergeRequestNotesUrl = makeMergeRequestNotesUrl;
