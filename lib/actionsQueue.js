'use strict';

var Steppy = require('twostep').Steppy,
	_ = require('underscore'),
	queue = require('queue'),
	actions = require('./actions');


var requestQueue = queue({
	autostart: true,
	concurrency: 1
});


/**
 * Adds action to queue
 * @param {object} params - params to run action
 */

exports.push = function(params) {
	requestQueue.push(function(queueCallback) {
		Steppy(
			function() {
				actions.run(params, this.slot());
			},
			function() {
				queueCallback();
			}
		);
	});
};
