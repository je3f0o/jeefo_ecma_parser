/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : continue_statement_specs.js
* Created at  : 2019-03-01
* Updated at  : 2019-08-08
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

const expect                       = require("expect.js");
const { UnexpectedTokenException } = require("@jeefo/parser");

const parser          = require("../parser.js");
const precedence_enum = require("../../../src/es5/enums/precedence_enum");

const {
    test_range,
    test_keyword,
    test_for_each,
    test_statement,
    test_substring,
    test_delimiter,
} = require("../../helpers");

describe("Continue statement >", () => {
    const test = test_cases => {
        test_for_each(test_cases, test_case => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state();

            const streamer = parser.tokenizer.streamer;
            let node;
            try {
                node = parser.parse_next_node(precedence_enum.TERMINATION);
            } catch (e) {}

            test_statement(node, "Continue");

            it("should be has correct keyword", () => {
                test_keyword("continue", null, node.keyword, streamer);
            });

            it("should be has correct identifier", () => {
                test_case.identifier(node.identifier, streamer);
            });

            it("should be has correct terminator", () => {
                test_case.terminator(node.terminator, streamer);
            });

            test_range(test_case, node, streamer);
        });
    };

    describe("Semicolon terminated >", () => {
        test([
            // continue;
            {
                code   : "continue;",
                source : "continue;",

                identifier : node => {
                    expect(node).to.be(null);
                },
                terminator : (node, streamer) => {
                    test_delimiter(';', null, node, streamer);
                }
            },

            // continue /*a*/ label /*b*/;
            {
                code   : "continue /*a*/ label /*b*/;",
                source : "continue /*a*/ label /*b*/;",

                keyword : (node, streamer) => {
                    test_keyword("continue", null, node, streamer);
                },
                identifier : (node, streamer) => {
                    expect(node).not.to.be(null);
                    test_substring("label", streamer, node);
                },
                terminator : (node, streamer) => {
                    test_delimiter(';', "/*b*/", node, streamer);
                }
            },
        ]);
    });

    describe("Automatic semicolon insertion >", () => {
        test([
            // continue
            {
                code   : "continue",
                source : "continue",

                identifier : node => {
                    expect(node).to.be(null);
                },
                terminator : node => {
                    expect(node).to.be(null);
                }
            },

            // continue\n label;
            {
                code   : "continue",
                source : "continue\n label;",

                identifier : node => {
                    expect(node).to.be(null);
                },
                terminator : node => {
                    expect(node).to.be(null);
                }
            },

            // continue label\n;
            {
                code   : "continue label",
                source : "continue label\n;",

                identifier : (node, streamer) => {
                    expect(node).not.to.be(null);
                    test_substring("label", streamer, node);
                },
                terminator : node => {
                    expect(node).to.be(null);
                }
            },
        ]);
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // continue 123;
            {
                source : "continue 123;",
                error : error => {
                    it("should be throw: Expected an identifier instead saw: 123", () => {
                        expect(error.message).to.be("Expected an identifier instead saw: 123");
                    });

                    it("should be has token value: 123", () => {
                        expect(error.token.value).to.be("123");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error instanceof UnexpectedTokenException).to.be(true);
                    });
                }
            },
        ];

        test_for_each(error_test_cases, test_case => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state();

            try {
                parser.parse_next_node(precedence_enum.TERMINATION);
                expect("throw").to.be("failed");
            } catch (e) {
                test_case.error(e);
            }
        });
    });
});
