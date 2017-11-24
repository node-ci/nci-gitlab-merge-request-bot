'use strict';

var _ = require('underscore'),
	urlUtils = require('url');

var defaultCommentTemplateText = (
	'**<%= build.project.name %>** ' +
	'build <a href="<%= getBuildUrl(build) %>">#<%= build.number %></a> ' +
	'is **<%= build.status %>** ' +
	'<% if (build.status === "done") { %>' +
	'	:white_check_mark:' +
	'<% } else if (build.status === "error") { %>' +
	'	:red_circle:' +
	'<% } %>'
);

var defaultDescriptionTemplateText = (
	'\n\n' +
	'**<%= build.project.name %>** ' +
	'[![](<%= getProjectRevShieldUrl(build) %>)](<%= getProjectUrl(build) %>)'
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
			mergeRequest: {
				commentTemplate: _(
					gitlab.mergeRequest &&
					gitlab.mergeRequest.commentTemplate ||
					defaultCommentTemplateText
				).template(),
				descriptionTemplate: _(
					gitlab.mergeRequest &&
					gitlab.mergeRequest.descriptionTemplate ||
					defaultDescriptionTemplateText
				).template()
			}
		},
		nci: {
			url: config.http && config.http.url
		}
	};
};

module.exports = getSettings;
