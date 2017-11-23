'use strict';

var settings = require('../settings'),
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

	var options = settings.get({
		project: build.project,
		config: config
	});

	var mergeRequest = build.initiator.mergeRequest;

	var gitlabUrl = gitlab.makeMergeRequestNotesUrl({
		baseUrl: options.gitlab.url,
		projectId: mergeRequest.targetProjectId,
		id: mergeRequest.iid
	});

	var gitlabRequestParams = {
		method: 'POST',
		json: true,
		body: {
			body: options.gitlab.commentTemplate({build: build})
		},
		privateToken: options.gitlab.privateToken
	};

	gitlab.request(gitlabUrl, gitlabRequestParams, function(err) {
		if (err) {
			logger.error('Error during gitlab request:', err.stack || err);
		}
	});
};

module.exports = postMergeRequestComment;
