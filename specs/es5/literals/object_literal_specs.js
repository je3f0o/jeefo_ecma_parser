/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_literal_specs.js
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

describe.only("ObjectLiteral", () => {
	var expr       = parser.parse("{ prop : value }")[0],
		literal    = expr.expression,
		properties = literal.properties;

	it('Statement type should be "ExpressionStatement"', function () {
		expect(expr.type).toBe("ExpressionStatement");
	});

	it('Type should be "ObjectLiteral"', function () {
		expect(literal.type).toBe("ObjectLiteral");
	});

	it('Precedence should be (31)', function () {
		expect(literal.precedence).toBe(31);
	});

	it("Should be has start object", function () {
		expect(literal.start.line).toBe(1);
		expect(literal.start.index).toBe(0);
		expect(literal.start.column).toBe(1);
		expect(literal.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(literal.end.line).toBe(1);
		expect(literal.end.index).toBe(16);
		expect(literal.end.column).toBe(17);
		expect(literal.end.virtual_column).toBe(17);
	});

	describe("Property", () => {
		var property = properties[0];

		it('Property type should be "Property"', function () {
			expect(property.type).toBe("Property");
		});

		it('Key.type should be "Identifier"', function () {
			expect(property.key.type).toBe("Identifier");
		});

		it('Value.type should be "Identifier"', function () {
			expect(property.value.type).toBe("Identifier");
		});
	});
});
