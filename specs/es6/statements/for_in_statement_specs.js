/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_in_statement_specs.js
* Created at  : 2019-08-30
* Updated at  : 2019-08-30
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

const parser = require("../parser.js");
const {
    test_range,
    test_for_each,
    test_terminal,
    test_statement,
    test_substring,
} = require("../../helpers");

describe("For in statement >", () => {
    const valid_test_cases = [
        // for ($var in expr) {}
        {
            code   : "for ($var in expr) {}",
            source : "for ($var in expr) {}",
            expression (node, streamer) {
                expect(node.id).to.be("For in expression");
                expect(node.left.id).to.be(
                    "Assignable left hand side expression"
                );
                test_terminal(node.operator, "in");
                test_substring(node.right, "expr", streamer);
                test_substring(node, "$var in expr", streamer);
            },
        },

        /*
        // for ($var in expr) {}
        {
            code   : "for ($var in expr) {}",
            source : "for ($var in expr) {}",
            expression (node, streamer) {
                expect(node.id).to.be("For in expression");
                expect(node.left.id).to.be(
                    "Assignable left hand side expression"
                );
                test_terminal(node.operator, "in");
                test_substring(node.right, "expr", streamer);
            },
        },
        */
    ];

    test_for_each(valid_test_cases, test_case => {
        parser.tokenizer.init(test_case.source);
        const streamer = parser.tokenizer.streamer;

        let node;
        try {
            parser.prepare_next_state();
            node = parser.generate_next_node();
        } catch (e) {}

        test_statement("For", node);

        it("should be has correct terminal symbols", () => {
            test_terminal(node.keyword, "for");
            test_terminal(node.open_parenthesis, '(');
            test_terminal(node.close_parenthesis, ')');
        });

        it("should be has correct expression", () => {
            test_case.expression(node.expression, streamer);
        });

        it("should be has correct statement", () => {
            expect(node.statement.id).to.be("Block statement");
        });

        test_range(test_case, node, streamer);
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // for (var $var2 in
            {
                source  : "for (var $var2 in",
                message : "Unexpected end of stream",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // for (var $var2 = z in
            {
                source  : "for (var $var2 = z in",
                message : "Unexpected end of stream",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
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
                parser.generate_next_node();
                expect("throw").to.be("failed");
            } catch (e) {
                test_case.error(e);
            }
        });
    });
});
