/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : call_expression_specs.js
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

describe("CallExpression", () => {
	var stmt = parser.parse("fn(1,a,null)")[0],
		expr = stmt.expression;

	it('Statement type should be "ExpressionStatement"', function () {
		expect(stmt.type).toBe("ExpressionStatement");
	});

	it('Type should be "CallExpression"', function () {
		expect(expr.type).toBe("CallExpression");
	});

	it('Callee type should be "Identifier"', function () {
		expect(expr.callee.type).toBe("Identifier");
	});

	it('Precedence should be (18)', function () {
		expect(expr.precedence).toBe(18);
	});

	it("Arguments should be (1,a,null)", function () {
		var args = expr.arguments;
		expect(args[0].type).toBe("NumberLiteral");
		expect(args[0].value).toBe("1");

		expect(args[1].type).toBe("Identifier");
		expect(args[1].name).toBe("a");

		expect(args[2].type).toBe("NullLiteral");
	});

	it("Should be has start object", function () {
		expect(stmt.start.line).toBe(1);
		expect(stmt.start.index).toBe(0);
		expect(stmt.start.column).toBe(1);
		expect(stmt.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(stmt.end.line).toBe(1);
		expect(stmt.end.index).toBe(12);
		expect(stmt.end.column).toBe(13);
		expect(stmt.end.virtual_column).toBe(13);
	});
});
