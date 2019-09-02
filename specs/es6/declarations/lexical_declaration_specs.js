/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : lexical_declaration_specs.js
* Created at  : 2019-09-02
* Updated at  : 2019-09-02
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
    test_substring,
    test_declaration,
} = require("../../helpers");

describe("Lexical declaration >", () => {
    const test = test_cases => {
        test_for_each(test_cases, test_case => {
            parser.tokenizer.init(test_case.source);

            const streamer = parser.tokenizer.streamer;
            let node;
            try {
                parser.prepare_next_state();
                node = parser.generate_next_node();
            } catch (e) {}

            test_declaration("Lexical declaration", node);

            it("should be has correct keyword", () => {
                test_case.keyword(node.keyword);
            });

            if (test_cases.bindings) {
                it("should be has correct binding list", () => {
                    test_case.bindings(node.binding_list, streamer);
                    const from = node.keyword.value.length + 1;
                    const to   = node.terminator ? -1 : 0;
                    const str  = test_case.code.slice(from, to);
                    test_substring(node, str, streamer);
                });
            }

            it("should be has correct terminator", () => {
                test_case.terminator(node.terminator);
            });

            test_range(test_case, node, streamer);
        });
    };

    describe("Semicolon terminated >", () => {
        const test_cases = [
            // let id;
            {
                code   : "let id;",
                source : "let id;",
                keyword (node) { test_terminal(node, "let"); },
                terminator (node) { test_terminal(node, ';'); },
                bindings (node) {
                    test_declaration("Binding list", node);
                    const { list, delimiters } = node;
                    expect(list.length).to.be(1);
                    expect(delimiters.length).to.be(0);
                    list.forEach(node => {
                        expect(node.id).to.be("Lexical binding");
                    });
                }
            },

            // let {} = {};
            {
                code   : "let {} = {};",
                source : "let {} = {};",
                keyword (node) { test_terminal(node, "let"); },
                terminator (node) { test_terminal(node, ';'); },
                bindings (node) {
                    test_declaration("Binding list", node);
                    const { list, delimiters } = node;
                    expect(list.length).to.be(1);
                    expect(delimiters.length).to.be(0);
                    list.forEach(node => {
                        expect(node.id).to.be("Lexical binding");
                    });
                }
            },

            // let [] = [];
            {
                code   : "let [] = [];",
                source : "let [] = [];",
                keyword (node) { test_terminal(node, "let"); },
                terminator (node) { test_terminal(node, ';'); },
                bindings (node) {
                    test_declaration("Binding list", node);
                    const { list, delimiters } = node;
                    expect(list.length).to.be(1);
                    expect(delimiters.length).to.be(0);
                    list.forEach(node => {
                        expect(node.id).to.be("Lexical binding");
                    });
                }
            },

            // const id = value;
            {
                code   : "const id = value;",
                source : "const id = value;",
                keyword (node) { test_terminal(node, "const"); },
                terminator (node) { test_terminal(node, ';'); },
                bindings (node) {
                    test_declaration("Binding list", node);
                    const { list, delimiters } = node;
                    expect(list.length).to.be(1);
                    expect(delimiters.length).to.be(0);
                    list.forEach(node => {
                        expect(node.id).to.be("Lexical binding");
                    });
                }
            },

            // const {} = {};
            {
                code   : "const {} = {};",
                source : "const {} = {};",
                keyword (node) { test_terminal(node, "const"); },
                terminator (node) { test_terminal(node, ';'); },
                bindings (node) {
                    test_declaration("Binding list", node);
                    const { list, delimiters } = node;
                    expect(list.length).to.be(1);
                    expect(delimiters.length).to.be(0);
                    list.forEach(node => {
                        expect(node.id).to.be("Lexical binding");
                    });
                }
            },

            // const [] = [];
            {
                code   : "const [] = [];",
                source : "const [] = [];",
                keyword (node) { test_terminal(node, "const"); },
                terminator (node) { test_terminal(node, ';'); },
                bindings (node) {
                    test_declaration("Binding list", node);
                    const { list, delimiters } = node;
                    expect(list.length).to.be(1);
                    expect(delimiters.length).to.be(0);
                    list.forEach(node => {
                        expect(node.id).to.be("Lexical binding");
                    });
                }
            },

            // const $var1 = value, {} = {}, [] = [];
            {
                code   : "const $var1 = value, {} = {}, [] = [];",
                source : "const $var1 = value, {} = {}, [] = [];",
                keyword (node) { test_terminal(node, "const"); },
                terminator (node) { test_terminal(node, ';'); },
                bindings (node) {
                    test_declaration("Binding list", node);
                    const { list, delimiters } = node;
                    expect(list.length).to.be(3);
                    expect(delimiters.length).to.be(2);
                    list.forEach(node => {
                        expect(node.id).to.be("Lexical binding");
                    });
                    delimiters.forEach(node => test_terminal(node, ','));
                }
            },
        ];

        test(test_cases);
    });

    describe("Automatic semicolon insertion >", () => {
        const test_cases = [
            // let id
            {
                code   : "let id",
                source : "let id",
                keyword (node) { test_terminal(node, "let"); },
                terminator (node) { expect(node).to.be(null); }
            },

            // let {} = {}
            {
                code   : "let {} = {}",
                source : "let {} = {}",
                keyword (node) { test_terminal(node, "let"); },
                terminator (node) { expect(node).to.be(null); }
            },

            // let [] = []
            {
                code   : "let [] = []",
                source : "let [] = []",
                keyword (node) { test_terminal(node, "let"); },
                terminator (node) { expect(node).to.be(null); }
            },

            // let\nterminated\ndont_care
            {
                code   : "let\nterminated",
                source : "let\nterminated\ndont_care",
                keyword (node) { test_terminal(node, "let"); },
                terminator (node) { expect(node).to.be(null); }
            },
        ];

        test(test_cases);
    });

    describe("Invalid cases >", () => {
        const error_test_cases = [
            // let
            {
                source : "let",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error instanceof SyntaxError).to.be(true);
                    });
                }
            },

            // let a a
            {
                source : "let a a",
                error : error => {
                    it("should be throw: Unexpected token", () => {
                        expect(error.message).to.be("Unexpected token");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error).to.be.an(UnexpectedTokenException);
                    });
                }
            },

            // let a =
            {
                source : "let a =",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // let a,
            {
                source : "let a,",
                error : error => {
                    it("should be throw: Unexpected end of stream", () => {
                        expect(error.message).to.be("Unexpected end of stream");
                    });

                    it("should be instanceof SyntaxError", () => {
                        expect(error).to.be.a(SyntaxError);
                    });
                }
            },

            // let 3
            {
                source : "let 3",
                error : error => {
                    it("should be throw: 'Unexpected token'", () => {
                        expect(error.message).to.be("Unexpected token");
                    });

                    it("should be instanceof UnexpectedTokenException", () => {
                        expect(error).to.be.an(UnexpectedTokenException);
                    });
                }
            },

            // let a, ,
            {
                source : "let a, ,",
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
