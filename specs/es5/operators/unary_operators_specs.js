/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : unary_operators_specs.js
* Created at  : 2019-05-24
* Updated at  : 2019-08-06
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const expect          = require("expect.js");
const parser          = require("../parser.js");
const test_source     = require("../../helpers/test_source");
const precedence_enum = require("../../../src/es5/enums/precedence_enum");

describe("Unary operators >", () => {
    describe("Valid cases >", () => {
        const make_id_tester = value => {
            return (node, streamer) => {
                expect(node.id).to.be("Identifier");
                expect(node.value).to.be(value);
                expect(streamer.substring_from_token(node)).to.be(value);
            };
        };
        const num_tester       = make_id_tester("num");
        const something_tester = make_id_tester("something");

        const generate_keyword_test = keyword => {
            return (node, streamer) => {
                expect(node.id).to.be("Keyword");
                expect(node.precedence).to.be(-1);
                expect(node.value).to.be(keyword);
                expect(streamer.substring_from_token(node)).to.be(keyword);
            };
        };

        const generate_operator_test = operator => {
            return (node, streamer) => {
                expect(node.id).to.be("Operator");
                expect(node.precedence).to.be(-1);
                expect(node.value).to.be(operator);
                expect(streamer.substring_from_token(node)).to.be(operator);
            };
        };

        const make_prefix_operator_tester = (id, operator, is_keyword) => {
            return {
                id         : `${id} operator`,
                source     : `${ operator } something`,
                precedence : precedence_enum.UNARY_PREFIX,
                keyword    : is_keyword ? generate_keyword_test(operator) : null,
                operator   : is_keyword ? null : generate_operator_test(operator),
                expression : something_tester
            };
        };

        const make_postfix_operator_tester = (id, operator) => {
            return {
                id         : `${id} operator`,
                source     : `num${ operator }`,
                precedence : precedence_enum.UNARY_POSTFIX,
                operator   : generate_operator_test(operator),
                expression : num_tester
            };
        };

        const test_cases = [
            make_prefix_operator_tester("Void"  , "void", true)  ,
            make_prefix_operator_tester("Delete", "delete", true),
            make_prefix_operator_tester("Typeof", "typeof", true),

            make_prefix_operator_tester("Logical not"      , "!")  ,
            make_prefix_operator_tester("Bitwise not"      , "~")  ,
            make_prefix_operator_tester("Positive plus"    , "+")  ,
            make_prefix_operator_tester("Negation minus"   , "-")  ,
            make_prefix_operator_tester("Prefix increment" , "++") ,
            make_prefix_operator_tester("Prefix decrement" , "--") ,

            make_postfix_operator_tester("Postfix increment", "++"),
            make_postfix_operator_tester("Postfix decrement", "--"),

            // Line seperated
            {
                id         : "Prefix increment operator",
                source     : "++\n something",
                precedence : precedence_enum.UNARY_PREFIX,
                operator   : generate_operator_test("++"),
                expression : something_tester
            },

            // New operators
            {
                id         : "New operator",
                source     : "new Constructor",
                precedence : precedence_enum.NEW_WITHOUT_ARGS,
                keyword    : generate_keyword_test("new"),
                expression : make_id_tester("Constructor")
            },
            {
                id         : "New operator",
                source     : "new Constructor()",
                precedence : precedence_enum.NEW_WITH_ARGS,
                keyword    : generate_keyword_test("new"),
                expression : (symbol, streamer) => {
                    expect(symbol.id).to.be("Function call expression");
                    expect(streamer.substring_from_token(symbol)).to.be("Constructor()");
                }
            },
            {
                id         : "New operator",
                source     : "new Function()()",
                precedence : precedence_enum.NEW_WITH_ARGS,
                keyword    : generate_keyword_test("new"),
                expression : (symbol, streamer) => {
                    expect(symbol.id).to.be("Function call expression");
                    expect(streamer.substring_from_token(symbol)).to.be("Function()()");
                }
            },
        ];

        test_cases.forEach(test_case => test_source(test_case.source, () => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state("expression");

            const streamer = parser.tokenizer.streamer;
            let node;
            try {
                node = parser.parse_next_node(0);
            } catch (e) {}

            it(`should be ${ test_case.id }`, () => {
                expect(node.id).to.be(test_case.id);
                expect(node.type).to.be("Unary operator");
                expect(node.precedence).to.be(test_case.precedence);
            });

            if (test_case.keyword) {
                it("should be has correct keyword", () => {
                    test_case.keyword(node.keyword, streamer);
                });
            }

            if (test_case.operator) {
                it("should be has correct operator", () => {
                    test_case.operator(node.operator, streamer);
                });
            }

            it("should be has correct expression", () => {
                test_case.expression(node.expression, streamer);
            });

            it("should be in exact range", () => {
                expect(streamer.substring_from_token(node)).to.be(
                    test_case.source
                );
                expect(streamer.get_current_character()).to.be(null);
                expect(streamer.cursor.position.index).to.be(
                    test_case.source.length
                );
            });
        }));
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            "void", "delete", "typeof",
            "!", "~", "+", "-", "++", "--",
            "a\n++", "a\n--",
        ];

        error_test_cases.forEach(source => test_source(source, () => {
            try {
                parser.parse(source);
                expect("throw").to.be("failed");
            } catch (error) {
                it("should be throw: Unexpected end of stream", () => {
                    expect(error.message).to.be("Unexpected end of stream");
                });

                it("should be instanceof SyntaxError", () => {
                    expect(error instanceof SyntaxError).to.be(true);
                });
            }
        }));
    });
});
