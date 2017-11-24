'use strict';

var _ = require('underscore'),
	urlJoin = require('url-join');

var makeGetBuildUrl = function(settings) {
	return function(build) {
		var nciUrl = settings.nci.url;

		if (!nciUrl) {
			return '';
		}

		return urlJoin(nciUrl, 'builds', build.id);
	};
};

var makeGetProjectUrl = function(settings) {
	return function(build) {
		var nciUrl = settings.nci.url;

		if (!nciUrl) {
			return '';
		}

		return urlJoin(nciUrl, 'projects', build.project.name);
	};
};

var makeGetProjectRevShieldUrl = function(settings) {
	return function(build) {
		var nciUrl = settings.nci.url;

		if (!nciUrl) {
			return '';
		}

		return urlJoin(
			nciUrl,
			'shields',
			build.project.name,
			'revs',
			encodeURIComponent(build.project.scm.rev) + '.svg'
		);
	};
};

var renderTemplate = function(params) {
	var template = params.template;
	var settings = params.settings;
	var locals = params.locals;

	return template(
		_({
			getBuildUrl: makeGetBuildUrl(settings),
			getProjectUrl: makeGetProjectUrl(settings),
			getProjectRevShieldUrl: makeGetProjectRevShieldUrl(settings)
		}).defaults(locals)
	);
};

module.exports = renderTemplate;
