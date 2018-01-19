'use strict';

var Steppy = require('twostep').Steppy;
var actionsQueue = require('./actionsQueue');

exports.register = function(app) {
	var logger = app.lib.logger('merge request bot');

	app.builds.on('buildQueued', function(build) {
		try {
			actionsQueue.push({
				name: 'updateMergeRequest',
				actionParams: {
					logger: logger,
					build: build,
					config: app.config
				}
			});
		} catch(err) {
			this.emit('error', err);
		}
	});

	app.builds.on('buildCompleted', function(build) {
		try {
			actionsQueue.push({
				name: 'postMergeRequestComment',
				actionParams: {
					logger: logger,
					build: build,
					config: app.config
				}
			});
		} catch(err) {
			this.emit('error', err);
		}
	});

};
