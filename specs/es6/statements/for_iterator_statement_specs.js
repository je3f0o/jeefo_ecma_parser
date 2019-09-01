/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_iterator_statement_specs.js
* Created at  : 2019-09-01
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

describe("For iterator statement >", () => {
    const valid_test_cases = [
        // for (;;) {}
        {
            code   : "for (;;) {}",
            source : "for (;;) {}",
            expression (node, streamer) {
                expect(node.id).to.be("For iterator header");
                expect(node.initializer.id).to.be("For iterator initializer");
                expect(node.condition.id).to.be("For iterator condition");
                expect(node.update).to.be(null);
                test_substring(node, ";;", streamer);
            },
        },

        // for (init;cond;update) {}
        {
            code   : "for (init;cond;update) {}",
            source : "for (init;cond;update) {}",
            expression (node, streamer) {
                expect(node.id).to.be("For iterator header");
                expect(node.initializer.id).to.be("For iterator initializer");
                expect(node.condition.id).to.be("For iterator condition");
                expect(node.update).not.to.be(null);
                expect(node.update.id).to.be("Identifier");
                test_substring(node, "init;cond;update", streamer);
            },
        },

        // for (var init;cond;update) {}
        {
            code   : "for (var init;cond;update) {}",
            source : "for (var init;cond;update) {}",
            expression (node, streamer) {
                expect(node.id).to.be("For iterator header");
                expect(node.initializer.id).to.be(
                    "Variable declaration list no in"
                );
                expect(node.condition.id).to.be("For iterator condition");
                expect(node.update).not.to.be(null);
                expect(node.update.id).to.be("Identifier");
                test_substring(node, "var init;cond;update", streamer);
            },
        },

        // for (let init;cond;update) {}
        {
            code   : "for (let init;cond;update) {}",
            source : "for (let init;cond;update) {}",
            expression (node, streamer) {
                expect(node.id).to.be("For iterator header");
                expect(node.initializer.id).to.be("Lexical declaration no in");
                expect(node.condition.id).to.be("For iterator condition");
                expect(node.update).not.to.be(null);
                expect(node.update.id).to.be("Identifier");
                test_substring(node, "let init;cond;update", streamer);
            },
        },

        // for (const init = value;cond;update) {}
        {
            code   : "for (const init = value;cond;update) {}",
            source : "for (const init = value;cond;update) {}",
            expression (node, streamer) {
                expect(node.id).to.be("For iterator header");
                expect(node.initializer.id).to.be("Lexical declaration no in");
                expect(node.condition.id).to.be("For iterator condition");
                expect(node.update).not.to.be(null);
                expect(node.update.id).to.be("Identifier");
                test_substring(node, "const init = value;cond;update", streamer);
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
            // for (var $var;
            {
                source  : "for (var $var;",
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

            // for (var $var;;
            {
                source  : "for (var $var;;",
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

            // for (var i = 1, z = f in expr
            {
                source  : "for (var i = 1, z = f in expr",
                message : "Invalid left-hand side in for-in loop: Must have a single binding.",
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

            // for (let i = 1, z = f in expr
            {
                source  : "for (let i = 1, z = f in expr",
                message : "Invalid left-hand side in for-in loop: Must have a single binding.",
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

            // for (const i = 1, z = f in expr
            {
                source  : "for (const i = 1, z = f in expr",
                message : "Invalid left-hand side in for-in loop: Must have a single binding.",
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

            // for (var i = 1, z = f of expr
            {
                source  : "for (var i = 1, z = f of expr",
                message : "Invalid left-hand side in for-of loop: Must have a single binding.",
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

            // for (let i = 1, z = f of expr
            {
                source  : "for (let i = 1, z = f of expr",
                message : "Invalid left-hand side in for-of loop: Must have a single binding.",
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

            // for (const i = 1, z = f of expr
            {
                source  : "for (const i = 1, z = f of expr",
                message : "Invalid left-hand side in for-of loop: Must have a single binding.",
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
