/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : unary_expression_specs.js
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

describe("Suffix UnaryExpression", () => {
	var stmt = parser.parse("i++")[0],
		expr = stmt.expression;

	it('Statement type should be "ExpressionStatement"', function () {
		expect(stmt.type).toBe("ExpressionStatement");
	});

	it('Type should be "UnaryExpression"', function () {
		expect(expr.type).toBe("UnaryExpression");
	});

	it('Precedence should be (17)', function () {
		expect(expr.precedence).toBe(17);
	});

	it('Is prefix should be false', function () {
		expect(expr.is_prefix).toBe(false);
	});

	it('Argument type should be "Identifier"', function () {
		expect(expr.argument.type).toBe("Identifier");
		expect(expr.argument.name).toBe("i");
	});

	it("Should be has start object", function () {
		expect(expr.start.line).toBe(1);
		expect(expr.start.index).toBe(0);
		expect(expr.start.column).toBe(1);
		expect(expr.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(expr.end.line).toBe(1);
		expect(expr.end.index).toBe(3);
		expect(expr.end.column).toBe(4);
		expect(expr.end.virtual_column).toBe(4);
	});

	describe("Operators", () => {
		it('Should be "++"', function () {
			expect(expr.operator).toBe("++");
		});

		it('Should be "--"', function () {
			var expr = parser.parse("i--")[0].expression;
			expect(expr.operator).toBe("--");
		});
	});
});
