'use strict';

var Steppy = require('twostep').Steppy,
	helpers = require('../../helpers'),
	gitlab = require('../../gitlab'),
	updateDescription = require('./updateDescription');

var updateMergeRequest = function(params, callback) {
	var build = params.build;
	var config = params.config;


	if (!helpers.isSuitableBuild(build)) {
		return callback();
	}

	var settings;
	var mergeRequestUrl;

	Steppy(
		function() {
			settings = helpers.getSettings({
				project: build.project,
				config: config
			});

			var mergeRequest = build.initiator.mergeRequest;

			mergeRequestUrl = gitlab.makeMergeRequestUrl({
				baseUrl: settings.gitlab.url,
				projectId: mergeRequest.targetProjectId,
				id: mergeRequest.iid
			});

			gitlab.request(
				mergeRequestUrl,
				{
					method: 'GET',
					json: true,
					privateToken: settings.gitlab.privateToken,
					timeout: settings.gitlab.requestTimeout
				},
				this.slot()
			);
		},
		function(err, mergeRequest) {
			var description = mergeRequest.description || '';
			var updatedDescription = updateDescription({
				description: description,
				build: build,
				settings: settings
			});

			if (description !== updatedDescription) {
				gitlab.request(
					mergeRequestUrl,
					{
						method: 'PUT',
						json: true,
						body: {
							description: updatedDescription
						},
						privateToken: settings.gitlab.privateToken,
						timeout: settings.gitlab.requestTimeout
					},
					this.slot()
				);

			} else {
				this.pass(null);
			}
		},
		callback
	);
};

module.exports = updateMergeRequest;
