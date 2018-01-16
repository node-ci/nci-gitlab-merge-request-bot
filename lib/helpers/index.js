'use strict';

var getSettings = require('./getSettings'),
	isSuitableBuild = require('./isSuitableBuild'),
	renderTemplate = require('./renderTemplate'),
	makeBuildInfoComment = require('./makeBuildInfoComment');

exports.getSettings = getSettings;
exports.isSuitableBuild = isSuitableBuild;
exports.renderTemplate = renderTemplate;
exports.makeBuildInfoComment = makeBuildInfoComment;
