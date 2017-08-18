/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_in_statement_specs.js
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

describe("ForInStatement", () => {
	var stmt = parser.parse("for (var a in b) {}")[0];

	it('Type should be "ForInStatement"', function () {
		expect(stmt.type).toBe("ForInStatement");
	});

	it('Precedence should be (31)', function () {
		expect(stmt.precedence).toBe(31);
	});

	it('Left should be "VariableDeclaration"', function () {
		expect(stmt.left.type).toBe("VariableDeclaration");
	});

	it('Right should be "Identifier"', function () {
		expect(stmt.right.type).toBe("Identifier");
		expect(stmt.right.name).toBe("b");
	});

	it("Should be has start object", function () {
		expect(stmt.start.line).toBe(1);
		expect(stmt.start.index).toBe(0);
		expect(stmt.start.column).toBe(1);
		expect(stmt.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(stmt.end.line).toBe(1);
		expect(stmt.end.index).toBe(19);
		expect(stmt.end.column).toBe(20);
		expect(stmt.end.virtual_column).toBe(20);
	});
});
