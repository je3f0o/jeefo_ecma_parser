/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : conditional_expression_specs.js
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

describe("ConditionalExpression", () => {
	var stmt = parser.parse("a ? b : c")[0],
		expr = stmt.expression;

	it('Statement type should be "ExpressionStatement"', function () {
		expect(stmt.type).toBe("ExpressionStatement");
	});

	it('Type should be "ConditionalExpression"', function () {
		expect(expr.type).toBe("ConditionalExpression");
	});

	it('Test type should be "Identifier"', function () {
		expect(expr.test.type).toBe("Identifier");
		expect(expr.test.name).toBe("a");
	});

	it('Consequent type should be "Identifier"', function () {
		expect(expr.consequent.type).toBe("Identifier");
		expect(expr.consequent.name).toBe("b");
	});

	it('Alternate type should be "Identifier"', function () {
		expect(expr.alternate.type).toBe("Identifier");
		expect(expr.alternate.name).toBe("c");
	});

	it('Precedence should be (4)', function () {
		expect(expr.precedence).toBe(4);
	});

	it("Should be has start object", function () {
		expect(stmt.start.line).toBe(1);
		expect(stmt.start.index).toBe(0);
		expect(stmt.start.column).toBe(1);
		expect(stmt.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(stmt.end.line).toBe(1);
		expect(stmt.end.index).toBe(9);
		expect(stmt.end.column).toBe(10);
		expect(stmt.end.virtual_column).toBe(10);
	});
});
