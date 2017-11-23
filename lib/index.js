'use strict';

var _ = require('underscore'),
	got = require('got'),
	urlJoin = require('url-join'),
	urlUtils = require('url');

var gitlabRequest = function(url, params, callback) {
	var requestParams = _(params).clone();

	if (requestParams.privateToken) {
		requestParams.headers = requestParams.headers || {};
		requestParams.headers['PRIVATE-TOKEN'] = requestParams.privateToken;
		delete requestParams.privateToken;
	}

	got(
		url,
		requestParams,
		callback
	);
};

var gitLabApiVersion = 'v4';

var makeMergeRequestUrl = function(params) {
	return urlJoin(
		params.baseUrl,
		'api',
		gitLabApiVersion,
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

var defaultCommentTemplate = _.template(
	'**<%= build.project.name %>** ' +
	'build #<%= build.number %> is **<%= build.status %>** ' +
	'<% if (build.status === "done") { %>' +
	'	:white_check_mark:' +
	'<% } else if (build.status === "error") { %>' +
	'	:red_circle:' +
	'<% } %>'
);

var makeGitlabParams = function(params) {
	var project = params.project;
	var config = params.config;

	var gitlab = project.gitlab || config.gitlab || {};

	if (!gitlab.host) {
		throw new Error('Gitlab host is not set.');
	}

	if (!gitlab.privateToken) {
		throw new Error('Gitlab private token is not set.');
	}

	var parsedBaseUrl = _(gitlab).pick('protocol', 'host', 'port');

	return {
		baseUrl: urlUtils.format(parsedBaseUrl),
		privateToken: gitlab.privateToken,
		commentTemplate: gitlab.commentTemplate || defaultCommentTemplate
	};
};

var postMergeRequestComment = function(params) {
	var logger = params.logger;
	var build = params.build;
	var config = params.config;

	var isSuitableBuild = (
		build.initiator &&
		build.initiator.type === 'gitlab-webhook' &&
		build.initiator.mergeRequest
	);

	if (!isSuitableBuild) {
		return;
	}

	var gitlabParams = makeGitlabParams({
		project: build.project,
		config: config
	});

	var mergeRequest = build.initiator.mergeRequest;

	var gitlabUrl = makeMergeRequestNotesUrl({
		baseUrl: gitlabParams.baseUrl,
		projectId: mergeRequest.targetProjectId,
		id: mergeRequest.iid
	});

	var gitlabRequestParams = {
		method: 'POST',
		json: true,
		body: {
			body: gitlabParams.commentTemplate({build: build})
		},
		privateToken: gitlabParams.privateToken
	};

	gitlabRequest(gitlabUrl, gitlabRequestParams, function(err) {
		if (err) {
			logger.error('Error during gitlab request:', err.stack || err);
		}
	});
};

exports.register = function(app) {
	var logger = app.lib.logger('merge request bot');

	app.builds.on('buildCompleted', function(build) {
		var self = this;

		try {
			postMergeRequestComment({
				logger: logger,
				build: build,
				config: app.config
			});
		} catch(err) {
			self.emit('error', err);
		}
	});

};
