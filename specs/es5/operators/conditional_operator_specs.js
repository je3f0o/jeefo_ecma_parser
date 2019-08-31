/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : conditional_operator_specs.js
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

const expect                   = require("expect.js");
const UnexpectedTokenException = require("@jeefo/parser/src/unexpected_token_exception");
const parser                   = require("../parser.js");
const test_source              = require("../../helpers/test_source");
const precedence_enum          = require("../../../src/es5/enums/precedence_enum");

describe("Ternary operator >", () => {
    describe("Valid cases >", () => {
        const make_id_tester = value => {
            return (node, streamer) => {
                expect(node.id).to.be("Identifier");
                expect(node.value).to.be(value);
                expect(streamer.substring_from_token(node)).to.be(value);
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

        const test_cases = [
            // a ? b : c
            {
                source    : "a ? b : c",
                condition : make_id_tester('a'),
                truthy    : make_id_tester('b'),
                falsy     : make_id_tester('c'),
                question  : generate_operator_test('?'),
                colon     : generate_operator_test(':'),
            },

            // /*a*/a /*b*/? /*c*/b /*d*/: /*e*/c
            {
                source       : "/*a*/a /*b*/? /*c*/b /*d*/: /*e*/c",
                expected_src : "a /*b*/? /*c*/b /*d*/: /*e*/c",
                condition    : (node, streamer) => {
                    expect(node.id).to.be("Identifier");
                    expect(node.value).to.be('a');
                    expect(
                        streamer.substring_from_token(node.pre_comment)
                    ).to.be("/*a*/");
                    expect(streamer.substring_from_token(node)).to.be("a");
                },
                truthy: (node, streamer) => {
                    expect(node.id).to.be("Identifier");
                    expect(node.value).to.be('b');
                    expect(
                        streamer.substring_from_token(node.pre_comment)
                    ).to.be("/*c*/");
                    expect(streamer.substring_from_token(node)).to.be("b");
                },
                falsy: (node, streamer) => {
                    expect(node.id).to.be("Identifier");
                    expect(node.value).to.be('c');
                    expect(
                        streamer.substring_from_token(node.pre_comment)
                    ).to.be("/*e*/");
                    expect(streamer.substring_from_token(node)).to.be("c");
                },
                question: (node, streamer) => {
                    expect(node.id).to.be("Operator");
                    expect(node.precedence).to.be(-1);
                    expect(node.value).to.be('?');
                    expect(
                        streamer.substring_from_token(node.pre_comment)
                    ).to.be("/*b*/");
                    expect(streamer.substring_from_token(node)).to.be("?");
                },
                colon: (node, streamer) => {
                    expect(node.id).to.be("Operator");
                    expect(node.precedence).to.be(-1);
                    expect(node.value).to.be(':');
                    expect(
                        streamer.substring_from_token(node.pre_comment)
                    ).to.be("/*d*/");
                    expect(streamer.substring_from_token(node)).to.be(":");
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
            } catch (e) {
                console.log(e);
                process.exit();
            }

            it("should be Conditional operator", () => {
                expect(node.id).to.be("Conditional operator");
                expect(node.type).to.be("Ternary operator");
                expect(node.precedence).to.be(precedence_enum.TERNARY);
            });

            it("should be has correct condition", () => {
                test_case.condition(node.condition, streamer);
            });

            it("should be has correct truthy expression", () => {
                test_case.truthy(node.truthy_expression, streamer);
            });

            it("should be has correct falsy expression", () => {
                test_case.falsy(node.falsy_expression, streamer);
            });

            it("should be has correct operators", () => {
                test_case.question(node.question_operator, streamer);
                test_case.colon(node.colon_operator, streamer);
            });

            it("should be in exact range", () => {
                const src = test_case.expected_src || test_case.source;
                expect(streamer.substring_from_token(node)).to.be(src);
                expect(streamer.get_current_character()).to.be(null);
                expect(streamer.cursor.position.index).to.be(
                    test_case.source.length
                );
            });
        }));
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // a ?
            {
                source : "a ?",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // a ? b :
            {
                source : "a ? b :",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // a ?:
            {
                source : "a ?:",
                error : error => {
                    it("should be throw: Unexpected token", () => {
                        expect(error.message).to.be("Unexpected token");
                    });

                    it("should be has token value: :", () => {
                        expect(error.token.value).to.be(":");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },
        ];

        error_test_cases.forEach(test_case => {
            test_source(test_case.source, () => {
                try {
                    parser.parse(test_case.source);
                    expect("throw").to.be("failed");
                } catch (e) {
                    test_case.error(e);
                }
            });
        });
    });
});
