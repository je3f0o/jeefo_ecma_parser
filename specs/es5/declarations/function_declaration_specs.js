/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_declaration_specs.js
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

describe("FunctionDeclaration", () => {
	var stmt = parser.parse("function name (a,b,c){}")[0];

	it('Type should be "FunctionDeclaration"', function () {
		expect(stmt.type).toBe("FunctionDeclaration");
	});

	it('Precedence should be (31)', function () {
		expect(stmt.precedence).toBe(31);
	});

	it('Id.type should be "Identifier"', function () {
		expect(stmt.id.type).toBe("Identifier");
	});

	it('Parameters should be (a,b,c)', function () {
		var args = stmt.parameters;
		expect(args[0].type).toBe("Identifier");
		expect(args[0].name).toBe("a");

		expect(args[1].type).toBe("Identifier");
		expect(args[1].name).toBe("b");

		expect(args[2].type).toBe("Identifier");
		expect(args[2].name).toBe("c");
	});

	it("Should be has start object", function () {
		expect(stmt.start.line).toBe(1);
		expect(stmt.start.index).toBe(0);
		expect(stmt.start.column).toBe(1);
		expect(stmt.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(stmt.end.line).toBe(1);
		expect(stmt.end.index).toBe(23);
		expect(stmt.end.column).toBe(24);
		expect(stmt.end.virtual_column).toBe(24);
	});
});
