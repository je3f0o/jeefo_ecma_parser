/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : instanceof_expression_specs.js
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

describe("InstanceofExpression", () => {
	var stmt = parser.parse("a instanceof b")[0],
		expr = stmt.expression;

	it('Statement type should be "ExpressionStatement"', function () {
		expect(stmt.type).toBe("ExpressionStatement");
	});

	it('Type should be "InstanceofExpression"', function () {
		expect(expr.type).toBe("InstanceofExpression");
	});

	it('Precedence should be (11)', function () {
		expect(expr.precedence).toBe(11);
	});

	it('Left type should be "Identifier"', function () {
		expect(expr.left.type).toBe("Identifier");
	});

	it('Right type should be "Identifier"', function () {
		expect(expr.right.type).toBe("Identifier");
	});

	it("Should be has start object", function () {
		expect(expr.start.line).toBe(1);
		expect(expr.start.index).toBe(0);
		expect(expr.start.column).toBe(1);
		expect(expr.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(expr.end.line).toBe(1);
		expect(expr.end.index).toBe(14);
		expect(expr.end.column).toBe(15);
		expect(expr.end.virtual_column).toBe(15);
	});
});
