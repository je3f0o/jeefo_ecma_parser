/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : switch_statement_specs.js
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

describe("SwitchStatement", () => {
	var stmt = parser.parse('switch (test) { case "a" : break; default: console.log("hello"); }')[0];

	it('Type should be "SwitchStatement"', function () {
		expect(stmt.type).toBe("SwitchStatement");
	});

	it('Precedence should be (31)', function () {
		expect(stmt.precedence).toBe(31);
	});

	it('Discriminant type should be "Identifier"', function () {
		expect(stmt.discriminant.type).toBe("Identifier");
	});

	it("Should be has start object", function () {
		expect(stmt.start.line).toBe(1);
		expect(stmt.start.index).toBe(0);
		expect(stmt.start.column).toBe(1);
		expect(stmt.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(stmt.end.line).toBe(1);
		expect(stmt.end.index).toBe(66);
		expect(stmt.end.column).toBe(67);
		expect(stmt.end.virtual_column).toBe(67);
	});

	describe.only("Cases", () => {
		describe.only("SwitchCase", () => {
			var switch_case = stmt.cases[0];

			it('Type should be "SwitchCase"', function () {
				expect(switch_case.type).toBe("SwitchCase");
			});

			it('Precedence should be (31)', function () {
				expect(switch_case.precedence).toBe(31);
			});

			it('Test type should be "StringLiteral"', function () {
				expect(switch_case.test.type).toBe("StringLiteral");
			});

			it('Test value should be "a"', function () {
				expect(switch_case.test.value).toBe("a");
			});

			it('Statements[0] type should be "BreakStatement"', function () {
				expect(switch_case.statements[0].type).toBe("BreakStatement");
			});
		});

		describe.only("DefaultCase", () => {
			var default_case = stmt.cases[1];

			it('Type should be "DefaultCase"', function () {
				expect(default_case.type).toBe("DefaultCase");
			});

			it('Precedence should be (31)', function () {
				expect(default_case.precedence).toBe(31);
			});

			it('Statements[0] type should be "ExpressionStatement"', function () {
				expect(default_case.statements[0].type).toBe("ExpressionStatement");
			});
		});
	});
});
