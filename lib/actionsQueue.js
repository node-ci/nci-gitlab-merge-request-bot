'use strict';

var Steppy = require('twostep').Steppy,
	queue = require('queue'),
	actions = require('./actions');


var actionsQueue = queue({
	autostart: true,
	concurrency: 1
});


/**
 * Adds action to queue
 * @param {object} params - params to run action
 * @param {object} params.logger
 */

exports.push = function(params) {
	actionsQueue.push(function(queueCallback) {
		Steppy(
			function() {
				actions.run(params, this.slot());
			},
			function(err) {
				if (err) {
					params.logger.error(
						'Error occured during execution action "' + params.name + '": ',
						err.stack || err
					);
				}

				queueCallback();
			}
		);
	});
};
