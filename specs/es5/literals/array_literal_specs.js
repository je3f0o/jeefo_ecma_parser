/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : array_literal_specs.js
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

describe("ArrayLiteral", () => {
	var expr     = parser.parse("[1, null, 'str', [], [,,], { a : 1 }, {}, 2 + 2]")[0],
		literal  = expr.expression,
		elements = literal.elements;

	it('Statement type should be "ExpressionStatement"', function () {
		expect(expr.type).toBe("ExpressionStatement");
	});

	it('Type should be "ArrayLiteral"', function () {
		expect(literal.type).toBe("ArrayLiteral");
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
		expect(literal.end.index).toBe(48);
		expect(literal.end.column).toBe(49);
		expect(literal.end.virtual_column).toBe(49);
	});

	describe("Elements", () => {
		it('Element[0] should be "NumberLiteral"', function () {
			var element = elements[0];
			expect(element.type).toBe("NumberLiteral");
		});

		it('Element[1] should be "NullLiteral"', function () {
			var element = elements[1];
			expect(element.type).toBe("NullLiteral");
		});

		it('Element[2] should be "StringLiteral"', function () {
			var element = elements[2];
			expect(element.type).toBe("StringLiteral");
		});

		it('Element[3] should be "ArrayLiteral"', function () {
			var element = elements[3];
			expect(element.type).toBe("ArrayLiteral");
			expect(element.elements.length).toBe(0);
		});
		it('Element[4] should be "ArrayLiteral"', function () {
			var element = elements[4];
			expect(element.elements.length).toBe(2);
		});
		it('Element[5] should be "ObjectLiteral"', function () {
			var element = elements[5];
			expect(element.type).toBe("ObjectLiteral");
			expect(element.properties.length).toBe(1);
		});
		it('Element[6] should be "ObjectLiteral"', function () {
			var element = elements[6];
			expect(element.type).toBe("ObjectLiteral");
			expect(element.properties.length).toBe(0);
		});
		it('Element[7] should be "BinaryExpression"', function () {
			var element = elements[7];
			expect(element.type).toBe("BinaryExpression");
		});
	});
});
