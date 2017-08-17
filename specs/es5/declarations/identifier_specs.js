/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier_specs.js
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

describe("Identifier", () => {
	var expr    = parser.parse("name")[0],
		literal = expr.expression;

	it('Statement type should be "ExpressionStatement"', function () {
		expect(expr.type).toBe("ExpressionStatement");
	});

	it('Type should be "Identifier"', function () {
		expect(literal.type).toBe("Identifier");
	});

	it('Precedence should be (21)', function () {
		expect(literal.precedence).toBe(21);
	});

	it('Name should be "name"', function () {
		expect(literal.name).toBe("name");
	});

	it("Should be has start object", function () {
		expect(literal.start.line).toBe(1);
		expect(literal.start.index).toBe(0);
		expect(literal.start.column).toBe(1);
		expect(literal.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(literal.end.line).toBe(1);
		expect(literal.end.index).toBe(4);
		expect(literal.end.column).toBe(5);
		expect(literal.end.virtual_column).toBe(5);
	});
});
