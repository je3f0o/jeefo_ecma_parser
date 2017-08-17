/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_specs.js
* Created at  : 2017-08-17
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

describe("VariableDeclaration", () => {
	var expr = parser.parse("var name")[0];

	it('Type should be "VariableDeclaration"', function () {
		expect(expr.type).toBe("VariableDeclaration");
	});

	it('Precedence should be (31)', function () {
		expect(expr.precedence).toBe(31);
	});

	it("Should be has start object", function () {
		expect(expr.start.line).toBe(1);
		expect(expr.start.index).toBe(0);
		expect(expr.start.column).toBe(1);
		expect(expr.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(expr.end.line).toBe(1);
		expect(expr.end.index).toBe(8);
		expect(expr.end.column).toBe(9);
		expect(expr.end.virtual_column).toBe(9);
	});

	it("Should be has declarations", function () {
		expect(expr.declarations.length).toBe(1);
	});

	describe("Automatic Semicolon Insertion", function () {
		it("Should be false", function () {
			var expr = parser.parse("var name;")[0];
			expect(expr.ASI).toBe(false);
		});
		it("Should be true", function () {
			var expr = parser.parse("var name")[0];
			expect(expr.ASI).toBe(true);
		});
	});

	describe("VariableDeclarator", function () {
		var declarator = expr.declarations[0];

		it('Declarator type should be "VariableDeclarator"', function () {
			expect(declarator.type).toBe("VariableDeclarator");
		});

		it('Declarator id.type should be "Identifier"', function () {
			expect(declarator.id.type).toBe("Identifier");
		});

		describe("Init", function () {
			it('Init should be null', function () {
				expect(declarator.init).toBe(null);
			});

			it('Init should not be null', function () {
				var declarator = parser.parse("var name = 123;")[0].declarations[0];
				expect(declarator.init !== null).toBe(true);
			});
		});
	});
});
