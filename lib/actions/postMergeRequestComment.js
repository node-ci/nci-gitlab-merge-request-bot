'use strict';

var helpers = require('../helpers'),
	gitlab = require('../gitlab');

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

	var settings = helpers.getSettings({
		project: build.project,
		config: config
	});

	var mergeRequest = build.initiator.mergeRequest;

	var gitlabUrl = gitlab.makeMergeRequestNotesUrl({
		baseUrl: settings.gitlab.url,
		projectId: mergeRequest.targetProjectId,
		id: mergeRequest.iid
	});

	var gitlabRequestParams = {
		method: 'POST',
		json: true,
		body: {
			body: helpers.renderTemplate({
				template: settings.gitlab.commentTemplate,
				settings: settings,
				locals: {build: build}
			})
		},
		privateToken: settings.gitlab.privateToken
	};

	gitlab.request(gitlabUrl, gitlabRequestParams, function(err) {
		if (err) {
			logger.error('Error during gitlab request:', err.stack || err);
		}
	});
};

module.exports = postMergeRequestComment;
