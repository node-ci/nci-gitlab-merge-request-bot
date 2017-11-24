'use strict';

var isSuitableBuild = function(build) {
	return (
		build.initiator &&
		build.initiator.type === 'gitlab-webhook' &&
		build.initiator.mergeRequest
	);
};

module.exports = isSuitableBuild;
