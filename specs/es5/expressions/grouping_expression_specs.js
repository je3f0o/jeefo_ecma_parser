/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : grouping_expression_specs.js
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

describe("GroupingExpression", () => {
	var stmt = parser.parse("(function(){}());")[0],
		expr = stmt.expression;

	it('Statement type should be "ExpressionStatement"', function () {
		expect(stmt.type).toBe("ExpressionStatement");
	});

	it('Type should be "GroupingExpression"', function () {
		expect(expr.type).toBe("GroupingExpression");
	});

	it('Precedence should be (20)', function () {
		expect(expr.precedence).toBe(20);
	});

	it('Expression.type should be "CallExpression"', function () {
		expect(expr.expression.type).toBe("CallExpression");
	});

	it("Should be has start object", function () {
		expect(expr.start.line).toBe(1);
		expect(expr.start.index).toBe(0);
		expect(expr.start.column).toBe(1);
		expect(expr.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(expr.end.line).toBe(1);
		expect(expr.end.index).toBe(16);
		expect(expr.end.column).toBe(17);
		expect(expr.end.virtual_column).toBe(17);
	});
});
