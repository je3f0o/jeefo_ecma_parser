/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binary_operators_specs.js
* Created at  : 2019-02-07
* Updated at  : 2019-03-30
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
    // {{{1 make_number_literal_validation(number)
    const make_number_literal_validation = number => {
        number = number.toString();

        return (symbol, streamer) => {
            expect(symbol.id).to.be("Numeric literal");
            expect(symbol.token.value).to.be(number);
            expect(streamer.substring_from_token(symbol)).to.be(number);
        };
    };

    // {{{1 make_identifier_validation(id)
    const make_identifier_validation = id => {
        return (symbol, streamer) => {
            expect(symbol.id).to.be("Identifier");
            expect(symbol.token.value).to.be(id);
            expect(streamer.substring_from_token(symbol)).to.be(id);
        };
    };

    // {{{1 make_operator_test(value)
    const make_operator_test = (value) => {
        const fn = symbol => {
            expect(symbol.id).to.be("Operator");
            expect(symbol.token.value).to.be(value);
            expect(symbol.pre_comment).to.be(null);
        };
        fn.value = value;
        return fn;
    };

    // {{{1 make_assignment_operator_test(operator)
    const make_assignment_operator_test = operator => {
		return {
            id         : "Assignment operator",
            source     : `id ${ operator } 5`,
			precedence : 3,
            left       : make_identifier_validation("id"),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test(operator)
		};
    };
    // }}}1

    const test_cases = [
		// {{{1 Exponentiation operator (15)
		{
            id         : "Exponentiation operator",
            source     : "5 ** 5",
			precedence : 15,
            left       : make_number_literal_validation(5),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("**")
		},

		// {{{1 Arithmetic operator (14)
		{
            id         : "Arithmetic operator",
            source     : "5 * 10",
			precedence : 14,
            left       : make_number_literal_validation(5),
            right      : make_number_literal_validation(10),
			operator   : make_operator_test("*")
		},
		{
            id         : "Arithmetic operator",
            source     : "5 % 10",
			precedence : 14,
            left       : make_number_literal_validation(5),
            right      : make_number_literal_validation(10),
			operator   : make_operator_test("%")
		},
		{
            id         : "Arithmetic operator",
            source     : "10 / 2",
			precedence : 14,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(2),
			operator   : make_operator_test("/")
		},

		// {{{1 Arithmetic operator (13)
		{
            id         : "Arithmetic operator",
            source     : "10 + 5",
			precedence : 13,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("+")
		},
		{
            id         : "Arithmetic operator",
            source     : "10 - 5",
			precedence : 13,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("-")
		},

		// {{{1 Bitwise shift operator (12)
		{
            id         : "Bitwise shift operator",
            source     : "10 >> 5",
			precedence : 12,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test(">>")
		},
		{
            id         : "Bitwise shift operator",
            source     : "10 << 5",
			precedence : 12,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("<<")
		},
		{
            id         : "Bitwise shift operator",
            source     : "10 >>> 5",
			precedence : 12,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test(">>>")
		},

		// {{{1 Comparision operator (11)
		{
            id         : "Comparision operator",
            source     : "10 > 5",
			precedence : 11,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test(">")
		},
		{
            id         : "Comparision operator",
            source     : "10 < 5",
			precedence : 11,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("<")
		},
		{
            id         : "Comparision operator",
            source     : "10 >= 5",
			precedence : 11,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test(">=")
		},
		{
            id         : "Comparision operator",
            source     : "10 <= 5",
			precedence : 11,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("<=")
		},

		// {{{1 Equality operator (10)
		{
            id         : "Equality operator",
            source     : "10 == 5",
			precedence : 10,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("==")
		},
		{
            id         : "Equality operator",
            source     : "10 != 5",
			precedence : 10,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("!=")
		},
		{
            id         : "Equality operator",
            source     : "10 === 5",
			precedence : 10,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("===")
		},
		{
            id         : "Equality operator",
            source     : "10 !== 5",
			precedence : 10,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("!==")
		},

		// {{{1 Bitwise and operator (9)
		{
            id         : "Bitwise and operator",
            source     : "10 & 5",
			precedence : 9,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("&")
		},

		// {{{1 Bitwise xor operator (8)
		{
            id         : "Bitwise xor operator",
            source     : "10 ^ 5",
			precedence : 8,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("^")
		},

		// {{{1 Bitwise or operator (7)
		{
            id         : "Bitwise or operator",
            source     : "10 | 5",
			precedence : 7,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("|")
		},

		// {{{1 Logical and operator (6)
		{
            id         : "Logical and operator",
            source     : "10 && 5",
			precedence : 6,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("&&")
		},

		// {{{1 Logical or operator (5)
		{
            id         : "Logical or operator",
            source     : "10 || 5",
			precedence : 5,
            left       : make_number_literal_validation(10),
            right      : make_number_literal_validation(5),
			operator   : make_operator_test("||")
		},

		// {{{1 Assignment operator (3)
        make_assignment_operator_test('='),
        make_assignment_operator_test("+="),
        make_assignment_operator_test("-="),
        make_assignment_operator_test("*="),
        make_assignment_operator_test("/="),
        make_assignment_operator_test("%="),
        make_assignment_operator_test("&="),
        make_assignment_operator_test("|="),
        make_assignment_operator_test("^="),
        make_assignment_operator_test("**="),
        make_assignment_operator_test("<<="),
        make_assignment_operator_test(">>="),
        make_assignment_operator_test(">>>="),
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
