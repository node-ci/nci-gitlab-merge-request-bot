'use strict';

var _ = require('underscore'),
	helpers = require('../../helpers');

/**
 * Returns content for new project build section
 * @param {object} params.build
 * @param {object} params.settings
 * @returns {string}
 */

var makeProjectSectionContent = function(params) {
	var build = params.build;

	var buildInfoComment = helpers.makeBuildInfoComment({
		id: build.id,
		project: _(build.project).pick('name')
	});

	var shieldSection = helpers.stringifySection({
		name: 'nci-build-shield-section',
		content: helpers.renderTemplate({
			template: params.settings.gitlab.mergeRequest.shieldContent,
			settings: params.settings,
			locals: {build: params.build}
		})
	});

	return [buildInfoComment, shieldSection].join('\n\n');
};

module.exports = makeProjectSectionContent;
