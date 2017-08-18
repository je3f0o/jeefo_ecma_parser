/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : sequence_expression_specs.js
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

describe("SequenceExpression", () => {
	var stmt = parser.parse("5,null,a,{}")[0],
		expr = stmt.expression;

	it('Statement type should be "ExpressionStatement"', function () {
		expect(stmt.type).toBe("ExpressionStatement");
	});

	it('Type should be "SequenceExpression"', function () {
		expect(expr.type).toBe("SequenceExpression");
	});

	it('Precedence should be (1)', function () {
		expect(expr.precedence).toBe(1);
	});

	it("Should be has start object", function () {
		expect(expr.start.line).toBe(1);
		expect(expr.start.index).toBe(0);
		expect(expr.start.column).toBe(1);
		expect(expr.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(expr.end.line).toBe(1);
		expect(expr.end.index).toBe(11);
		expect(expr.end.column).toBe(12);
		expect(expr.end.virtual_column).toBe(12);
	});

	describe("Expressions", () => {
		var expressions = expr.expressions;

		it('Expressions[0] type should be "NumberLiteral"', () => {
			expect(expressions[0].type).toBe("NumberLiteral");
		});
		it('Expressions[1] type should be "NullLiteral"', () => {
			expect(expressions[1].type).toBe("NullLiteral");
		});
		it('Expressions[2] type should be "Identifier"', () => {
			expect(expressions[2].type).toBe("Identifier");
		});
		it('Expressions[3] type should be "ObjectLiteral"', () => {
			expect(expressions[3].type).toBe("ObjectLiteral");
		});
	});
});
