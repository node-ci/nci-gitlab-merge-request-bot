'use strict';

var actions = require('./actions');

exports.register = function(app) {
	var logger = app.lib.logger('merge request bot');

	app.builds.on('buildCompleted', function(build) {
		var self = this;

		try {
			actions.postMergeRequestComment({
				logger: logger,
				build: build,
				config: app.config
			});
		} catch(err) {
			self.emit('error', err);
		}
	});

};
