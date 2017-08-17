/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : comment_specs.js
* Created at  : 2017-08-18
* Updated at  : 2017-08-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var expect = require("expect"),
	parser = require("../../../src/es5_parser");

describe("Comment", () => {
	var comment = parser.parse("//comment")[0];

	it('Type should be "Comment"', function () {
		expect(comment.type).toBe("Comment");
	});

	it('Precedence should be (40)', function () {
		expect(comment.precedence).toBe(40);
	});

	it('Comment should be "comment"', function () {
		expect(comment.comment).toBe("comment");
	});

	it("Should be has start object", function () {
		expect(comment.start.line).toBe(1);
		expect(comment.start.index).toBe(0);
		expect(comment.start.column).toBe(1);
		expect(comment.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(comment.end.line).toBe(1);
		expect(comment.end.index).toBe(9);
		expect(comment.end.column).toBe(10);
		expect(comment.end.virtual_column).toBe(10);
	});

	describe("Multiline comment", () => {
		var comment = parser.parse("/* \n\n\n   hello world   \n\n\n */")[0];
		it('Comment should be "hello world"', function () {
			expect(comment.comment).toBe("hello world");
		});
	});
});
