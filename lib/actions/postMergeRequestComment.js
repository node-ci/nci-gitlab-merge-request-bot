'use strict';

var Steppy = require('twostep').Steppy,
	_ = require('underscore'),
	helpers = require('../helpers'),
	gitlab = require('../gitlab');

var postMergeRequestComment = function(params, callback) {
	var build = params.build;
	var config = params.config;


	if (!helpers.isSuitableBuild(build)) {
		return callback();
	}

	Steppy(
		function() {
			var settings = helpers.getSettings({
				project: build.project,
				config: config
			});

			var mergeRequest = build.initiator.mergeRequest;

			var buildInfo = _(build).pick('id', 'number', 'status');
			buildInfo.project = _(build.project).pick('name');

			var body = [
				helpers.renderTemplate({
					template: settings.gitlab.mergeRequest.commentTemplate,
					settings: settings,
					locals: {build: build}
				}),
				helpers.stringifyBuildInfoComment(buildInfo)
			].join('\n\n');

			var gitlabUrl = gitlab.makeMergeRequestNotesUrl({
				baseUrl: settings.gitlab.url,
				projectId: mergeRequest.targetProjectId,
				id: mergeRequest.iid
			});

			var gitlabRequestParams = {
				method: 'POST',
				json: true,
				body: {
					body: body
				},
				privateToken: settings.gitlab.privateToken,
				timeout: settings.gitlab.requestTimeout
			};

			gitlab.request(gitlabUrl, gitlabRequestParams, this.slot());
		},
		callback
	);
};

module.exports = postMergeRequestComment;
