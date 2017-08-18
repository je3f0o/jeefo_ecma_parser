/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : return_statement_specs.js
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

describe("ReturnStatement", () => {
	var stmt = parser.parse("return result")[0];

	it('Type should be "ReturnStatement"', function () {
		expect(stmt.type).toBe("ReturnStatement");
	});

	it('Precedence should be (31)', function () {
		expect(stmt.precedence).toBe(31);
	});

	it('Argument should be "result"', function () {
		expect(stmt.argument.name).toBe("result");
	});

	it('Argument type should be "Identifier"', function () {
		expect(stmt.argument.type).toBe("Identifier");
	});

	it("Should be has start object", function () {
		expect(stmt.start.line).toBe(1);
		expect(stmt.start.index).toBe(0);
		expect(stmt.start.column).toBe(1);
		expect(stmt.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(stmt.end.line).toBe(1);
		expect(stmt.end.index).toBe(13);
		expect(stmt.end.column).toBe(14);
		expect(stmt.end.virtual_column).toBe(14);
	});
});
