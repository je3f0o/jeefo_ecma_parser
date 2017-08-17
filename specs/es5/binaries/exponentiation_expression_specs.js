/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : exponentiation_expression_specs.js
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

describe("ExponentiationExpression", () => {
	var stmt = parser.parse("5 ** 2")[0],
		expr = stmt.expression;

	it('Statement type should be "ExpressionStatement"', function () {
		expect(stmt.type).toBe("ExpressionStatement");
	});

	it('Type should be "ExponentiationExpression"', function () {
		expect(expr.type).toBe("ExponentiationExpression");
	});

	it('Precedence should be (15)', function () {
		expect(expr.precedence).toBe(15);
	});

	it('Left type should be "NumberLiteral"', function () {
		expect(expr.left.type).toBe("NumberLiteral");
	});

	it('Right type should be "NumberLiteral"', function () {
		expect(expr.right.type).toBe("NumberLiteral");
	});

	it("Should be has start object", function () {
		expect(expr.start.line).toBe(1);
		expect(expr.start.index).toBe(0);
		expect(expr.start.column).toBe(1);
		expect(expr.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(expr.end.line).toBe(1);
		expect(expr.end.index).toBe(6);
		expect(expr.end.column).toBe(7);
		expect(expr.end.virtual_column).toBe(7);
	});
});
