/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binary_operators_specs.js
* Created at  : 2019-02-07
* Updated at  : 2019-03-31
* Author      : jeefo
* Purpose     : Easier to develop. Please make me happy :)
* Description : Describe what Binary operator and unit test every single case.
*             : Make sure it is working correctly.
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const expect = require("expect.js"),
      parser = require("../../../src/es5/parser.js");

describe("Binary operators >", () => {
    // {{{1 test_id(symbol, streamer)
    const test_id = (symbol, streamer) => {
        expect(symbol.id).to.be("Identifier");
        expect(symbol.token.value).to.be("id");
        expect(streamer.substring_from_token(symbol)).to.be('id');
    };

    // {{{1 test_number(symbol, streamer)
    const test_number = (symbol, streamer) => {
        expect(symbol.id).to.be("Numeric literal");
        expect(symbol.token.value).to.be('5');
        expect(streamer.substring_from_token(symbol)).to.be('5');
    };

    // {{{1 make_operator_test(operator)
    const make_operator_tester = (id, precedence, operator) => {
		return {
            id         : id,
            source     : `id ${ operator } 5`,
			precedence : precedence,
            left       : test_id,
            right      : test_number,
			operator   : symbol => {
                expect(symbol.id).to.be("Operator");
                expect(symbol.token.value).to.be(operator);
                expect(symbol.pre_comment).to.be(null);
            }
		};
    };
    // }}}1

    const test_cases = [
		// {{{1 Exponentiation operator (15)
        make_operator_tester("Exponentiation operator", 15, "**"),

		// {{{1 Arithmetic operator (14)
        make_operator_tester("Arithmetic operator", 14, "*"),
        make_operator_tester("Arithmetic operator", 14, "%"),
        make_operator_tester("Arithmetic operator", 14, "/"),

		// {{{1 Arithmetic operator (13)
        make_operator_tester("Arithmetic operator", 13, "+"),
        make_operator_tester("Arithmetic operator", 13, "-"),

		// {{{1 Bitwise shift operator (12)
        make_operator_tester("Bitwise shift operator", 12, "<<"),
        make_operator_tester("Bitwise shift operator", 12, ">>"),
        make_operator_tester("Bitwise shift operator", 12, ">>>"),

		// {{{1 Comparision operator (11)
        make_operator_tester("Comparision operator" , 11 , ">"),
        make_operator_tester("Comparision operator" , 11 , "<"),
        make_operator_tester("Comparision operator" , 11 , ">="),
        make_operator_tester("Comparision operator" , 11 , "<="),
        make_operator_tester("In operator"          , 11 , "in"),
        make_operator_tester("Instanceof operator"  , 11 , "instanceof"),

		// {{{1 Equality operator (10)
        make_operator_tester("Equality operator", 10, "=="),
        make_operator_tester("Equality operator", 10, "!="),
        make_operator_tester("Equality operator", 10, "==="),
        make_operator_tester("Equality operator", 10, "!=="),

		// {{{1 Bitwise and operator (9)
        make_operator_tester("Bitwise and operator", 9, "&"),

		// {{{1 Bitwise xor operator (8)
        make_operator_tester("Bitwise xor operator", 8, "^"),

		// {{{1 Bitwise or operator (7)
        make_operator_tester("Bitwise or operator", 7, "|"),

		// {{{1 Logical and operator (6)
        make_operator_tester("Logical and operator", 6, "&&"),

		// {{{1 Logical or operator (5)
        make_operator_tester("Logical or operator", 5, "||"),

		// {{{1 Assignment operator (3)
        make_operator_tester("Assignment operator", 3, '='),
        make_operator_tester("Assignment operator", 3, "+="),
        make_operator_tester("Assignment operator", 3, "-="),
        make_operator_tester("Assignment operator", 3, "*="),
        make_operator_tester("Assignment operator", 3, "/="),
        make_operator_tester("Assignment operator", 3, "%="),
        make_operator_tester("Assignment operator", 3, "&="),
        make_operator_tester("Assignment operator", 3, "|="),
        make_operator_tester("Assignment operator", 3, "^="),
        make_operator_tester("Assignment operator", 3, "**="),
        make_operator_tester("Assignment operator", 3, "<<="),
        make_operator_tester("Assignment operator", 3, ">>="),
        make_operator_tester("Assignment operator", 3, ">>>="),

		// {{{1 Commented expression
		{
            id         : "Arithmetic operator",
            source     : `/*a*/ id /*b*/ + /*c*/ 5`,
			precedence : 13,
            left       : (symbol, streamer) => {
                expect(symbol.id).to.be("Identifier");
                expect(symbol.token.value).to.be("id");
                expect(symbol.pre_comment).not.to.be(null);

                expect(streamer.substring_from_token(symbol.pre_comment)).to.be("/*a*/");
                expect(streamer.substring_from_token(symbol)).to.be("/*a*/ id");
            },
            right      : (symbol, streamer) => {
                expect(symbol.id).to.be("Numeric literal");
                expect(symbol.token.value).to.be("5");
                expect(symbol.pre_comment).not.to.be(null);

                expect(streamer.substring_from_token(symbol.pre_comment)).to.be("/*c*/");
                expect(streamer.substring_from_token(symbol)).to.be("/*c*/ 5");
            },
			operator   : (symbol, streamer) => {
                expect(symbol.id).to.be("Operator");
                expect(symbol.token.value).to.be('+');
                expect(symbol.pre_comment).not.to.be(null);

                expect(streamer.substring_from_token(symbol.pre_comment)).to.be("/*b*/");
                expect(streamer.substring_from_token(symbol)).to.be("/*b*/ +");
            }
		}
        // }}}1
    ];

    test_cases.forEach(test_case => {
        describe(`Test against source text '${ test_case.source }'`, () => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state("expression");

            let symbol;
            try {
                symbol = parser.get_next_symbol(0);
            } catch (e) {}
            const streamer = parser.tokenizer.streamer;

            it(`should be ${ test_case.id }`, () => {
                expect(symbol.id).to.be(test_case.id);
                expect(symbol.type).to.be("Binary operator");
                expect(symbol.precedence).to.be(test_case.precedence);
            });

            it(`should be operator: '${ test_case.operator.value }'`, () => {
                test_case.operator(symbol.operator, streamer);
            });

            it("should be in exact range", () => {
                expect(streamer.substring_from_token(symbol)).to.be(test_case.source);
                expect(streamer.get_current_character()).to.be('');
                expect(streamer.cursor.index).to.be(test_case.source.length);
            });

            it("should be correct left symbol", () => {
                test_case.left(symbol.left, streamer);
            });

            it("should be correct right symbol", () => {
                test_case.right(symbol.right, streamer);
            });
        });
    });
});
