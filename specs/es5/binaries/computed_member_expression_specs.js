/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : computed_member_expression_specs.js
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

describe("Computed MemberExpression", () => {
	var stmt = parser.parse("object[member]")[0],
		expr = stmt.expression;

	it('Statement type should be "ExpressionStatement"', function () {
		expect(stmt.type).toBe("ExpressionStatement");
	});

	it('Type should be "MemberExpression"', function () {
		expect(expr.type).toBe("MemberExpression");
	});

	it('Precedence should be (19)', function () {
		expect(expr.precedence).toBe(19);
	});

	it('Is computed should be true', function () {
		expect(expr.is_computed).toBe(true);
	});

	it('Object type should be "Identifier"', function () {
		expect(expr.object.type).toBe("Identifier");
	});

	it('Property type should be "Identifier"', function () {
		expect(expr.property.type).toBe("Identifier");
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
