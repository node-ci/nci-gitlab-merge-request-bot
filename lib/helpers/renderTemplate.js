'use strict';

var _ = require('underscore'),
	urlJoin = require('url-join');

var makeGetBuildUrl = function(settings) {
	return function(build) {
		var nciUrl = settings.nci.url;
		return nciUrl ? urlJoin(nciUrl, 'builds', build.id) : '';
	};
};

var renderTemplate = function(params) {
	var template = params.template;
	var settings = params.settings;
	var locals = params.locals;

	return template(
		_({
			getBuildUrl: makeGetBuildUrl(settings)
		}).defaults(locals)
	);
};

module.exports = renderTemplate;
