'use strict';

var _ = require('underscore'),
	urlUtils = require('url'),
	urlJoin = require('url-join');

var defaultCommentTemplate = _.template(
	'**<%= build.project.name %>** ' +
	'build <a href="<%= getBuildUrl(build) %>">#<%= build.number %></a> ' +
	'is **<%= build.status %>** ' +
	'<% if (build.status === "done") { %>' +
	'	:white_check_mark:' +
	'<% } else if (build.status === "error") { %>' +
	'	:red_circle:' +
	'<% } %>'
);

var getSettings = function(params) {
	var project = params.project;
	var config = params.config;

	var gitlab = project.gitlab || config.gitlab || {};

	if (!gitlab.host) {
		throw new Error('Gitlab host is not set.');
	}

	if (!gitlab.privateToken) {
		throw new Error('Gitlab private token is not set.');
	}

	var parsedGitLabUrl = _(gitlab).pick('protocol', 'host', 'port');

	return {
		gitlab: {
			url: urlUtils.format(parsedGitLabUrl),
			privateToken: gitlab.privateToken,
			commentTemplate: gitlab.commentTemplate || defaultCommentTemplate
		},
		nci: {
			url: config.http && config.http.url
		}
	};
};

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

exports.getSettings = getSettings;
exports.renderTemplate = renderTemplate;
