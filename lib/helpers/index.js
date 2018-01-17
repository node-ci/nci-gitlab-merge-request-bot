'use strict';

var getSettings = require('./getSettings'),
	isSuitableBuild = require('./isSuitableBuild'),
	renderTemplate = require('./renderTemplate'),
	stringifySection = require('./stringifySection'),
	hasSection = require('./hasSection'),
	replaceSection = require('./replaceSection'),
	stringifyBuildInfoComment = require('./stringifyBuildInfoComment');

exports.getSettings = getSettings;
exports.isSuitableBuild = isSuitableBuild;
exports.renderTemplate = renderTemplate;
exports.stringifySection = stringifySection;
exports.hasSection = hasSection;
exports.replaceSection = replaceSection;
exports.stringifyBuildInfoComment = stringifyBuildInfoComment;
