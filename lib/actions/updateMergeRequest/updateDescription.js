'use strict';

var helpers = require('../../helpers'),
	makeProjectSectionContent = require('./makeProjectSectionContent');


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
	var currentProjectSectionExists = helpers.hasSection({
		text: description,
		name: projectSectionName
	});

	var updatedDescription;
	if (currentProjectSectionExists) {
		updatedDescription = helpers.replaceSection({
			text: description,
			name: projectSectionName,
			newContent: newProjectSectionContent
		});
	} else {
		updatedDescription = description + '\n\n' + helpers.stringifySection({
			name: projectSectionName,
			content: newProjectSectionContent
		});
	}

	return updatedDescription;
};

module.exports = updateDescription;
