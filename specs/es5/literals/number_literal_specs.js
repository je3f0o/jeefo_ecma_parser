/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : number_literal_specs.js
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

describe("NumberLiteral", () => {
	var expr    = parser.parse("123")[0],
		literal = expr.expression;

	it('Type should be "NumberLiteral"', function () {
		expect(literal.type).toBe("NumberLiteral");
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
		expect(literal.end.index).toBe(3);
		expect(literal.end.column).toBe(4);
		expect(literal.end.virtual_column).toBe(4);
	});

	describe("Values", () => {
		it('Should be 123', function () {
			expect(literal.value).toBe("123");
		});

		it('Should be 123.123', function () {
			var literal = parser.parse("123.123")[0].expression;
			expect(literal.value).toBe("123.123");
		});
	});
});
