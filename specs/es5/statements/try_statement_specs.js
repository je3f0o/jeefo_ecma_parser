/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : try_statement_specs.js
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

describe("TryStatement", () => {
	var stmt = parser.parse("try {} catch (e) {} finally {}")[0];

	it('Type should be "TryStatement"', function () {
		expect(stmt.type).toBe("TryStatement");
	});

	it('Precedence should be (31)', function () {
		expect(stmt.precedence).toBe(31);
	});

	it('Block type should be "BlockStatement"', function () {
		expect(stmt.block.type).toBe("BlockStatement");
	});

	it("Should be has start object", function () {
		expect(stmt.start.line).toBe(1);
		expect(stmt.start.index).toBe(0);
		expect(stmt.start.column).toBe(1);
		expect(stmt.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(stmt.end.line).toBe(1);
		expect(stmt.end.index).toBe(30);
		expect(stmt.end.column).toBe(31);
		expect(stmt.end.virtual_column).toBe(31);
	});

	describe("Handler", () => {
		it('Type should be "CatchClause"', function () {
			expect(stmt.handler.type).toBe("CatchClause");
		});
		it('Precedence should be (31)', function () {
			expect(stmt.handler.precedence).toBe(31);
		});
		it('Param type should be "Identifier"', function () {
			expect(stmt.handler.param.type).toBe("Identifier");
		});
		it('Param name should be "e"', function () {
			expect(stmt.handler.param.name).toBe("e");
		});
		it('Body type should be "BlockStatement"', function () {
			expect(stmt.handler.body.type).toBe("BlockStatement");
		});
	});

	describe("Finalizer", () => {
		it('Type should be "BlockStatement"', function () {
			expect(stmt.finalizer.type).toBe("BlockStatement");
		});
	});
});
