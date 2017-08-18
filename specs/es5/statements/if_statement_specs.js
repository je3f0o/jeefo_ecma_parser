/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : if_statement_specs.js
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

describe("IfStatement", () => {
	var stmt = parser.parse("if (true) {} else if (false) {} else {}")[0];

	it('Type should be "IfStatement"', function () {
		expect(stmt.type).toBe("IfStatement");
	});

	it('Precedence should be (31)', function () {
		expect(stmt.precedence).toBe(31);
	});

	it('Test should be true', function () {
		expect(stmt.test.type).toBe("BooleanLiteral");
		expect(stmt.test.value).toBe("true");
	});

	it('Alternate test should be false', function () {
		expect(stmt.alternate.test.type).toBe("BooleanLiteral");
		expect(stmt.alternate.test.value).toBe("false");
	});

	it("Alternate's alternate type should be BlockStatement", function () {
		expect(stmt.alternate.alternate.type).toBe("BlockStatement");
	});

	it("Should be has start object", function () {
		expect(stmt.start.line).toBe(1);
		expect(stmt.start.index).toBe(0);
		expect(stmt.start.column).toBe(1);
		expect(stmt.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(stmt.end.line).toBe(1);
		expect(stmt.end.index).toBe(39);
		expect(stmt.end.column).toBe(40);
		expect(stmt.end.virtual_column).toBe(40);
	});
});
