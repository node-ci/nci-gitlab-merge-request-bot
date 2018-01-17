'use strict';

var Steppy = require('twostep').Steppy,
	_ = require('underscore'),
	queue = require('queue'),
	request = require('./request');


var requestQueue = queue({
	autostart: true,
	concurrency: 1
});

/**
 * Wraps request with queue to provide sequential execution
 */
var queuedRequest = function() {
	var args = _(arguments).initial();
	var callback = _(arguments).last();

	requestQueue.push(function(queueCallback) {
		Steppy(
			function() {
				request.apply(null, args.concat([this.slot()]));
			},
			function(err, result) {
				callback(err, result);
				queueCallback();
			}
		);
	});
};

module.exports = queuedRequest;
