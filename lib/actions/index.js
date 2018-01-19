'use strict';

var postMergeRequestComment = require('./postMergeRequestComment'),
	updateMergeRequest = require('./updateMergeRequest');

/**
 * Run action with given name and params
 * @param {string} params.name
 * @param {object} params.actionParams
 */

exports.run = function(params, callback) {
	switch (params.name) {
		case 'postMergeRequestComment':
			postMergeRequestComment(params.actionParams, callback);
			break;

		case 'updateMergeRequest':
			updateMergeRequest(params.actionParams, callback);
			break;

		default:
			throw new Error('Action "' + params.name + '" doesn\'t exist');
	}
};
