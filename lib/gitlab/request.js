'use strict';

var _ = require('underscore'),
	got = require('got');


var request = function(url, params, callback) {
	var requestParams = _(params).chain()
		.clone()
		.defaults({
			timeout: 60 * 1000,
			headers: {}
		})
		.value();

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

module.exports = request;
