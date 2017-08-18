/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : while_statement_specs.js
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

describe("WhileStatement", () => {
	var stmt = parser.parse("while (true) {}")[0];

	it('Type should be "WhileStatement"', function () {
		expect(stmt.type).toBe("WhileStatement");
	});

	it('Precedence should be (31)', function () {
		expect(stmt.precedence).toBe(31);
	});

	it('Test type should be "BooleanLiteral"', function () {
		expect(stmt.test.type).toBe("BooleanLiteral");
		expect(stmt.test.value).toBe("true");
	});

	it('Body type should be "BlockStatement"', function () {
		expect(stmt.statement.type).toBe("BlockStatement");
	});

	it("Should be has start object", function () {
		expect(stmt.start.line).toBe(1);
		expect(stmt.start.index).toBe(0);
		expect(stmt.start.column).toBe(1);
		expect(stmt.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(stmt.end.line).toBe(1);
		expect(stmt.end.index).toBe(15);
		expect(stmt.end.column).toBe(16);
		expect(stmt.end.virtual_column).toBe(16);
	});
});
