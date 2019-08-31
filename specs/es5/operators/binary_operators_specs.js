/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binary_operators_specs.js
* Created at  : 2019-02-07
* Updated at  : 2019-08-06
* Author      : jeefo
* Purpose     : Easier to develop. Please make me happy :)
* Description : Describe what Binary operator and unit test every single case.
*             : Make sure it is working correctly.
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const expect      = require("expect.js");
const parser      = require("../parser.js");
const test_source = require("../../helpers/test_source");

describe("Binary operators >", () => {
    const test_id = (node, streamer) => {
        expect(node.id).to.be("Identifier");
        expect(node.value).to.be("id");
        expect(streamer.substring_from_token(node)).to.be('id');
    };

    const test_number = (node, streamer) => {
        expect(node.id).to.be("Numeric literal");
        expect(node.value).to.be('5');
        expect(streamer.substring_from_token(node)).to.be('5');
    };

    const make_operator_tester = (id, precedence, operator) => {
		return {
            id         : `${id} operator`,
            source     : `id ${ operator } 5`,
			precedence : precedence,
            op         : operator,
            left       : test_id,
            right      : test_number,
			operator   : node => {
                expect(node.id).to.be("Operator");
                expect(node.value).to.be(operator);
                expect(node.pre_comment).to.be(null);
            }
		};
    };

    const test_cases = [
		// Exponentiation operator (15)
        make_operator_tester("Exponentiation", 15, "**"),

		// Arithmetic operator (14)
        make_operator_tester("Arithmetic", 14, "*"),
        make_operator_tester("Arithmetic", 14, "%"),
        make_operator_tester("Arithmetic", 14, "/"),

		// Arithmetic operator (13)
        make_operator_tester("Arithmetic", 13, "+"),
        make_operator_tester("Arithmetic", 13, "-"),

		// Bitwise shift operator (12)
        make_operator_tester("Bitwise shift", 12, "<<"),
        make_operator_tester("Bitwise shift", 12, ">>"),
        make_operator_tester("Bitwise shift", 12, ">>>"),

		// Comparision operator (11)
        make_operator_tester("Comparision" , 11 , ">"),
        make_operator_tester("Comparision" , 11 , "<"),
        make_operator_tester("Comparision" , 11 , ">="),
        make_operator_tester("Comparision" , 11 , "<="),
        make_operator_tester("In"          , 11 , "in"),
        make_operator_tester("Instanceof"  , 11 , "instanceof"),

		// Equality operator (10)
        make_operator_tester("Equality", 10, "=="),
        make_operator_tester("Equality", 10, "!="),
        make_operator_tester("Equality", 10, "==="),
        make_operator_tester("Equality", 10, "!=="),

		// Bitwise and operator (9)
        make_operator_tester("Bitwise and", 9, "&"),

		// Bitwise xor operator (8)
        make_operator_tester("Bitwise xor", 8, "^"),

		// Bitwise or operator (7)
        make_operator_tester("Bitwise or", 7, "|"),

		// Logical and operator (6)
        make_operator_tester("Logical and", 6, "&&"),

		// Logical or operator (5)
        make_operator_tester("Logical or", 5, "||"),

		// Assignment operator (3)
        make_operator_tester("Assignment", 3, '='),
        make_operator_tester("Assignment", 3, "+="),
        make_operator_tester("Assignment", 3, "-="),
        make_operator_tester("Assignment", 3, "*="),
        make_operator_tester("Assignment", 3, "/="),
        make_operator_tester("Assignment", 3, "%="),
        make_operator_tester("Assignment", 3, "&="),
        make_operator_tester("Assignment", 3, "|="),
        make_operator_tester("Assignment", 3, "^="),
        make_operator_tester("Assignment", 3, "**="),
        make_operator_tester("Assignment", 3, "<<="),
        make_operator_tester("Assignment", 3, ">>="),
        make_operator_tester("Assignment", 3, ">>>="),

		// Commented expression
		{
            id           : "Arithmetic operator",
            source       : "/*a*/ id /*b*/ + /*c*/ 5",
            expected_src : "id /*b*/ + /*c*/ 5",
			precedence   : 13,
            left : (node, streamer) => {
                expect(node.id).to.be("Identifier");
                expect(node.value).to.be("id");
                expect(node.pre_comment).not.to.be(null);

                expect(streamer.substring_from_token(
                    node.pre_comment
                )).to.be("/*a*/");
            },
            right : (node, streamer) => {
                expect(node.id).to.be("Numeric literal");
                expect(node.value).to.be("5");
                expect(node.pre_comment).not.to.be(null);

                expect(streamer.substring_from_token(
                    node.pre_comment
                )).to.be("/*c*/");
            },
			operator : (node, streamer) => {
                expect(node.id).to.be("Operator");
                expect(node.value).to.be('+');
                expect(node.pre_comment).not.to.be(null);

                expect(streamer.substring_from_token(
                    node.pre_comment
                )).to.be("/*b*/");
            }
		}
    ];

    test_cases.forEach(test_case => {
        test_source(test_case.source, () => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state("expression");

            const streamer = parser.tokenizer.streamer;
            let node;
            try {
                node = parser.parse_next_node(0);
            } catch (e) {}

            it(`should be ${ test_case.id }`, () => {
                expect(node.id).to.be(test_case.id);
                expect(node.type).to.be("Binary operator");
                expect(node.precedence).to.be(test_case.precedence);
            });

            it(`should be operator: '${ test_case.op }'`, () => {
                test_case.operator(node.operator, streamer);
            });

            it("should be in exact range", () => {
                const src = test_case.expected_src || test_case.source;
                expect(streamer.substring_from_token(node)).to.be(src);
                expect(streamer.get_current_character()).to.be(null);
                expect(streamer.cursor.position.index).to.be(
                    test_case.source.length
                );
            });

            it("should be correct left node", () => {
                test_case.left(node.left, streamer);
            });

            it("should be correct right node", () => {
                test_case.right(node.right, streamer);
            });
        });
    });
});
