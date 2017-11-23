'use strict';

var expect = require('expect.js'),
	libModule = require('../lib');

describe('lib', function() {

	describe('module', function() {
		it('should export register function', function() {
			expect(libModule.register).a('function');
		});

		it('should export funct which accepts single arg', function() {
			expect(libModule.register).length(1);
		});
	});

});