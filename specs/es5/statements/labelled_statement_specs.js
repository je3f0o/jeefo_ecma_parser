/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : labelled_statement_specs.js
* Created at  : 2019-04-02
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

const expect          = require("expect.js");
const parser          = require("../parser.js");
const precedence_enum = require("../../../src/es5/enums/precedence_enum");

const {
    test_range,
    test_for_each,
    test_statement,
    test_substring,
    test_delimiter,
} = require("../../helpers");

describe("Labelled statement >", () => {
    describe("Valid cases >", () => {
        const valid_test_cases = [
            // label : ;
            {
                code   : "label : ;",
                source : "label : ;",

                identifier : (node, streamer) => {
                    expect(node.id).to.be("Identifier");
                    test_substring("label", streamer, node);
                },
                delimiter : (node, streamer) => {
                    test_delimiter(":", null, node, streamer);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    test_substring(";", streamer, node);
                },
            },

            // /*a*/ label /*b*/ : /*c*/\n ;
            {
                code   : "label /*b*/ : /*c*/\n ;",
                source : "/*a*/ label /*b*/ : /*c*/\n ;",
                offset : "/*a*/ ".length,

                identifier : (node, streamer) => {
                    expect(node.id).to.be("Identifier");
                    test_substring("label", streamer, node);
                },
                delimiter : (node, streamer) => {
                    test_delimiter(":", "/*b*/", node, streamer);
                },
                statement : (node, streamer) => {
                    expect(node.type).to.be("Statement");
                    test_substring(";", streamer, node);
                },
            },
        ];

        test_for_each(valid_test_cases, test_case => {
            parser.tokenizer.init(test_case.source);
            parser.prepare_next_state();

            const streamer = parser.tokenizer.streamer;
            let node;
            try {
                node = parser.parse_next_node(precedence_enum.TERMINATION);
            } catch (e) {}

            test_statement(node, "Labelled");

            it("should be has correct identifier", () => {
                test_case.identifier(node.identifier, streamer);
            });

            it("should be has correct delimiter", () => {
                test_case.delimiter(node.delimiter, streamer);
            });

            it("should be has correct statement", () => {
                test_case.statement(node.statement, streamer);
            });

            test_range(test_case, node, streamer);
        });
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // label :
            {
                source : "label :",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
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
