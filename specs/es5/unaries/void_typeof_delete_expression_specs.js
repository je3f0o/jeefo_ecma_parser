/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : void_typeof_delete_expression_specs.js
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

describe("Void,Delete,Typeof UnaryExpression", () => {
	var stmt = parser.parse("delete something")[0],
		expr = stmt.expression;

	it('Statement type should be "ExpressionStatement"', function () {
		expect(stmt.type).toBe("ExpressionStatement");
	});

	it('Type should be "UnaryExpression"', function () {
		expect(expr.type).toBe("UnaryExpression");
	});

	it('Is prefix should be true', function () {
		expect(expr.is_prefix).toBe(true);
	});

	it("Should be has argument", function () {
		expect(expr.argument.type).toBe("Identifier");
	});

	it("Should be has start object", function () {
		expect(stmt.start.line).toBe(1);
		expect(stmt.start.index).toBe(0);
		expect(stmt.start.column).toBe(1);
		expect(stmt.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(stmt.end.line).toBe(1);
		expect(stmt.end.index).toBe(16);
		expect(stmt.end.column).toBe(17);
		expect(stmt.end.virtual_column).toBe(17);
	});

	describe("Operators", () => {
		it('Should be "delete"', function () {
			expect(expr.operator).toBe("delete");
		});

		it('Should be "void"', function () {
			var expr = parser.parse("void 123")[0].expression;
			expect(expr.operator).toBe("void");
		});

		it('Should be "typeof"', function () {
			var expr = parser.parse("typeof 123")[0].expression;
			expect(expr.operator).toBe("typeof");
		});
	});
});