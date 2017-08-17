/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : boolean_literal_specs.js
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

describe("BooleanLiteral", () => {
	var expr    = parser.parse("true")[0],
		literal = expr.expression;

	it('Type should be "BooleanLiteral"', function () {
		expect(literal.type).toBe("BooleanLiteral");
	});

	it('Precedence should be (31)', function () {
		expect(literal.precedence).toBe(31);
	});

	it('Statement type should be "ExpressionStatement"', function () {
		expect(expr.type).toBe("ExpressionStatement");
	});

	it("Should be has start object", function () {
		expect(literal.start.line).toBe(1);
		expect(literal.start.index).toBe(0);
		expect(literal.start.column).toBe(1);
		expect(literal.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(literal.end.line).toBe(1);
		expect(literal.end.index).toBe(4);
		expect(literal.end.column).toBe(5);
		expect(literal.end.virtual_column).toBe(5);
	});

	describe("Values", () => {
		it('Should be "true"', function () {
			expect(literal.value).toBe("true");
		});

		it('Should be "false"', function () {
			var literal = parser.parse("false")[0].expression;
			expect(literal.value).toBe("false");
		});
	});
});
