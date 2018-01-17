'use strict';

var queuedRequest = require('./queuedRequest');
var makeMergeRequestUrl = require('./makeMergeRequestUrl');
var makeMergeRequestNotesUrl = require('./makeMergeRequestNotesUrl');


exports.request = queuedRequest;
exports.makeMergeRequestUrl = makeMergeRequestUrl;
exports.makeMergeRequestNotesUrl = makeMergeRequestNotesUrl;
