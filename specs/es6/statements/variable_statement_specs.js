/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_statement_specs.js
* Created at  : 2019-08-12
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
} = require("../../helpers");

describe("Variable statement >", () => {
    const test = test_cases => {
        test_for_each(test_cases, test_case => {
            parser.tokenizer.init(test_case.source);

            const streamer = parser.tokenizer.streamer;
            let node;
            try {
                parser.prepare_next_state();
                node = parser.generate_next_node();
            } catch (e) {}

            test_statement("Variable", node);

            it("should be has correct declaration list", () => {
                expect(node.declaration_list.id).to.be(
                    "Variable declaration list"
                );
            });

            it("should be has correct terminator", () => {
                test_case.terminator(node.terminator);
            });

            test_range(test_case, node, streamer);
        });
    };

    describe("Semicolon terminated >", () => {
        const test_cases = [
            // var id;
            {
                code   : "var id;",
                source : "var id;",
                terminator (node) {
                    test_terminal(node, ';');
                }
            },

            // var {} = {};
            {
                code   : "var {} = {};",
                source : "var {} = {};",
                terminator (node) {
                    test_terminal(node, ';');
                }
            },

            // var [] = [];
            {
                code   : "var [] = [];",
                source : "var [] = [];",
                terminator (node) {
                    test_terminal(node, ';');
                }
            },
        ];

        test(test_cases);
    });

    describe("Automatic semicolon insertion >", () => {
        const test_cases = [
            // var id
            {
                code   : "var id",
                source : "var id",
                terminator (node) {
                    expect(node).to.be(null);
                }
            },

            // var {} = {}
            {
                code   : "var {} = {}",
                source : "var {} = {}",
                terminator (node) {
                    expect(node).to.be(null);
                }
            },

            // var [] = []
            {
                code   : "var [] = []",
                source : "var [] = []",
                terminator (node) {
                    expect(node).to.be(null);
                }
            },

            // var\nterminated\ndont_care
            {
                code   : "var\nterminated",
                source : "var\nterminated\ndont_care",
                terminator (node) {
                    expect(node).to.be(null);
                }
            },
        ];

        test(test_cases);
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // var
            {
                source : "var",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // var a a
            {
                source : "var a a",
                error : error => {
                    it("should be throw: Unexpected token", () => {
                        expect(error.message).to.be("Unexpected token");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error).to.be.an(UnexpectedTokenException);
                    });
                }
            },

            // var a =
            {
                source : "var a =",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // var a,
            {
                source : "var a,",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // var 3
            {
                source : "var 3",
                error : error => {
                    it("should be throw: 'Unexpected token'", () => {
                        expect(error.message).to.be("Unexpected token");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error).to.be.an(UnexpectedTokenException);
                    });
                }
            },

            // var a, ,
            {
                source : "var a, ,",
                error : error => {
                    it("should be throw: 'Unexpected token'", () => {
                        expect(error.message).to.be("Unexpected token");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error).to.be.an(UnexpectedTokenException);
                    });
                }
            },
        ];

        error_test_cases.forEach(test_case => {
            describe(`Test against source text '${ test_case.source }'`, () => {
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
});
