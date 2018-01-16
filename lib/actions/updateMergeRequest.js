'use strict';

var _ = require('underscore'),
	Steppy = require('twostep').Steppy,
	helpers = require('../helpers'),
	gitlab = require('../gitlab');

/**
 * Returns section content marked with section start and end comments
 * @param {string} params.content
 * @param {string} params.name
 * @returns {string} section
 */
var stringifySection = function(params) {
	return [
		'<!--' + params.name + '-start-->',
		params.content,
		'<!--' + params.name + '-end-->'
	].join('\n');
};

/**
 * Returns RegExp to match section with given name
 * @param {string} name - section name
 * @returns {RegExp}
 */
var makeSectionRegExpPattern = function(name) {
	return '<!--' + name + '-start-->([\\s\\S]*?)<!--' + name + '-end-->';
};

/**
 * Returns `true` if section with given name exists in text
 * @param {string} params.text
 * @param {string} params.name
 * @returns {string} section content
 */
var hasSection = function(params) {
	var sectionRegExp = new RegExp(makeSectionRegExpPattern(params.name));

	return sectionRegExp.test(params.text);
};

/**
 * Replaces section in text
 * @param {string} params.text
 * @param {string} params.name
 * @param {string} params.newContent
 * @returns {string} text with replaced section
 */
var replaceSection = function(params) {
	var sectionRegExp = new RegExp(makeSectionRegExpPattern(params.name));
	var newSection = stringifySection({
		name: params.name,
		content: params.newContent
	});

	return params.text.replace(sectionRegExp, newSection);
};

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

	var shieldSection = stringifySection({
		name: 'nci-build-shield-section',
		content: helpers.renderTemplate({
			template: params.settings.gitlab.mergeRequest.shieldContent,
			settings: params.settings,
			locals: {build: params.build}
		})
	});

	return [buildInfoComment, shieldSection].join('\n\n');
};

/**
 * Returns description with updated info about project build
 * @param {object} params.description
 * @param {object} params.settings
 * @param {object} params.build
 * @returns {string}
 */
var updateDescription = function(params) {
	var description = params.description;
	var settings = params.settings;
	var build = params.build;

	var projectSectionName = build.project.name + '-section';

	var newProjectSectionContent = makeProjectSectionContent({
		build: build,
		settings: settings
	});
	var currentProjectSectionExists = hasSection({
		text: description,
		name: projectSectionName
	});

	var updatedDescription;
	if (currentProjectSectionExists) {
		updatedDescription = replaceSection({
			text: description,
			name: projectSectionName,
			newContent: newProjectSectionContent
		});
	} else {
		updatedDescription = description + '\n\n' + stringifySection({
			name: projectSectionName,
			content: newProjectSectionContent
		});
	}

	return updatedDescription;
};

var updateMergeRequest = function(params) {
	var logger = params.logger;
	var build = params.build;
	var config = params.config;


	if (!helpers.isSuitableBuild(build)) {
		return;
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
					privateToken: settings.gitlab.privateToken
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
						privateToken: settings.gitlab.privateToken
					},
					this.slot()
				);

			} else {
				this.pass(null);
			}
		},
		function(err) {
			if (err) {
				logger.error(
					'Error during updating merge request request:',
					err.stack || err
				);
			}
		}
	);
};

module.exports = updateMergeRequest;
