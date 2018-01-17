'use strict';

var makeMergeRequestUrl = require('./makeMergeRequestUrl'),
	urlJoin = require('url-join');

var makeMergeRequestNotesUrl = function(params) {
	return urlJoin(
		makeMergeRequestUrl(params),
		'notes'
	);
};

module.exports = makeMergeRequestNotesUrl;
