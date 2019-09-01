/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_in_statement_specs.js
* Created at  : 2019-08-30
* Updated at  : 2019-09-01
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
                expect(node.id).to.be("For in header");
                expect(node.binding.id).to.be(
                    "Assignable left hand side expression"
                );
                test_terminal(node.operator, "in");
                test_substring(node.expression, "expr", streamer);
                test_substring(node, "$var in expr", streamer);
            },
        },

        // for (var $var in expr) {}
        {
            code   : "for (var $var in expr) {}",
            source : "for (var $var in expr) {}",
            expression (node, streamer) {
                expect(node.id).to.be("For in header");
                expect(node.binding.id).to.be("For binding");
                test_terminal(node.operator, "in");
                test_substring(node.expression, "expr", streamer);
                test_substring(node, "var $var in expr", streamer);
            },
        },

        // for (var $var = init in expr) {}
        {
            code   : "for (var $var = init in expr) {}",
            source : "for (var $var = init in expr) {}",
            expression (node, streamer) {
                expect(node.id).to.be("For in header");
                expect(node.binding.id).to.be(
                    "ES5 legacy variable declaration no in"
                );
                test_terminal(node.operator, "in");
                test_substring(node.expression, "expr", streamer);
                test_substring(node, "var $var = init in expr", streamer);
            },
        },

        // for (let $var in expr) {}
        {
            code   : "for (let $var in expr) {}",
            source : "for (let $var in expr) {}",
            expression (node, streamer) {
                expect(node.id).to.be("For in header");
                expect(node.binding.id).to.be("For declaration");
                test_terminal(node.operator, "in");
                test_substring(node.expression, "expr", streamer);
                test_substring(node, "let $var in expr", streamer);
            },
        },

        // for (const $var in expr) {}
        {
            code   : "for (const $var in expr) {}",
            source : "for (const $var in expr) {}",
            expression (node, streamer) {
                expect(node.id).to.be("For in header");
                expect(node.binding.id).to.be("For declaration");
                test_terminal(node.operator, "in");
                test_substring(node.expression, "expr", streamer);
                test_substring(node, "const $var in expr", streamer);
            },
        },
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

    describe("Error cases >", () => {
        const error_test_cases = [
            // for (var $var in
            {
                source  : "for (var $var in",
                message : "Unexpected end of stream",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // for (var $var = z in
            {
                source  : "for (var $var = z in",
                message : "Unexpected end of stream",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // for (i = 1 in expr
            {
                source  : "for (i = 1 in expr",
                message : "Invalid left-hand side in for-in loop",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof UnexpectedTokenException", ()=>{
                        expect(error).to.be.a(UnexpectedTokenException);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // for (let i = 1 in expr
            {
                source  : "for (let i = 1 in expr",
                message : "for-in loop variable declaration may not have an initializer.",
                error (error) {
                    it(`should be throw: '${ this.message }'`, () => {
                        expect(error.message).to.be(this.message);
                    });

                    it("should be instanceof UnexpectedTokenException", ()=>{
                        expect(error).to.be.a(UnexpectedTokenException);
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
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
