'use strict';

var getSettings = require('./getSettings'),
	isSuitableBuild = require('./isSuitableBuild'),
	renderTemplate = require('./renderTemplate'),
	stringifySection = require('./stringifySection'),
	hasSection = require('./hasSection'),
	replaceSection = require('./replaceSection'),
	makeBuildInfoComment = require('./makeBuildInfoComment');

exports.getSettings = getSettings;
exports.isSuitableBuild = isSuitableBuild;
exports.renderTemplate = renderTemplate;
exports.stringifySection = stringifySection;
exports.hasSection = hasSection;
exports.replaceSection = replaceSection;
exports.makeBuildInfoComment = makeBuildInfoComment;
