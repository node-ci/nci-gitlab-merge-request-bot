'use strict';

var actions = require('./actions');

exports.register = function(app) {
	var logger = app.lib.logger('merge request bot');

	app.builds.on('buildStarted', function(build) {
		try {
			actions.updateMergeRequest({
				logger: logger,
				build: build,
				config: app.config
			});
		} catch(err) {
			this.emit('error', err);
		}
	});

	app.builds.on('buildCompleted', function(build) {
		try {
			actions.postMergeRequestComment({
				logger: logger,
				build: build,
				config: app.config
			});
		} catch(err) {
			this.emit('error', err);
		}
	});

};
