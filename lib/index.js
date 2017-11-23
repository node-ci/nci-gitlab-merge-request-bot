'use strict';

var action = require('./action');

exports.register = function(app) {
	var logger = app.lib.logger('merge request bot');

	app.builds.on('buildCompleted', function(build) {
		var self = this;

		try {
			action.postMergeRequestComment({
				logger: logger,
				build: build,
				config: app.config
			});
		} catch(err) {
			self.emit('error', err);
		}
	});

};
