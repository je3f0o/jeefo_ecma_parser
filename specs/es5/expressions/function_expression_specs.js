/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_expression_specs.js
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

describe("FunctionExpression", () => {
	var stmt = parser.parse("fn = function name (a,b,c){}")[0],
		expr = stmt.expression.right;

	it('Type should be "FunctionExpression"', function () {
		expect(expr.type).toBe("FunctionExpression");
	});

	it('Precedence should be (31)', function () {
		expect(expr.precedence).toBe(31);
	});

	it('Id.type should be "Identifier"', function () {
		expect(expr.id.type).toBe("Identifier");
	});

	it('Parameters should be (a,b,c)', function () {
		var args = expr.parameters;
		expect(args[0].type).toBe("Identifier");
		expect(args[0].name).toBe("a");

		expect(args[1].type).toBe("Identifier");
		expect(args[1].name).toBe("b");

		expect(args[2].type).toBe("Identifier");
		expect(args[2].name).toBe("c");
	});

	it("Should be has start object", function () {
		expect(expr.start.line).toBe(1);
		expect(expr.start.index).toBe(5);
		expect(expr.start.column).toBe(6);
		expect(expr.start.virtual_column).toBe(6);
	});

	it("Should be has end object", function () {
		expect(expr.end.line).toBe(1);
		expect(expr.end.index).toBe(28);
		expect(expr.end.column).toBe(29);
		expect(expr.end.virtual_column).toBe(29);
	});
});
